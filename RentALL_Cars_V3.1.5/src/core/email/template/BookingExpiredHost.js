import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class BookingExpiredHost extends Component {
	static propTypes = {
		content: PropTypes.shape({
			guestName: PropTypes.string.isRequired,
			hostName: PropTypes.string.isRequired,
			listTitle: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
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

		const { content: { hostName, guestName, listTitle, confirmationCode, logo, siteName } } = this.props;
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
										Booking for your car ({confirmationCode}) from {guestName} has expired.
										{' '}{guestName} will be fully refunded.
									</div>
									<EmptySpace height={40} />
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

export default BookingExpiredHost;
