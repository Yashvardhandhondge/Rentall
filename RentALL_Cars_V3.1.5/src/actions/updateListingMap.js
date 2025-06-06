import { change, submit } from 'redux-form';
import {
  UPDATE_LISTING_MAP_START,
  UPDATE_LISTING_MAP_SUCCESS,
  UPDATE_LISTING_MAP_ERROR
} from '../constants';
import history from '../core/history';
import showToaster from '../helpers/toasterMessages/showToaster';
import { locationItem as query } from '../lib/graphql';

export const updateListingMap = (isHeader) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: UPDATE_LISTING_MAP_START,
        payload: {
          mapUpdateLoading: true
        }
      });

      // Collect Current form data
      const formData = getState().form.ListPlaceStep1.values;

      // Collect form initial values
      const formInitialData = getState().form.ListPlaceStep1.initial;

      // Get Country, Street, City, State, Zipcode
      const locationData = {
        "country": formData.country,
        "street": formData.street,
        "city": formData.city,
        "state": formData.state,
        "zipcode": formData.zipcode,
      };
      const InitialLocationData = {
        "country": formInitialData.country,
        "street": formInitialData.street,
        "city": formInitialData.city,
        "state": formInitialData.state,
        "zipcode": formInitialData.zipcode,
      };

      let address;
      /*if(JSON.stringify(locationData) === JSON.stringify(InitialLocationData)) {
        if(isHeader){
          history.push("home");
        } else {
          // Redirect to Map page
          history.push("map");
        }
        
      } else {*/
      address = `${locationData.street},${locationData.city},${locationData.state},${locationData.zipcode},${locationData.country},`;

      // Send Request Google API get detailed address
      const { data } = await client.query({
        query,
        variables: { address },
        fetchPolicy: 'network-only'
      });

      // Change Value of lat & lng
      dispatch(change("ListPlaceStep1", "lat", data.locationItem.lat));
      dispatch(change("ListPlaceStep1", "lng", data.locationItem.lng));
      if (data?.locationItem) {
        if (data?.locationItem?.status !== 200) {
          showToaster({ messageId: 'invalidAddress', toasterType: 'error' })
          dispatch({
            type: UPDATE_LISTING_MAP_SUCCESS,
            payload: {
              mapUpdateLoading: false
            }
          });
          return false;
        }
      }
      if (isHeader) {
        //history.push("home");
        // Instead of redirecting to home, We have submit(update) the data
        await dispatch(submit('ListPlaceStep1'));
      } else {
        // Redirect to Map page
        history.push("map");
      }
      /*}*/

      // Dispatch a success action
      dispatch({
        type: UPDATE_LISTING_MAP_SUCCESS,
        payload: {
          mapUpdateLoading: false
        }
      });
    } catch (error) {
      dispatch({
        type: UPDATE_LISTING_MAP_ERROR,
        payload: {
          error,
          mapUpdateLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

export const updateLocationStatus = () => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LOCATION_STATUS,
      isLocationChosen: true
    });
  };
}
