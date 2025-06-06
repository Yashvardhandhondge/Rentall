import {
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import { Currencies } from '../../../models';
import CurrenciesType from '../../../types/CurrenciesType';

const currencyManagement = {
  type: CurrenciesType,
  args: {
    id: { type: IntType },
    isEnable: { type: BooleanType }
  },
  async resolve({ request }, { id, isEnable }) {

    try {
      if (request.user && request.user.admin == true) {
        let isCurrencyUpdated = false;

        const updateCurrencies = await Currencies.update(
          {
            isEnable: !isEnable
          },
          {
            where: {
              id: id
            }
          }
        )
          .then(function (instance) {
            // Check if any rows are affected
            if (instance > 0) {
              isCurrencyUpdated = true;
            }
          });

        if (isCurrencyUpdated) {
          return {
            status: 'success'
          }
        } else {
          return {
            status: 'failed'
          }
        }
      } else {
        return {
          status: "failed"
        }
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default currencyManagement;