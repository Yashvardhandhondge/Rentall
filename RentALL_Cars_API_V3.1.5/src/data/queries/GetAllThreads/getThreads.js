import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import { Threads, ThreadItems, UserProfile, User } from '../../../data/models';
import NewThreadsCommonType from '../../types/NewThreadsCommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage'

const getThreads = {
  type: NewThreadsCommonType,
  args: {
    threadType: { type: StringType },
    threadId: { type: IntType },
    currentPage: { type: IntType },
    sortOrder: { type: BooleanType },
  },

  async resolve({ request }, { threadType, threadId, currentPage, sortOrder }) {
    try {
      // Check if user already logged in
      let limit = 10, offset = 0;
      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }
      if (request.user || request.user.admin) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        let where = {}, orderedThreadItem = [];

        const userData = await User.findOne({
          attributes: [
            'userBanStatus'
          ],
          where: { id: request.user.id },
          raw: true
        })

        if (userData) {
          if (userData.userBanStatus == 1) {
            return {
              errorMessage: await showErrorMessage({ errorCode: 'contactSupport' }),
              status: 500
            }
          }
        }

        if (!request.user.admin) {
          // For Getting Specific type of threads of a logged in user(Either 'owner' or 'renter')
          if (threadType === 'owner') {
            where = {
              host: request.user.id
            }
          } else {
            where = {
              guest: request.user.id
            }
          }
        }
        // For Getting Specific Thread
        if (threadId != undefined && threadId != null) {
          where = Object.assign({}, where, { id: threadId });
        }

        let results = await Threads.findOne({ where });
        let count = await ThreadItems.count({ where: { threadId } });
        if (!results) {
          return {
            errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
            status: 400
          }
        } else {
          let threadItems;
          if (sortOrder) {
            threadItems = ThreadItems.findAll({
              where: { threadId },
              order: [
                [`createdAt`, `DESC`],
              ],
              limit,
              offset
            }).then(items => {
              orderedThreadItem = items;
              orderedThreadItem.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
              return orderedThreadItem;
            });
          } else {
            threadItems = ThreadItems.findAll({
              where: { threadId },
              order: [
                [`createdAt`, `DESC`],
              ],
              limit,
              offset
            }).then(items => {
              orderedThreadItem = items;
              return orderedThreadItem;
            });
          }

          let hostProfile, guestProfile;
          hostProfile = await UserProfile.findOne({ where: { userId: results.host } });
          guestProfile = await UserProfile.findOne({ where: { userId: results.guest } });

          const threadItemForType = ThreadItems.findOne({
            where: {
              threadId,
              type: {
                $notIn: ['message']
              }
            },
            limit: 1,
            order: [['createdAt', 'DESC']]
          });

          if (threadItems) {
            return {
              status: 200,
              results: {
                listId: results.listId,
                guest: results.guest,
                threadItems: threadItems,
                guestProfile: guestProfile,
                hostProfile: hostProfile,
                getThreadCount: count,
                threadItemForType
              },
            }
          }
          else {
            return {
              errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
              results: results,
              status: 400
            }
          }
        }
      } else {
        return {
          errorMessage: await showErrorMessage({ errorCode: 'loginError' }),
          status: 500
        };
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  }
};

export default getThreads;
