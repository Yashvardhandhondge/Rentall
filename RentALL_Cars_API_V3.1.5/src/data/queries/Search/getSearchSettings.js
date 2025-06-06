import { SearchSettings } from '../../../data/models';
import SearchSettingsType from '../../types/SearchSettingsType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getSearchSettings = {
  type: SearchSettingsType,
  async resolve({ request }) {

    try {
      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      const getAllSearchSettings = await SearchSettings.findOne();

      return {
        results: getAllSearchSettings,
        status: getAllSearchSettings ? 200 : 400,
        errorMessage: getAllSearchSettings ? null : await showErrorMessage({ errorCode: 'invalidError' })
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  }
};

export default getSearchSettings;