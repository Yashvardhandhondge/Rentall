import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// Redux
import { connect } from 'react-redux';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Component
import Avatar from '../../Avatar';
import Link from '../../Link';

// Redux Action
import { readMessage } from '../../../actions/message/readMessage';

import s from '../Inbox.css';

class InboxItem extends Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		status: PropTypes.string,
		threadId: PropTypes.number.isRequired,
		profileId: PropTypes.number.isRequired,
		picture: PropTypes.string,
		displayName: PropTypes.string.isRequired,
		content: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
		startDate: PropTypes.string,
		endDate: PropTypes.string,
		sentBy: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		country: PropTypes.string.isRequired,
		read: PropTypes.bool.isRequired,
		account: PropTypes.shape({
			userId: PropTypes.string.isRequired
		}),
		readMessage: PropTypes.any.isRequired
	};

	static defaultProps = {
		createdAt: null,
		startDate: null,
		endDate: null,
		picture: null,
		status: null,
		sentBy: null,
		read: false
	}

	render() {
		const { type, threadId, profileId, picture, displayName, content, createdAt, startDate, endDate } = this.props;
		const { city, state, country, status, sentBy, read } = this.props;
		let createdDate, start, end;
		createdDate = createdAt != null ? moment(createdAt).format('MM/DD/YYYY') : '';
		start = startDate != null ? '(' + moment(startDate).utc().format('MM/DD/YYYY') : '';
		end = endDate != null ? ' - ' + moment(endDate).utc().format('MM/DD/YYYY') + ')' : '';
		const { readMessage } = this.props;
		return (
			<li className={s.PanelBody}>
				<div className={cx(s.displayTable, s.inboxBg)}>
					<div className={s.displayTableRow}>
						<div className={cx(s.displayTableCell, s.IconWidth)}>
							<Avatar
								source={picture}
								height={70}
								width={70}
								title={displayName}
								className={s.profileAvatar}
								withLink
								linkClassName={s.profileAvatarLink}
								profileId={profileId}
							/>
						</div>
						<div className={cx(s.displayTableCell, s.rightBg)}>
							<div className={s.displayTable}>
								<div className={s.displayTableRow}>
									<div className={cx(s.displayTableCell, s.timeWidth, s.displayBlock)}>
										<div className={s.textTruncate}>{displayName}</div>

										<time>{createdDate}</time>
									</div>
									<div className={cx(s.displayTableCell, s.addressWidth, s.displayBlock)}>
										<Link
											to={"/message/" + threadId + "/" + type}
											className={cx(s.textMuted)}
											onClick={() => readMessage(threadId, type)}
										>
											<div className={cx(s.threadBody)}>
												<span>{content}</span>
												<div className={cx(s.textMuted, s.showLg)}>
													<span>{city}, {state}, {country} {start} {end}</span>
												</div>
											</div>
										</Link>
									</div>
									<div className={cx(s.displayTableCell, s.btnWidth, s.displayBlock)}>
										{status}
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</li>
		);
	}
}

const mapState = (state) => ({});

const mapDispatch = {
	readMessage
};

export default withStyles(s)(connect(mapState, mapDispatch)(InboxItem));
