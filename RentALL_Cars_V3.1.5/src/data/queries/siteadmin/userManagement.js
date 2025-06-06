import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';
import sequelize from '../../sequelize';
import { User, UserProfile } from '../../../data/models';
import UserManagementWholeDataType from '../../types/siteadmin/UserManagementWholeDataType';

const userManagement = {
  type: UserManagementWholeDataType,
  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType },
  },
  async resolve({ request, response }, { currentPage, searchList }) {
    if (request.user && request.user.admin == true) {
      const limit = 10;
      let offset = 0;
      // Offset from Current Page
      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }
      let usersData, userCountLength, where;
      if (searchList) {
        let getDate = moment(searchList).format('YYYY-MM-DD');
        where = {
          $or: [
            {
              id: {
                $or: [{
                  $in: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                        UserProfile
                                      WHERE firstName like "%${searchList}%"
                                      `)]
                },
                {
                  $in: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE phoneNumber like "%${searchList}%"
`)]
                },
                {
                  $in: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE createdAt like "%${getDate}%"
`)]
                },
                {
                  $in: [
                    sequelize.literal(`
                                      SELECT
                                      id
                                      FROM
                                      User
                                      WHERE email like "%${searchList}%"
`)]
                },
                {
                  $in: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE profileId like "%${searchList}%"
`)]
                },
                ]
              },

            }
          ],
          userDeletedAt: null
        }
        userCountLength = await User.count({
          where
        });
        usersData = await User.findAll({
          attributes: ['id', 'email', 'userBanStatus'],
          profile: {
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'dateOfBirth',
              'gender',
              'phoneNumber',
              'preferredLanguage',
              'preferredCurrency',
              'location',
              'info'
            ]
          },
          where,
          order: [['createdAt', 'ASC']],
          limit,
          offset,
          include: [
            { model: UserProfile, as: 'profile' },
          ]
        });
      } else {
        userCountLength = await User.count({ where: { userDeletedAt: null } });
        // Get All User Profile Data
        usersData = await User.findAll({
          attributes: ['id', 'email', 'userBanStatus'],
          profile: {
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'dateOfBirth',
              'gender',
              'phoneNumber',
              'preferredLanguage',
              'preferredCurrency',
              'location',
              'info'
            ]
          },
          where: {
            userDeletedAt: null
          },
          order: [['createdAt', 'ASC']],
          limit,
          offset,
          include: [
            { model: UserProfile, as: 'profile' },
          ]
        });
      }
      return {
        usersData,
        count: userCountLength,
        currentPage
      };
    }
  },
};
export default userManagement;
