import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import CurrencyView from '../modules/CurrencyView';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class CancelledByGuest extends Component {
	static propTypes = {
		content: PropTypes.shape({
			hostName: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
			checkIn: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			listTitle: PropTypes.string.isRequired,
			payoutToHost: PropTypes.number.isRequired,
			currency: PropTypes.string.isRequired,
			siteName: PropTypes.string.isRequired,
		}).isRequired
	};

	render() {
		const textStyle = {
			color: COMMON_TEXT_COLOR,
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px',
		};

		const { content: { guestName, hostName, confirmationCode, checkIn, listTitle, payoutToHost, currency, logo, siteName } } = this.props;
		let checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '',
			momentStartDate = moment(checkIn).startOf('day'), today = moment();
		let interval = momentStartDate.diff(today, 'days'), isPastDay = false;
		if (interval < 0) {
			isPastDay = true;
		}

		return (
			<Layout>
				<Header
					color="rgb(255, 90, 95)"
					backgroundColor="#F7F7F7"
					logo={logo}
					siteName={siteName}
				/>
				<div>
					<Table width="100%" >
						<TBody>
							<TR>
								<TD style={textStyle}>
									<EmptySpace height={20} />
									<div>
										Hi {hostName},
									</div>
									<EmptySpace height={20} />
									<div>
										We regret to inform you that your renter {guestName} has cancelled your request
										{' '}{confirmationCode} that was scheduled on {checkInDate}.
										{
											payoutToHost > 0 && <span> As per the cancellation policy, your payout will be
												updated to <CurrencyView amount={payoutToHost} currency={currency} />.
											</span>
										}
										{
											payoutToHost === 0 && <span> As per the cancellation policy, you will not
												receive any payouts for this booking.
											</span>
										}
										<EmptySpace height={10} />
										<p>Your calendar has also been updated to show that the previously booked dates are now available.</p>
									</div>
									<EmptySpace height={20} />
									<EmailSignature siteName={siteName} />
								</TD>
							</TR>
						</TBody>
					</Table>
					<EmptySpace height={40} />
				</div>
				<Footer siteName={siteName} />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default CancelledByGuest;
