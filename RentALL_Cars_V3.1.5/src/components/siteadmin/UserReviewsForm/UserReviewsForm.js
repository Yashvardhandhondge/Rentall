import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { graphql, compose } from 'react-apollo';
import { Field, reduxForm, reset } from 'redux-form';
// Style
import {
    Button,
    Row,
    FormGroup,
    Col,
    ControlLabel,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// Component
import AdminStarRating from '../AdminStarRating';
import Link from '../../Link';
// Redirection
import history from '../../../core/history';
// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import CommonFormComponent from '../../CommonField/CommonFormComponent';
// GraphQL
import WriteUserReviewMutation from './WriteUserReviewMutation.graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import messages from '../../../locale/messages';
import validate from './validate';
import s from './UserReviewsForm.css';
import cp from '../../../components/commonStyle.css';

class UserReviewsForm extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        initialValues: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
    }


    renderStarRating = ({ input, label, meta: { touched, error }, className, children }, value) => {
        const { formatMessage } = this.props.intl;
        return (
            <FormGroup className={s.space3}>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew} >{label}</label>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <span className={s.starSize}>
                            <AdminStarRating
                                name={input.name}
                                change={input.onChange}
                                value={input.value}
                                editing={true}
                            />
                            {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                        </span>
                    </Col>
                </Row>
            </FormGroup>
        )
    }

    async submitForm(values, dispatch) {
        const { mutate } = this.props;
        const { data } = await mutate({ variables: values });
        if (data?.writeUserReview) {
            if (data?.writeUserReview?.status === '200') {
                if (values.id) {
                    showToaster({ messageId: 'updateUserReview', toasterType: 'success' })
                    history.push('/siteadmin/user-reviews')
                } else {
                    showToaster({ messageId: 'updateUserReview', toasterType: 'success' })
                    //dispatch(reset('UserReviewsForm'));
                    //history.push('/siteadmin/user-reviews')
                }
            } else if (data?.writeUserReview?.status === '404') {
                showToaster({ messageId: 'listIdNotAvailable', toasterType: 'error' })
            } else {
                showToaster({ messageId: 'adminReviewFailed', toasterType: 'error' })
            }
        }
    }

    render() {
        const { error, handleSubmit, submitting, title, initialValues } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL')}>
                <div>
                    <h1 className={s.headerTitle}>{title}</h1>
                    <Col xs={12} sm={12} md={8} lg={7} className={s.blockcenter}>
                        <div className={cx(s.space4, cp.textAlignRight, 'textAlignLeftRTL')}>
                            <Link to={'/siteadmin/user-reviews'} className={cx(cp.btnPrimaryBorder, cp.btnlarge)}>
                                <FormattedMessage {...messages.goBack} />
                            </Link>
                        </div>
                        <div className={s.panelHeader}>
                            <form onSubmit={handleSubmit(this.submitForm)}>
                                {error && <strong>{formatMessage(error)}</strong>}
                                <FormGroup className={s.space3}>
                                    <ControlLabel className={cp.labelTextNew}>
                                        <FormattedMessage {...messages.reviewContentLabel} />
                                    </ControlLabel>
                                    <Field name="reviewContent"
                                        component={CommonFormComponent}
                                        inputClass={s.textareaInput}
                                        componentClass={'textarea'}
                                        label={formatMessage(messages.reviewContentLabel)} />
                                </FormGroup>
                                <Field name="rating"
                                    component={this.renderStarRating}
                                    label={formatMessage(messages.reviewRating)} />
                                <FormGroup className={s.noMargin}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} className={cx(cp.textAlignRight, 'textAlignLeftRTL')}>
                                            <Button className={cx(cp.btnPrimary, cp.btnlarge)} type="submit" disabled={submitting} >
                                                <FormattedMessage {...messages.submit} />
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                </div>
            </div>
        );
    }

}

UserReviewsForm = reduxForm({
    form: 'UserReviewsForm', // a unique name for this form
    validate
})(UserReviewsForm);

export default compose(injectIntl,
    withStyles(s, cp),
    graphql(WriteUserReviewMutation)
)(UserReviewsForm);