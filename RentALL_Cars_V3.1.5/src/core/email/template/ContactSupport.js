import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class ContactSupport extends React.Component {

    static propTypes = {
        content: PropTypes.shape({
            ContactMessage: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            userType: PropTypes.string.isRequired,
            listId: PropTypes.number.isRequired,
            confirmationCode: PropTypes.number.isRequired,
            siteName: PropTypes.string.isRequired,
        })
    };

    render() {

        const textStyle = {
            color: COMMON_TEXT_COLOR,
            backgroundColor: '#F7F7F7',
            fontFamily: 'Arial',
            fontSize: '16px',
            padding: '35px'
        };
        let textBold = {
            fontWeight: 'bold'
        }
        const { content: { ContactMessage, email, name, confirmationCode, userType, listId, logo, siteName } } = this.props;

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
                        Hi Admin,
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        A {userType} wanted to contact you for the support, regarding resevation #{confirmationCode} on the property ID {listId}.
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        <span style={textBold}>Contacter Name:</span> {name}<br />
                        <span style={textBold}>Contacter Email:</span> {email}<br />
                        <span style={textBold}>Message:</span> {ContactMessage}<br />
                    </div>
                    <EmptySpace height={30} />
                    <EmailSignature siteName={siteName} />
                </Body>
                <Footer siteName={siteName} />
                <EmptySpace height={20} />
            </Layout>
        );
    }

}

export default ContactSupport;