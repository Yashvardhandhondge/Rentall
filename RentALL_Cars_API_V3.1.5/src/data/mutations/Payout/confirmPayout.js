import {
    GraphQLString as StringType
} from 'graphql';
import stripePackage from 'stripe';
import { Payout } from '../../models';
import PayoutWholeType from '../../types/PayoutWholeType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { payment } from '../../../config';
import showErrorMessage from '../../../helpers/showErrorMessage';

const stripe = stripePackage(payment.stripe.secretKey, {
    apiVersion: '2019-12-03'
});

const confirmPayout = {
    type: PayoutWholeType,
    args: {
        currentAccountId: { type: StringType }
    },
    async resolve({ request }, { currentAccountId }) {

        try {
            if (request.user && !request.user.admin) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const userId = request.user.id, payEmail = currentAccountId;
                let isVerified = true, accountInfo = null, defaultValue = false;

                if (payEmail && payEmail.toString().trim() != '') {
                    const stripeAccount = await stripe.accounts.retrieve(payEmail);
                    if (stripeAccount) {
                        accountInfo = stripeAccount && (stripeAccount.individual || stripeAccount.company);
                        if (!stripeAccount.details_submitted) {
                            isVerified = false;
                        }

                        if (stripeAccount.requirements && stripeAccount.requirements.disabled_reason) {
                            isVerified = false;
                        }

                        const isAccountExist = await Payout.findOne({
                            attributes: ['id'],
                            where: {
                                payEmail,
                                userId
                            },
                            raw: true
                        });

                        if (isAccountExist && isAccountExist.id) { // Update verification status to the existing Connect account
                            const updatePayout = await Payout.update({
                                isVerified
                            }, {
                                where: {
                                    id: isAccountExist.id
                                }
                            });

                        } else { // Create a new account
                            const createPayout = await Payout.create({
                                methodId: 2,
                                userId,
                                payEmail,
                                address1: accountInfo && accountInfo.address && accountInfo.address.line1,
                                address2: accountInfo && accountInfo.address && accountInfo.address.line2,
                                city: accountInfo && accountInfo.address && accountInfo.address.city,
                                state: accountInfo && accountInfo.address && accountInfo.address.state,
                                country: accountInfo && accountInfo.address && accountInfo.address.country,
                                zipcode: accountInfo && accountInfo.address && accountInfo.address.postal_code,
                                currency: stripeAccount.default_currency && stripeAccount.default_currency.toUpperCase(),
                                default: false,
                                last4Digits: stripeAccount.external_accounts && stripeAccount.external_accounts.data && stripeAccount.external_accounts.data.length > 0 && stripeAccount.external_accounts.data[0].last4,
                                isVerified
                            });
                        }

                        const isDefaultExist = await Payout.count({
                            where: {
                                default: true,
                                userId
                            }
                        });

                        if (isDefaultExist <= 0 && isVerified) {
                            const updatePayoutDefault = await Payout.update({
                                default: true
                            }, {
                                where: {
                                    payEmail,
                                    userId
                                }
                            });
                        }
                    }
                    return await {
                        status: 200
                    }

                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'stripeAccount' })
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'getProfile' })
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
}

export default confirmPayout