
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {
  Button,
  Col
} from 'react-bootstrap';
import cx from 'classnames';
import moment from 'moment';
import { MdClear } from 'react-icons/md';

// Redux
import { connect } from 'react-redux';

// Redux form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

// Components
import DateRange from '../../DateRange';

// Submit Action
import submit from '../../SearchForm/submit';

import { setPersonalizedValues } from '../../../../actions/personalized';

// Locale
import messages from '../../../../locale/messages';

import s from './Dates.css';

class Dates extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool
  };

  static defaultProps = {
    isExpand: false,
    smallDevice: false,
    verySmallDevice: false
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setBtnWrapperRef = this.setBtnWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  async handleSubmit() {
    const { className, handleTabToggle, isExpand, handleSubmit } = this.props;
    const { change, submitForm, personalized, setPersonalizedValues } = this.props;
    let endDate;
    if (personalized?.startDate && !personalized.endDate) {
      endDate = moment(personalized?.startDate).add('days', 1).format("YYYY-MM-DD");
      setPersonalizedValues({ name: 'endDate', value: endDate });
      change('dates', `'${moment(personalized?.startDate).format("YYYY-MM-DD")}' AND '${moment(endDate).format("YYYY-MM-DD")}'`)
    }
    await change('currentPage', 1);
    await handleSubmit();
    handleTabToggle('dates', !isExpand);
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm, setPersonalizedValues } = this.props;
    change('dates', null);
    setPersonalizedValues({ name: 'startDate', value: null });
    setPersonalizedValues({ name: 'endDate', value: null });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setBtnWrapperRef(node) {
    this.btnWrapperRef = node;
  }

  async handleClickOutside(event) {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm, personalized, setPersonalizedValues, handleSubmit } = this.props;
    let endDate;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (personalized?.startDate && !personalized.endDate) {
        endDate = moment(personalized?.startDate).add('days', 1).format("YYYY-MM-DD");
        setPersonalizedValues({ name: 'endDate', value: endDate });
        change('dates', `'${moment(personalized?.startDate).format("YYYY-MM-DD")}' AND '${moment(endDate).format("YYYY-MM-DD")}'`)
      }
      change('currentPage', 1);
      await handleSubmit();
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle('dates', !isExpand);
      }
    }
  }

  renderDateRange = ({ input, label, meta: { touched, error }, className, formName, numberOfMonths }) => {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, change, smallDevice, verySmallDevice } = this.props;
    return (
      <div className={cx('searchFilter', s.space4, { [s.spaceTop4]: smallDevice == true })}>
        <DateRange
          {...input}
          formName={formName}
          numberOfMonths={numberOfMonths}
          onChange={(value) => {
            input.onChange(value);
          }}
          smallDevice={smallDevice}
          verySmallDevice={verySmallDevice}
        />
      </div>
    )
  }

  render() {
    const { className, handleTabToggle, isExpand, personalized, smallDevice, filterIcon } = this.props;
    const { formatMessage } = this.props.intl;

    let buttonLabel = isExpand ? formatMessage(messages.checkIn) + ' - ' + formatMessage(messages.checkOut) : formatMessage(messages.dateOnly);
    let isActive = false;
    if (personalized) {
      if (personalized?.startDate && !personalized.endDate) {
        buttonLabel = moment(personalized?.startDate).format('MMM D') + ' - ' + formatMessage(messages.checkOut);
        isActive = true;
      } else if (!personalized.startDate && personalized?.endDate) {
        buttonLabel = formatMessage(messages.checkIn) + ' - ' + moment(personalized?.endDate).format('MMM D');
        isActive = true;
      } else if (personalized?.startDate && personalized?.endDate) {
        if (personalized?.startDate == personalized?.endDate) {
          buttonLabel = moment(personalized?.startDate).format('MMM D');
        } else {
          buttonLabel = moment(personalized?.startDate).format('MMM D') + ' - ' + moment(personalized?.endDate).format('MMM D');
        }
        isActive = true;
      }
    }

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || isActive == true) }, s.btn, s.btnFontsize)}
            onClick={() => handleTabToggle('dates', !isExpand)}>
            <img src={filterIcon} className={cx('searchHeaderIcon', 'searchHeaderIconWidth')} /> {buttonLabel}
          </Button>
        </div>
        {
          isExpand && <div className={cx(s.searchFilterPopover, 'searchFilterPopoverRTL', { [s.searchFilterPopoverFull]: smallDevice == true })} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <div className={cx('visible-xs visible-sm', s.searchFilterPopoverHeader)}>
                <div className={cx(s.displayTable)}>
                  <div className={cx('text-left', s.displayTableCell, s.searchFilterCloseIcon, 'textAlignRightRTL')}>
                    <span onClick={this.handleSubmit}>
                      <MdClear />
                    </span>
                  </div>
                  <div className={cx('text-right', s.displayTableCell, s.floatRight, 'floatLeftRTL')}>
                    {
                      personalized?.startDate && personalized?.endDate && <Button
                        bsStyle="link"
                        className={cx(s.btnLink)}
                        onClick={this.handleReset}>
                        <FormattedMessage {...messages.clear} />
                      </Button>
                    }
                  </div>
                </div>
              </div>
              <Field
                name="dates"
                component={this.renderDateRange}
                formName={'SearchForm'}
                numberOfMonths={2}
                smallDevice={smallDevice}
              />
              <div className={cx(s.searchFilterPopoverFooter, s.displayTable)}>
                <div className={cx('text-left', 'hidden-xs hidden-sm', s.displayTableCell, 'textAlignRightRTL')}>
                  {
                    personalized?.startDate && personalized?.endDate && <Button
                      bsStyle="link"
                      className={cx(s.btnLink)}
                      onClick={this.handleReset}>
                      <FormattedMessage {...messages.clear} />
                    </Button>
                  }
                </div>
                <div className={cx(s.displayTableCell, s.applyBtnDesktop, 'textAlignLeftRTL', 'textAlignCenterRTLMb')}>
                  <Button
                    bsStyle="link"
                    className={cx(s.btnLink, s.applyBtn, 'hidden-xs', 'hidden-sm')}
                    onClick={this.handleSubmit}>
                    <FormattedMessage {...messages.apply} />
                  </Button>
                  <div className={cx(s.noPadding, 'visible-xs', 'visible-sm')}>
                    <Button
                      className={cx(s.btn, s.applyBtn, s.applyBtnMb)}
                      onClick={this.handleSubmit}>
                      <FormattedMessage {...messages.apply} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}


Dates = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Dates);

const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  personalized: state?.personalized,
});

const mapDispatch = {
  change,
  setPersonalizedValues,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dates)));
