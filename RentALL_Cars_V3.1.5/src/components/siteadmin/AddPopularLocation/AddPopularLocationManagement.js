import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import {
  Button,
  Row,
  FormGroup,
  Col,
  ControlLabel,
} from 'react-bootstrap';
import Uploader from './Uploader';
import PlaceGeoSuggest from '../../Common/GeoSuggest/PlaceGeoSuggest';
import CommonFormComponent from '../../CommonField/CommonFormComponent';
import messages from '../../../locale/messages';
import submit from './submit';
import validate from './validate';
import Link from '../../Link';

import arrowIcon from '/public/AdminIcons/backArrow.svg';

import s from './AddPopularLocationManagement.css';
import cs from '../../../components/commonStyle.css';
class AddPopularLocationManagement extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    data: []
  };

  onSuggestSelect = (data, value) => {
    const { change } = this.props;
    if (value) {
      change('locationAddress', value);
    }
  }

  onTextChange = (value) => {
    const { change } = this.props;
    if (value && value?.trim() === '') {
      change('locationAddress', value);
    }
  }

  renderPlacesSuggest = ({ input, label, meta: { touched, error } }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={s.space2}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <label className={s.labelTextNew} >{label}</label>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <PlaceGeoSuggest
              {...input}
              placeholder={label}
              onSuggestSelect={this.onSuggestSelect}
              onChange={this.onTextChange}
              id={'addPopular'}
              containerClassName='siteAdminPopularLocation'
            />
            {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
          </Col>
        </Row>
      </FormGroup>
    )
  }


  render() {
    const { error, handleSubmit, submitting, dispatch, initialValues, title } = this.props;
    const { data } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className={cx(s.pagecontentWrapper, 'addpopular-autocomplete', 'pagecontentWrapperRTL')}>
        <div className={cx(cs.adminContentPadding)}>
          <div className={s.sectionCenter}>
            <div className={cx(cs.textAlignRight, cs.mobileDisplayBlock, 'textAlignLeftRTL', cs.spaceBottom4)}>
              <Link to={'/siteadmin/popularlocation'} className={cx(cs.siteLinkColor, cs.commonContentText, cs.fontWeightMedium, cs.commomLinkborderBottom, cs.textDecorationNone)}>
                <img src={arrowIcon} className={cx(cs.backArrowStyle, 'adminGoBackArrowRTL')} />
                <FormattedMessage {...messages.goBack} />
              </Link>
            </div>
            <div className={cs.commonAdminBorderSection}>
              <h1 className={s.headerTitle}><FormattedMessage {...messages.addPopularLocation} /></h1>
              <form onSubmit={handleSubmit(submit)}>
                {error && <strong>{formatMessage(error)}</strong>}
                <FormGroup className={s.space3}>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <label className={cs.labelTextNew} ><FormattedMessage {...messages.imageLabel} /></label>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Uploader />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cs.labelTextNew}>
                    <FormattedMessage {...messages.location} />
                  </ControlLabel>
                  <Field name="location" type="text" component={CommonFormComponent} inputClass={cx(cs.formControlInput)} label={formatMessage(messages.location)} />
                </FormGroup>
                <Field name="locationAddress" type="text" component={this.renderPlacesSuggest} label={formatMessage(messages.locationAddress)} />
                <FormGroup className={s.noMargin}>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12} className={cs.textAlignRight}>
                      <Button className={cx(cs.btnPrimary, cs.btnlarge)} type="submit" disabled={submitting} >
                        <FormattedMessage {...messages.save} />
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

AddPopularLocationManagement = reduxForm({
  form: 'AddPopularLocation', // a unique name for this form
  validate
})(AddPopularLocationManagement);

const mapState = (state) => ({
});

const mapDispatch = {

};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(AddPopularLocationManagement)));