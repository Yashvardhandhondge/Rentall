import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import { COMMON_TEXT_COLOR ,COMMON_COLOR} from '../../../constants/index'

class BookingPreApproval extends React.Component {

    static propTypes = {
        content: PropTypes.shape({
            guestName: PropTypes.string.isRequired,
            hostName: PropTypes.string.isRequired,
            threadId: PropTypes.number.isRequired,
            listTitle: PropTypes.string.isRequired,
            siteName: PropTypes.string.isRequired,
        })
    };

    render() {

        const linkText = {
            color: COMMON_COLOR,
            fontSize: '16px',
            textDecoration: 'none',
            cursor: 'pointer',
        }

        const textStyle = {
            color: COMMON_TEXT_COLOR,
            backgroundColor: '#F7F7F7',
            fontFamily: 'Arial',
            fontSize: '16px',
            padding: '35px'
        };
        const { content: { guestName, hostName, threadId, listTitle, logo, siteName } } = this.props;
        let contactURL = url + '/message/' + threadId + '/renter';

        return (
            <Layout>
                <Header
                    color="rgb(255, 90, 95)"
                    backgroundColor="#F7F7F7"
                    logo={logo}
                    siteName={siteName}
                />
                <Body textStyle={textStyle}>
                    <div>
                        Hi {guestName},
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        {hostName} has pre-approved your request for {listTitle}.
                        You can go ahead and <a style={linkText} href={contactURL}>book</a> the pre-approved dates now.
                    </div>
                    <EmptySpace height={20} />
                    <EmailSignature siteName={siteName} />
                </Body>
                <Footer siteName={siteName} />
                <EmptySpace height={20} />
            </Layout>
        );
    }

}

export default BookingPreApproval;