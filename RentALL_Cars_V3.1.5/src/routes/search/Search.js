import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import SearchResults from '../../components/SearchListing/SearchResults';
import MapResults from '../../components/SearchListing/MapResults';
import Loader from '../../components/Loader';
import SearchHeader from '../../components/SearchListing/SearchHeader';

import messages from '../../locale/messages';
import { showMap, showResults, showForm, showFilter } from '../../actions/mobileSearchNavigation';
import { getListingFields } from '../../actions/getListingFields';
import { closeWishListModal } from '../../actions/WishList/modalActions';
import { googleMapLoader } from '../../helpers/googleMapLoader';

import showIcon from '/public/SiteIcons/mapShowIcon.svg';
import viewIcon from '/public/SiteIcons/viewMapIcon.svg';

import s from './Search.css';

class Search extends React.Component {
  static propTypes = {
    initialFilter: PropTypes.object,
    searchSettings: PropTypes.object,
    filterToggle: PropTypes.bool,
    showMap: PropTypes.func.isRequired,
    showResults: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
    formatMessage: PropTypes.func,
    mobileSearch: PropTypes.shape({
      searchMap: PropTypes.bool,
      searchResults: PropTypes.bool,
      searchForm: PropTypes.bool
    }),
    getListingFields: PropTypes.func,
  };

  static defaultProps = {
    mobileSearch: {
      searchMap: false,
      searchResults: true,
      searchForm: false,
    },
    isMapShow: true
  };

  constructor(props) {
    super(props);
    this.state = {
      smallDevice: false,
      load: false,
      googleMapsApiLoaded: false
    };
  }

  UNSAFE_componentWillMount() {
    const { getListingFields } = this.props;
    getListingFields();
  }

  async componentDidMount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
    const autocompleteService = await googleMapLoader('places');
    this.autocompleteService = autocompleteService;
    this.setState({
      googleMapsApiLoaded: true,
      load: true
    });
  }

  componentWillUnmount() {
    const { closeWishListModal } = this.props;
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
    closeWishListModal();
  }

  handleResize = (e) => {
    let isBrowser = typeof window !== 'undefined';
    let smallDevice = isBrowser ? window.matchMedia('(max-width: 1199px)').matches : false;
    this.setState({ smallDevice });
  }

  mobileNavigation() {
    const {
      mobileSearch: { searchMap, searchResults },
      showMap,
      showResults,
      showForm
    } = this.props;

    return (
      <div className={cx(s.mobileNavigation, 'mobileNavigationRTL')}>
        <div className={s.buttonOuter}>
          <div className={cx(s.buttonContainer)}>
            <Button className={cx(s.filterButton, s.locationBtn, { [s.hideIcon]: searchMap })} bsStyle="link" onClick={() => showMap()}><img src={showIcon} className={'searchHeaderIcon'} /><span className={s.middle}><FormattedMessage {...messages.showMapp} /></span></Button>
            <Button className={cx(s.filterButton, s.locationBtn, { [s.hideIcon]: searchResults })} bsStyle="link" onClick={() => showResults()}><img src={viewIcon} className={cx('searchHeaderIcon', 'searchHeaderIconRTL')} /><FormattedMessage {...messages.applyFilters} /></Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      mobileSearch: { searchMap, searchResults, searchForm },
      searchSettings,
      initialFilter,
      filterToggle,
      isMapShow,
      showFilter,
      showResults,
      extendMap,
      endBeforeDate
    } = this.props;
    const { smallDevice, load, googleMapsApiLoaded } = this.state;

    let DesktopResults = true;
    if (filterToggle === true) {
      DesktopResults = false;
    }
    const isBrowser = typeof window !== 'undefined';

    if (!load || !isBrowser) {
      return (
        <div className={s.searchLoaderContainer}>
          <Loader type={"text"} />
        </div>
      );
    }

    return (
      <div className={cx(s.root, 'searchPage')}>
        <div className={s.container}>
          {
            !smallDevice && <SearchHeader searchSettings={searchSettings} />
          }
          {
            smallDevice && !searchMap && <SearchHeader showFilter={showFilter} showResults={showResults} searchSettings={searchSettings} />
          }
          <div className={cx(s.searchResultContainer, { [s.listItemOnly]: isMapShow == false })}>

            {
              !extendMap && !smallDevice && DesktopResults && <div className={cx(s.resultsBody)}>
                <SearchResults endBeforeDate={endBeforeDate} />
              </div>
            }

            {
              smallDevice && searchResults && <div className={cx(s.resultsBody)}>
                <SearchResults />
              </div>
            }

          </div>

          {
            !smallDevice && isMapShow && googleMapsApiLoaded && <div className={cx(s.searchMapContainer, 'searchMapSection', 'searchMapContainerRTL', { [s.searchMapContainerShow]: extendMap == true }, { ['searchMapContainerShowRTL']: extendMap == true })}>
              <MapResults initialFilter={initialFilter} searchSettings={searchSettings} endBeforeDate={endBeforeDate} />
            </div>
          }

          {
            smallDevice && searchMap && <div className={cx(s.searchMapContainer, 'searchMapSection', 'searchMapContainerRTL')}>
              <MapResults initialFilter={initialFilter} searchSettings={searchSettings} />
            </div>
          }

          {
            !searchForm && this.mobileNavigation()
          }

        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  filterToggle: state?.toggle?.filterToggle,
  mobileSearch: state?.mobileSearch?.data,
  isMapShow: state?.personalized?.showMap,
  extendMap: state?.personalized?.extendMap,
});

const mapDispatch = {
  showMap,
  showResults,
  showForm,
  getListingFields,
  showFilter,
  closeWishListModal
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Search)));
