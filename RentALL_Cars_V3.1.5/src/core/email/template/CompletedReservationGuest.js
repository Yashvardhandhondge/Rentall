import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, profilePhotouploadDir } from '../../../config';
import { COMMON_COLOR, COMMON_TEXT_COLOR } from '../../../constants/index';
import { photosShow } from '../../../helpers/photosShow';

class CompletedReservationGuest extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      reservationId: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      hostLastName: PropTypes.string.isRequired,
      hostProfilePic: PropTypes.string.isRequired,
      siteName: PropTypes.string.isRequired,
    }).isRequired
  };

  render() {
    const textStyle = {
      color: COMMON_TEXT_COLOR,
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '10px',
      textAlign: 'center'
    };

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

    const bookingTitle = {
      paddingBottom: '20px',
      fontWeight: 'bold',
      fontSize: '20px',
      lineHeight: '25px',
      margin: '0',
      padding: '0',
      textAlign: 'center'

    }

    const profilePic = {
      borderRadius: '999px',
      margin: '0',
      padding: '0',
      lineHeight: '150%',
      borderSpacing: '0',
      width: '125px'
    }

    const userName = {
      color: '#565a5c',
      fontSize: '26px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    }

    const subTitle = {
      color: '#565a5c',
      fontSize: '18px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    }

    const { content: { reservationId, logo, siteName } } = this.props;
    const { content: { hostName, hostLastName, hostProfilePic } } = this.props;
    let messageURL = url + '/review/write/' + reservationId;
    let imageURL, path;
    path = photosShow(profilePhotouploadDir)
    if (hostProfilePic) {
      imageURL = url + `${path}medium_` + hostProfilePic;
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
                    {
                      hostProfilePic && <img style={profilePic} src={imageURL} height={125} />
                    }
                  </div>
                  <EmptySpace height={20} />
                  <h1 style={bookingTitle}>
                    Tell {hostName} {hostLastName} what you loved <br />
                    <span> and what they can do better</span>
                  </h1>
                  <EmptySpace height={20} />
                  <div>
                    You have just ended your trip, so now it is the perfect time to write your review.
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Reviews are an important part of the {siteName} community. Please take a moment to provide your owner with some helpful feedback -
                    it'll only take few minutes.
                  </div>
                  <EmptySpace height={50} />
                  <div>
                    <a href={messageURL} style={buttonStyle}>Write a Review</a>
                  </div>
                  <EmptySpace height={40} />
                </TD>
              </TR>
            </TBody>
          </Table>
          <EmptySpace height={50} />
        </div>
        <Footer siteName={siteName} />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default CompletedReservationGuest;