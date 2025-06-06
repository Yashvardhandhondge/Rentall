import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { url } from '../../../config';
import { COMMON_COLOR, COMMON_TEXT_COLOR } from '../../../constants/index';
class ForgotPasswordEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      siteName: PropTypes.string.isRequired,
    })
  };

  render() {
    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'normal',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: COMMON_COLOR,
      backgroundColor: COMMON_COLOR,
      color: '#ffffff',
      borderTopWidth: '1px',
    };

    const textStyle = {
      color: COMMON_TEXT_COLOR,
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px'
    };
    const { content: { token, email, name, logo, siteName } } = this.props;
    let verificationURL = url + `/password/verification?token=${token}&email=${email}`;

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
            Hi {name},
          </div>
          <EmptySpace height={20} />
          <div>
            We’ve received a request to reset your password.
          </div>
          <EmptySpace height={20} />
          <div>
            If you didn’t make the request, just ignore this message. Otherwise, you can reset your password using this link:
          </div>
          <EmptySpace height={40} />
          <div>
            <a style={buttonStyle} href={verificationURL}>Click here to reset your password</a>
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

export default ForgotPasswordEmail;