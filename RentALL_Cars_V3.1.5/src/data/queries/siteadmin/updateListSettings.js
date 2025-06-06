import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { ListSettings } from '../../../data/models';
import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import checkListSettingsActivity from '../../../helpers/checkListSettingsActivity';

const updateListSettings = {

  type: ListSettingsType,

  args: {
    id: { type: IntType },
    typeId: { type: IntType },
    itemName: { type: StringType },
    itemDescription: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
    makeType: { type: StringType },
  },

  async resolve({ request }, {
    id,
    typeId,
    itemName,
    itemDescription,
    otherItemName,
    maximum,
    minimum,
    startValue,
    endValue,
    isEnable,
    makeType
  }) {

    if (request.user && request.user.admin == true) {

      let isListSettingsUpdated = false;

      if (Number(isEnable) === 0) {
        const status = await checkListSettingsActivity(typeId, id);
        if (status) {
          return {
            status
          };
        }
      };


      if (typeId == 20 && Number(isEnable) === 0) {
        const isModel = await ListSettings.findOne({
          where: { makeType: id },
          raw: true
        });

        if (isModel) {
          return {
            status: "modelUsed",
          }
        }
      }

      const modifyListSettings = await ListSettings.update(
        {
          itemName: itemName.trim(),
          itemDescription: itemDescription,
          otherItemName: otherItemName,
          maximum: maximum,
          minimum: minimum,
          startValue: startValue,
          endValue: endValue,
          isEnable: isEnable,
          makeType: makeType,
        },
        {
          where: {
            id: id,
            typeId: typeId
          }
        }
      )
        .then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isListSettingsUpdated = true;
          }
        });

      if (isListSettingsUpdated) {
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
        status: 'failed'
      }
    }
  },
};

export default updateListSettings;
