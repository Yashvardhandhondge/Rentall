
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { Field, reduxForm } from 'redux-form';
import { FaSearch } from 'react-icons/fa';
import {
  Button,
  FormControl
} from 'react-bootstrap';
import cx from 'classnames';

// Components
import DateRange from '../../../Home/DateRange';
import PlaceGeoSuggest from '../../../Common/GeoSuggest/PlaceGeoSuggest';
import MobileDateRange from '../../../Home/MobileDateRange';

import { setPersonalizedValues } from '../../../../actions/personalized';
// Helper
import detectMobileBrowsers from '../../../../helpers/detectMobileBrowsers';
import { changeSearchForm, searchFormSuggestSelect } from '../../../../helpers/GeoSuggest/updateSearchForm';
import history from '../../../../core/history';
// Locale
import messages from '../../../../locale/messages';

import s from './SearchForm.css';
import cs from '../../../commonStyle.css';
class SearchForm extends React.Component {
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
      chosen: null,
      hideLabel: false
    },
    settingsData: {
      listSettings: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      mobileDevice: false,
      isLoad: false,
      personCapacity: []

    },
      this.handleClick = this.handleClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoad: false });
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
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
  componentWillUnmount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }
  handleResize(e) {
    let isBrowser, smallDevice, verySmallDevice;
    isBrowser = typeof window !== 'undefined';
    smallDevice = isBrowser ? window.matchMedia('(max-width: 767px)').matches : true;
    verySmallDevice = isBrowser ? window.matchMedia('(max-width: 480px)').matches : false;

    this.setState({
      smallDevice,
      verySmallDevice
    });
  }

  handleClick() {

    const { personalized, setPersonalizedValues } = this.props;
    let updatedURI, uri = '/s?', existURI;

    if (personalized?.chosen != null) {
      uri = uri + '&address=' + personalized?.location + '&chosen=' + personalized?.chosen;
    } else {
      if (personalized?.location != null) {
        uri = uri + '&address=' + personalized?.location;
      }
    }

    if (personalized?.startDate != null && personalized?.endDate != null) {
      uri = uri + '&startDate=' + personalized?.startDate + '&endDate=' + personalized?.endDate;
    }

    if (personalized?.personCapacity != null && !isNaN(personalized?.personCapacity)) {
      uri = uri + '&guests=' + personalized?.personCapacity;
    }

    existURI = history?.location?.pathname + history?.location?.search
    updatedURI = encodeURI(uri);
    if (updatedURI === existURI) {
      history.replace(updatedURI);
    } else {
      history.push(updatedURI);
    }

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
    const { personalized } = this.props;
    return (
      <PlaceGeoSuggest
        {...input}
        placeholder={label}
        initialValue={personalized?.location}
        containerClassName={containerClassName}
        onSuggestSelect={this.onSuggestSelect}
        onChange={this.onChangeSearch}
        id={'homeHeader'}
      />
    )
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { searchListing } = this.props;
    const { personCapacity, isLoad } = this.state;
    let rows = [], startValue, endValue; const isBrowser = typeof window !== 'undefined';
    if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
      for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
        rows.push(<option value={i} key={i}>{i} {i > 1 ? 'guests' : 'guest'}</option>);
        startValue = personCapacity[0].startValue;
        endValue = personCapacity[0].endValue;
      }
    }
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

    return (

      <div className={cx(s.searchPageSearchGrid, 'homeSearchForm', 'searchGridRTL')}>
        <div className={cx(s.rightBorder, 'rightBorderRTL')}>
          <form autoComplete="off">
            {
              !isLoad && <Field
                containerClassName='searchHeaderGeoSuggest'
                component={this.renderPlacesSuggest}
                autoComplete='off'
                label={formatMessage(messages.homeWhere)}
              />
            }
            {
              isLoad && <Field
                component={this.renderFormControl}
                label={formatMessage(messages.homeWhere)}
                className={cx(s.formControlInput, s.input)}
                name="location"
                autoComplete='off'
              />
            }
          </form>
        </div>
        <div>
          <span className={cx('homeDate', s.formControlInput, s.input)}>
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
        <div>
          <Button className={cx(cs.btnPrimary, s.btnBlock, s.searchButton)} onClick={this.handleClick} disabled={searchListing}>
            {/* <img src={searchIcon} /> */}
            <FaSearch className={cx('textWhite')} width={20} height={20} />
          </Button>
        </div>
      </div>
    );
  }
}
SearchForm = reduxForm({
  form: 'SearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(SearchForm);

const mapState = (state) => ({
  personalized: state?.personalized,
  settingsData: state?.viewListing?.settingsData,
  listingFields: state?.listingFields?.data,
  searchListing: state?.loader?.searchListing
});

const mapDispatch = {
  setPersonalizedValues
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(SearchForm)));