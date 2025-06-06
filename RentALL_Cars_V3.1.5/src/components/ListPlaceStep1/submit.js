// Redux Form
import { SubmissionError } from 'redux-form';
// Fetch request
import fetch from '../../core/fetch';
// Locale
import messages from '../../locale/messages';
// For Redirect
import history from '../../core/history';
// Redux Action
import { getListingData } from '../../actions/getListing';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';
import { getListingFields } from '../../actions/getListingFields';
import showToaster from '../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  let bedTypes = JSON.stringify(values.bedTypes);

  let variables = Object.assign({}, values, { bedTypes });
  const checkMapQuery = `
  query ($address: String) {
    locationItem(address: $address) {
      lat
      lng
      status
    }
  }
`;
  let address = `${values.street},${values.city},${values.state},${values.zipcode},${values.country},`;

  const mapResp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: checkMapQuery,
      variables: { address }
    }),
    credentials: 'include'
  });

  const checkMapResponse = await mapResp.json();
  if (checkMapResponse && checkMapResponse.data && checkMapResponse.data.locationItem && checkMapResponse.data.locationItem.status !== 200) {
    showToaster({ messageId: 'invalidAddress', toasterType: 'error' })
    return;
  } else {
    dispatch(setLoaderStart('location'));

    const query = `query (
    $carType:String,
    $model:String,
    $transmission:String,
    $bedrooms:String,
    $year:String,
    $bedType:String,
    $beds:Int,
    $personCapacity:Int,
    $bathrooms:Float,
    $bathroomType:String,
    $country:String,
    $street:String,
    $buildingName:String,
    $city:String,
    $state:String,
    $zipcode:String,
    $lat:Float,
    $lng:Float,
    $bedTypes: String,
    $make: String,
    $odometer: String,
  ) {
      createListing (
        carType:$carType,
        model:$model,
        transmission: $transmission,
        bedrooms: $bedrooms,
        year: $year
        bedType: $bedType
        beds: $beds
        personCapacity: $personCapacity
        bathrooms: $bathrooms
        bathroomType: $bathroomType
        country: $country
        street: $street
        buildingName: $buildingName
        city: $city
        state: $state
        zipcode: $zipcode,
        lat: $lat,
        lng: $lng,
        bedTypes: $bedTypes,
        make: $make,
        odometer: $odometer,
      ) {
        status
        id
      }
    }`;

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      }),
      credentials: 'include'
    });

    const { data } = await resp.json();

    if (data?.createListing?.status == "success") {
      await dispatch(getListingData(data?.createListing?.id));
      await dispatch(manageListingSteps(data?.createListing?.id, 1));
      history.push(data?.createListing?.id + '/map');
      dispatch(setLoaderComplete('location'));
      await dispatch(setLoaderComplete('location'));
    } else if (data?.createListing?.status == "notLoggedIn") {
      throw new SubmissionError({ _error: messages.notLoggedIn });
    } else if (data.createListing.status == "adminLoggedIn") {
      throw new SubmissionError({ _error: messages.adminLoggedIn });
    } else if (data?.createListing?.status == "unSuccess") {
      showToaster({ messageId: 'commonError', toasterType: 'error' })
      dispatch(setLoaderComplete('location'));
      dispatch(getListingFields())
      history.push('/become-a-owner?mode=new');
    } else {
      throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
  }

}

export default submit;
