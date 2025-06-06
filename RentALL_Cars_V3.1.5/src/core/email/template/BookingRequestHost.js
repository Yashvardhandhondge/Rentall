import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import CurrencyView from '../modules/CurrencyView';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import { COMMON_COLOR, COMMON_TEXT_COLOR } from '../../../constants/index';

class BookingRequestHost extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      reservationId: PropTypes.number.isRequired,
      confirmationCode: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      basePrice: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      hostServiceFee: PropTypes.number.isRequired,
      siteName: PropTypes.string.isRequired
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

    const btnCenter = {
      textAlign: 'center'
    }

    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: COMMON_COLOR,
      backgroundColor: COMMON_COLOR,
      color: '#ffffff',
      borderTopWidth: '1px',

    }


    const { content: { reservationId, confirmationCode, hostName, guestName, checkIn, checkOut, threadId } } = this.props;
    const { content: { listTitle, basePrice, total, hostServiceFee, currency, logo, siteName } } = this.props;

    let checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
    let checkOutDate = checkOut != null ? moment(checkOut).format('ddd, Do MMM, YYYY') : '';
    // let actionURL = url + '/reservation/current'; 
    let actionURL = url + '/message/' + threadId + '/owner';
    let subtotal = total - hostServiceFee;
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
                    Great News! You have a new trip({confirmationCode}) from {guestName}
                  </div>
                  <EmptySpace height={10} />
                  <div>
                    {guestName} would take the car from {checkInDate} to {checkOutDate}.
                  </div>
                  <EmptySpace height={10} />
                  <div>
                    Based on price of <CurrencyView amount={basePrice} currency={currency} />
                    {' '}per day with the associated cost, your estimated payment for this booking is <CurrencyView amount={subtotal} currency={currency} />
                  </div>
                  <EmptySpace height={40} />
                  <div style={btnCenter}>
                    <a href={actionURL} style={buttonStyle}>Accept or Decline</a>
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

export default injectIntl(BookingRequestHost);