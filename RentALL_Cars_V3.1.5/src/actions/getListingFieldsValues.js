import { initialize } from 'redux-form';
import {
  GET_LISTING_FIELDS_INTIAL_VALUES_START,
  GET_LISTING_FIELDS_INTIAL_VALUES_SUCCESS,
  GET_LISTING_FIELDS_INTIAL_VALUES_ERROR
} from '../constants';
import { getListingSettingsQuery as query } from '../lib/graphql';

export const getListingFieldsValues = (step, listId, isOtherPage) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_LISTING_FIELDS_INTIAL_VALUES_START,
      });

      const step1DataIsLoaded = getState().location?.step1DataIsLoaded;
      const step2DataIsLoaded = getState().location?.step2DataIsLoaded;
      const step3DataIsLoaded = getState().location?.step3DataIsLoaded;

      // Get Base Currency from Redux Store
      const baseCurrency = getState().currency.base;
      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { step },
        fetchPolicy: 'network-only'
      });

      let listingFieldsValues = {}, bedType = getState().listingFields?.data?.bedType, bedTypeValue;

      if (!data && !data?.getListingSettings) {
        dispatch({
          type: GET_LISTING_FIELDS_INTIAL_VALUES_ERROR,
        });
      } else {
        data?.getListingSettings?.map((item, key) => {
          if (item?.fieldType === "numberType") {
            listingFieldsValues[item.typeName] = item?.listSettings?.length > 0 ? item?.listSettings[0]?.startValue : null;
          } else {
            if (item?.isMultiValue === true) {
              listingFieldsValues[item.typeName] = [];
            } else {
              let unSelectIndex = item?.listSettings?.length > 0 ? item?.listSettings?.findIndex(o => (o?.isEnable == 1)) : null;
              listingFieldsValues[item.typeName] = item?.listSettings[unSelectIndex].id;
            }

          }
        })

        if (bedType?.length > 0) {
          bedType?.map((item, key) => {
            bedTypeValue = bedType.length > 0 ? bedType[0].id : null;
          });
        }

        // Reinitialize the form values
        if (step === "2" && !step2DataIsLoaded) {
          let updatedValuesStep2 = Object.assign({}, listingFieldsValues, { id: listId });
          dispatch(initialize("ListPlaceStep2", updatedValuesStep2, true));
          dispatch({
            type: GET_LISTING_FIELDS_INTIAL_VALUES_SUCCESS,
            initialValuesLoadedStep2: true,
          });
        } else if (step === "3" && !step3DataIsLoaded) {
          let updatedValuesStep3 = Object.assign({}, listingFieldsValues, { id: listId }, { currency: baseCurrency }, { bookingType: 'instant' }, { maxDaysNotice: 'available' }, { minDay: listingFieldsValues?.minNight }, { maxDay: listingFieldsValues?.maxNight });
          
          dispatch(initialize("ListPlaceStep3", updatedValuesStep3, true));
          dispatch({
            type: GET_LISTING_FIELDS_INTIAL_VALUES_SUCCESS,
            initialValuesLoadedStep3: true,
          });
        } else {
          if (!step1DataIsLoaded || isOtherPage) {
            let updatedValuesStep1 = Object.assign({}, listingFieldsValues, { bedTypes: [{ bedCount: 1, bedType: bedTypeValue }] }, { transmission: "1" }, { make: "" }, { model: "" });
            dispatch(initialize("ListPlaceStep1", updatedValuesStep1, true));
            dispatch({
              type: GET_LISTING_FIELDS_INTIAL_VALUES_SUCCESS,
              initialValuesLoaded: true
            });
          }
        }
      }
    } catch (error) {
      dispatch({
        type: GET_LISTING_FIELDS_INTIAL_VALUES_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
