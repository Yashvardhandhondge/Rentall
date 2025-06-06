import stripePackage from 'stripe';
import { payment } from '../../../config';
const stripe = stripePackage(payment.stripe.secretKey);
import { Reservation, Currencies, CurrencyRates, TransactionHistory, CancellationDetails } from '../../../data/models';
import { convert } from '../../../helpers/currencyConvertion';
import { isZeroDecimalCurrency } from '../../../helpers/zeroDecimalCurrency';
import { createFailedTransactionHistory } from '../payout/createFailedTransactionHistory';
import { createTransactionHistory } from './helpers/createTransactionHistory';
import { updateReservationData } from '../../../helpers/updateReservationData';

const stripePayout = app => {
	app.post('/stripe-payout', async function (req, res) {

		if (req.user && req.user.admin == true) {
			const reservationDetails = req.body.reservationDetails;
			let destination, transfer_group, amount, reservationId, currency;
			let status = 200, errorMessage, payout, userId, hostEmail, payoutId;
			if (reservationDetails) {
				destination = reservationDetails.destination;
				transfer_group = reservationDetails.transfer_group;
				amount = reservationDetails.amount;
				currency = reservationDetails.currency;
				reservationId = reservationDetails.reservationId;
				userId = reservationDetails.userId;
				hostEmail = reservationDetails.hostEmail;
				payoutId = reservationDetails.payoutId;

				const transactionHistory = await TransactionHistory.findOne({
					where: {
						reservationId,
						payoutType: 'payout'
					}
				})

				if (transactionHistory) {
					status = 400;
					errorMessage = 'Invalid request';
				} else {
					const reservation = await Reservation.findOne({
						where: { id: reservationId },
						raw: true
					});

					var ratesData = {};
					const data = await CurrencyRates.findAll();
					const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
					if (data) {
						data.map((item) => {
							ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
						})
					};

					if (reservation) {
						if (reservation.reservationState == 'completed') {
							let reservationPayoutAmount = reservation.total - reservation.hostServiceFee;
							let reservationAmountConversion = convert(base.symbol, ratesData, reservationPayoutAmount, reservation.currency, currency);
							amount <= reservationAmountConversion.toFixed(2)
								?
								status = 200 : (status = 400, errorMessage = 'Invalid request');
						} else if (reservation.reservationState == 'cancelled') {
							let cancelData = await CancellationDetails.findOne({
								where: {
									reservationId
								}
							});
							let cancelDataAmount = convert(base.symbol, ratesData, cancelData.payoutToHost, cancelData.currency, currency);
							amount <= cancelDataAmount.toFixed(2)
								?
								status = 200 : (status = 400, errorMessage = 'Invalid request');
						} else {
							status = 400;
							errorMessage = 'Invalid request';
						}
					} else {
						status = 400;
						errorMessage = 'Invalid request';
					}
				}

			} else {
				status = 400;
				errorMessage = 'Something Went Wrong, please try again';
			}

			if (status === 200) {
				try {
					payout = await stripe.transfers.create({
						amount: isZeroDecimalCurrency(currency) ? Math.round(amount) : Math.round(amount * 100),
						currency,
						destination,
						transfer_group,
						metadata: {
							reservationId,
							type: 'payout',
							hostEmail: hostEmail
						}
					});
				} catch (error) {
					status = 400;
					errorMessage = error.message;
				}
			}

			if (status === 200 && payout && 'id' in payout) {
				await createTransactionHistory(
					reservationDetails.reservationId,
					hostEmail,
					payoutId,
					payout.id,
					reservationDetails.amount,
					reservationDetails.currency,
					userId,
					2,
					'payout'
				);
				await updateReservationData({ id: reservationId, updateData: { payoutTransactionId: payout?.id } });
			} else {
				await createFailedTransactionHistory(
					reservationDetails.reservationId,
					userId,
					reservationDetails.amount,
					reservationDetails.currency,
					errorMessage,
					2
				);
			}
			res.send({ status, errorMessage });
		} else {
			return res.send({ status: 400, errorMessage: 'User not authenticated' });
		}
		
	});
};

export default stripePayout;