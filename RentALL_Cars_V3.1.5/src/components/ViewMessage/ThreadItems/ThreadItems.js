import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import cx from 'classnames';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Components
import Status from './Status';
import ToMessage from './ToMessage';
import FromMessage from './FromMessage';

// Locale
import messages from '../../../locale/messages';

import s from '../ViewMessage.css';
import cs from '../../commonStyle.css'

class ThreadItems extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    threadId: PropTypes.number.isRequired,
    userType: PropTypes.string.isRequired,
    data: PropTypes.shape({
      guestProfile: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        picture: PropTypes.string,
        displayName: PropTypes.string.isRequired,
      }),
      hostProfile: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        picture: PropTypes.string,
        displayName: PropTypes.string.isRequired,
      }),
      threadItems: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        content: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        sentBy: PropTypes.string.isRequired,
      })),
      threadItemsCount: PropTypes.number.isRequired,
    }),
  };

  static defaultProps = {
    data: {
      threadItems: [],
      threadItemsCount: 0,
    },
  };

  render() {
    const { data, data: { threadItems, threadItemsCount }, userType, loadMore } = this.props;

    if (threadItems != null && threadItems.length > 0) {
      return (
        <div>

          {
            threadItems != null && threadItems.length > 0 && threadItems.map((item, index) => (
              <div key={index}>
                {
                  item.type && item.type != 'message' && <Status
                    type={item.type}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'renter' && item.sentBy === data.host && item.content != null && <FromMessage
                    profileId={data.hostProfile.profileId}
                    picture={data.hostProfile.picture}
                    displayName={data.hostProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'renter' && item.sentBy === data.guest && item.content != null && <ToMessage
                    profileId={data.guestProfile.profileId}
                    picture={data.guestProfile.picture}
                    displayName={data.guestProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'owner' && item.sentBy === data.guest && item.content != null && <FromMessage
                    profileId={data.guestProfile.profileId}
                    picture={data.guestProfile.picture}
                    displayName={data.guestProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'owner' && item.sentBy === data.host && item.content != null && <ToMessage
                    profileId={data.hostProfile.profileId}
                    picture={data.hostProfile.picture}
                    displayName={data.hostProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
              </div>
            ))
          }
          {
            data && threadItems && threadItems.length < threadItemsCount && <div className={cx(cs.textAlignCenter)}>
              <Button onClick={() => loadMore()} className={cx(cs.btnPrimary, cs.btnBig)}><FormattedMessage {...messages.loadMore} /></Button>
            </div>
          }

        </div>
      );
    }
    return (
      <div> <FormattedMessage {...messages.noItmesFound} /> </div>
    );
  }
}

export default injectIntl(withStyles(s, cs)(ThreadItems));

