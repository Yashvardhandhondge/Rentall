/* eslint-disable import/prefer-default-export */

import { SET_PERSONALIZED_VALUES } from '../constants';

export const setPersonalizedValues = ({ name, value }) => {
  return {
    type: SET_PERSONALIZED_VALUES,
    payload: {
      name,
      value,
    },
  };
}
