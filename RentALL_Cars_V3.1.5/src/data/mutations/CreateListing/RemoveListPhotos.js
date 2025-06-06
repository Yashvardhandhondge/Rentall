import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import { Listing, ListPhotos, WishList } from '../../models';
import ListPhotosType from '../../types/ListPhotosType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const RemoveListPhotos = {
  type: ListPhotosType,
  args: {
    listId: { type: new NonNull(IntType) },
    name: { type: StringType },
  },
  async resolve({ request, response }, { listId, name }) {

    try {
      // Check whether user is logged in
      if (request?.user || request?.user?.admin) {

        let where = { id: listId };
        if (!request.user.admin) {
          where = {
            id: listId,
            userId: request?.user?.id
          }
        };
        let iscoverPhotoDeleted = false;
        // Check whether listing is available
        const isListingAvailable = await Listing.findOne({ where });

        if (isListingAvailable) {
          const checkPhotoExist = await ListPhotos.findOne({
            where: {
              listId: listId,
              name: name,
            }
          });

          // Create a new record for a photo
          const removePhoto = await ListPhotos.destroy({
            where: {
              listId: listId,
              name: name,
            }
          });
          if (removePhoto) {
            const photosCount = await ListPhotos.count({ where: { listId } });

            if (photosCount < 1) {
              await Listing.update({
                isPublished: false,
                isReady: false,
                coverPhoto: null
              }, {
                where: { id: listId }
              });

              let updateListStatus = await WishList.update({
                isListActive: false
              }, {
                where: {
                  listId
                }
              });
            } else {
              const changeListingCover = await Listing.findOne({
                where: {
                  coverPhoto: checkPhotoExist?.id
                }
              });
              if (changeListingCover) {
                await Listing.update({
                  coverPhoto: null,
                  lastUpdatedAt: new Date()
                }, {
                  where: { id: listId }
                });
                iscoverPhotoDeleted = true;
              }
            }

            return {
              status: "success",
              photosCount: photosCount,
              iscoverPhotoDeleted: iscoverPhotoDeleted
            };
          }
        } else {
          return {
            status: "Listing is not available"
          };
        }

      } else {
        return {
          status: "Not loggedIn"
        };
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default RemoveListPhotos;

/*
mutation ($userId:String!, $documentId:Int) {
  RemoveDocumentList (userId:$userId, documentId: $documentId) {
    status
    photosCount
  }
}*/
