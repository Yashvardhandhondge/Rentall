import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import {
  Listing,
} from '../../data/models';
import EditListingType from '../types/EditListingType';

const updateListingStep2 = {

  type: EditListingType,

  args: {
    id: { type: IntType },
    title: { type: StringType },
    description: { type: StringType },
    coverPhoto: { type: IntType },
  },

  async resolve({ request, response }, {
    id,
    title,
    description,
    coverPhoto
  }) {

    let isListUpdated = false;

    if (request?.user || request?.user?.admin) {

      let where = { id };
      if (!request?.user?.admin) {
        where = {
          id,
          userId: request?.user?.id
        }
      };

      const doUpdateListing = await Listing.update({
        title,
        description,
        coverPhoto,
        lastUpdatedAt: new Date()
      },
        {
          where
        })
        .then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isListUpdated = true;
          }
        });


      if (isListUpdated) {
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
        status: "notLoggedIn",
      };
    }

  },
};

export default updateListingStep2;