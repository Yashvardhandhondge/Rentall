
import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';


import { Field, reduxForm } from 'redux-form';

import {
  Button,
  FormControl,
} from 'react-bootstrap';
import cx from 'classnames';

// Components
import DateRange from '../DateRange/DateRange';
import PlaceGeoSuggest from '../../Common/GeoSuggest/PlaceGeoSuggest';
import MobileDateRange from '../MobileDateRange/MobileDateRange';

// Redux Action
import { setPersonalizedValues } from '../../../actions/personalized';
// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';
// Locale
import messages from '../../../locale/messages';

// History
import history from '../../../core/history';
//Image
import searchIcon from '/public/SiteIcons/homeSearchIcon.svg';

import s from './VideoSearchForm.css';
import cs from '../../commonStyle.css';
import { changeSearchForm, searchFormSuggestSelect } from '../../../helpers/GeoSuggest/updateSearchForm';

class VideoSearchForm extends React.Component {
  static propTypes = {
    setPersonalizedValues: PropTypes.any.isRequired,
    getSpecificSettings: PropTypes.any.isRequired,
    personalized: PropTypes.shape({
      location: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      chosen: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      personCapacity: PropTypes.number,
      formatMessage: PropTypes.any,
    }),
    settingsData: PropTypes.shape({
      listSettings: PropTypes.array.isRequired
    }).isRequired
  };

  static defaultProps = {
    listingFields: []
  };


  static defaultProps = {
    personalized: {
      location: null,
      lat: null,
      lng: null,
      startDate: null,
      endDate: null,
      personCapacity: null,
      chosen: null
    },
    settingsData: {
      listSettings: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      mobileDevice: false,
      personCapacity: [],
      isLoad: false
    },
      this.handleClick = this.handleClick.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { listingFields } = nextProps;
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity
      });
    }
  }

  UNSAFE_componentWillMount() {
    const { listingFields } = this.props;
    // Get PersonCapacity Settings Data

    this.setState({ isLoad: true });
    if (detectMobileBrowsers.isMobile() === true) {
      this.setState({ mobileDevice: true });
    }
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity
      });
    }

  }

  componentDidMount() {
    this.setState({ isLoad: false });
  }


  handleClick() {

    const { personalized, setPersonalizedValues } = this.props;
    let updatedURI, uri = '/s?';

    if (personalized.chosen != null) {
      uri = uri + '&address=' + personalized.location + '&chosen=' + personalized.chosen;
    } else {
      if (personalized.location != null) {
        uri = uri + '&address=' + personalized.location;
      }
    }

    if (personalized.startDate != null && personalized.endDate != null) {
      uri = uri + '&startDate=' + personalized.startDate + '&endDate=' + personalized.endDate;
    }

    if (personalized.personCapacity != null && !isNaN(personalized.personCapacity)) {
      uri = uri + '&guests=' + personalized.personCapacity;
    }

    updatedURI = encodeURI(uri);
    history.push(updatedURI);
  }

  onSuggestSelect = (data, value) => {
    const { setPersonalizedValues } = this.props;
    searchFormSuggestSelect({ data, setPersonalizedValues, value });
  }

  onChangeSearch = (value) => {
    const { setPersonalizedValues, change } = this.props;
    if (value == '') {
      changeSearchForm({ setPersonalizedValues, change });
    }
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} />
      </div>
    )
  }

  renderPlacesSuggest = ({ input, label, meta: { touched, error }, containerClassName }) => {
    const { id, personalized } = this.props;
    return (
      <PlaceGeoSuggest
        {...input}
        placeholder={label}
        initialValue={personalized?.location}
        containerClassName={containerClassName}
        onSuggestSelect={this.onSuggestSelect}
        onChange={this.onChangeSearch}
        id={'videoSearch'}
      />
    )
  }

  render() {

    const { location, dates, settingsData, setPersonalizedValues, personalized, listingFields } = this.props;
    const { isLoad } = this.state;
    const { formatMessage } = this.props.intl;
    const { personCapacity } = this.state;
    let rows = []; const isBrowser = typeof window !== 'undefined';
    // for (let i= 1; i <= 16; i++) {
    //   rows.push(<option value={i} key={i}>{i} {i>1 ? 'guests' : 'guest'}</option>);
    // }

    let startValue, endValue;
    if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
      for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
        rows.push(<option value={i} key={i}>{i} {i > 1 ? 'guests' : 'guest'}</option>);
        startValue = personCapacity[0].startValue;
        endValue = personCapacity[0].endValue;
      }
    }
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 767px)').matches : undefined;

    return (
      <form autoComplete='off'>
        <div className={cx('homeSearchForm vidSearchForm')}>
          <div className={cx(s.tableCell, s.location)}>
            <label className={cx(s.label, cs.commonContentText)}>
              <span> <FormattedMessage {...messages.where} /></span>
            </label>
            <label className={s.searchElement} aria-label="Location input">
              {
                !isLoad &&
                <Field
                  label={formatMessage(messages.homeWhere)}
                  className={cx(s.formControlInput, s.input)}
                  component={this.renderPlacesSuggest}
                  autoComplete='off'
                  containerClassName='layoutThreeDetailsFormGeoSuggest'
                />

              }
              {
                isLoad && <Field
                  component={this.renderFormControl}
                  label={formatMessage(messages.homeWhere)}
                  className={cx(s.formControlInput, s.input, s.loadfield)}
                  autoComplete='off'
                />
              }
            </label>
          </div>
          <div className={cx(s.tableCell, s.dates)}>
            <label className={cx(s.label, cs.commonContentText)}>
              <span> <FormattedMessage {...messages.when} /></span>
            </label>
            <span className={cx('homeDate vidFormsearch', s.input, 'searchBoxshadow')}>
              {
                !smallDevice && <DateRange
                  formName={'SearchForm'}
                  numberOfMonths={2}
                />
              }

              {
                smallDevice && <MobileDateRange
                  formName={'SearchForm'}
                  numberOfMonths={1}
                />
              }

            </span>
          </div>
          <div className={cx(s.search)}>
            <Button className={cx(s.btn, s.btnPrimary, s.btnBlock)} onClick={this.handleClick}>
              <img src={searchIcon} className={'imgIconRight'} /><FormattedMessage {...messages.search} />
            </Button>
          </div>
        </div>
      </form>

    );
  }
}
VideoSearchForm = reduxForm({
  form: 'VideoSearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(VideoSearchForm);

const mapState = (state) => ({
  personalized: state.personalized,
  settingsData: state.viewListing.settingsData,
  listingFields: state.listingFields.data,
});

const mapDispatch = {
  setPersonalizedValues
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(VideoSearchForm)));
