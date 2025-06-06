import {
  ADMIN_RESERVATION_MODAL_SHOW,
  ADMIN_RESERVATION_MODAL_HIDE
} from '../../constants';
import { initialize } from 'redux-form';

const openReservationModal = (formName, initialData) => {
  return (dispatch, getState) => {

    //Initialize the form values
    dispatch(initialize(formName, initialData, true));

    dispatch({
      type: ADMIN_RESERVATION_MODAL_SHOW,
      payload: {
        reservationModal: true,
      }
    });
  };

}

const closeReservationModal = () => {

  return (dispatch, getState) => {
    dispatch({
      type: ADMIN_RESERVATION_MODAL_HIDE,
      payload: {
        reservationModal: false,
      }
    });
  };

}

export { openReservationModal, closeReservationModal };