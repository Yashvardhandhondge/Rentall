// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import jwt from 'jsonwebtoken';
// Sequelize models
import {
  User,
  UserLogin,
  UserProfile,
  AdminUser,
  EmailToken
} from '../../data/models';
import userEditProfileType from '../types/userEditProfileType';
import { auth } from '../../config';
// Helper
import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';
import showErrorMessage from '../../helpers/showErrorMessage';

const userEditProfile = {

  type: userEditProfileType,

  args: {
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: new NonNull(StringType) },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    loggedinEmail: { type: StringType },
    countryCode: { type: StringType },
    countryName: { type: StringType },

  },

  async resolve({ request, response }, {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    email,
    phoneNumber,
    preferredLanguage,
    preferredCurrency,
    location,
    info,
    loggedinEmail,
    countryCode,
    countryName,
  }) {
    if (request?.user && request?.user?.admin != true) {

      const isUserPhoneNumber = await UserProfile.findOne({
        where: {
          userId: request?.user?.id
        }
      });
      let loggedInId, updatedFirstName, updatedLastName, displayName, isPhoneNumber, isCountryCode, isCountryName;
      //Collect from Logged-in User
      loggedInId = request?.user?.id;
      // let loggedInEmail = request.user.email;
      updatedFirstName = capitalizeFirstLetter(firstName);
      updatedLastName = capitalizeFirstLetter(lastName);
      displayName = updatedFirstName + ' ' + updatedLastName;
      isPhoneNumber = phoneNumber ? phoneNumber : isUserPhoneNumber?.phoneNumber;
      isCountryCode = countryCode ? countryCode : isUserPhoneNumber?.countryCode;
      isCountryName = countryName ? countryName : isUserPhoneNumber?.countryName;

      // For Email Update
      if (loggedinEmail != email) {

        const getUserId = await User.find({
          where: { email: email },
        });

        // Email is already used by someone
        if (getUserId) {
          return {
            status: 'email'
          };
        } else {
          // Check email is used by admin users
          const getAdminUserId = await AdminUser.find({
            where: { email: email },
          });

          if (getAdminUserId) {
            return {
              status: 'email'
            };
          }


          //Update email address for current user
          const updateEmail = User.update(
            {
              email: email,
            },
            {
              where: {
                id: request?.user?.id
              }
            }
          );

          const expiresIn = 60 * 60 * 24 * 180; // 180 days
          const token = jwt.sign({ id: request?.user?.id, email: email }, auth.jwt.secret, { expiresIn });
          response.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
          const updateUserEmail = EmailToken.update(
            {
              email: email
            },
            {
              where: {
                userId: request?.user?.id
              }
            }
          );


          //If something went wrong in Updating email address
          if (!updateEmail) {
            return {
              status: 'failed'
            };
          }
        }
      }

      // Updating records on Current User's Profile
      const updateUser = UserProfile.update(
        {
          firstName: updatedFirstName,
          lastName: updatedLastName,
          displayName,
          gender,
          dateOfBirth,
          phoneNumber: isPhoneNumber,
          preferredLanguage,
          preferredCurrency,
          location,
          info,
          countryName: isCountryName,
          countryCode: isCountryCode,
        },
        {
          where: {
            userId: request?.user?.id
          }
        }
      );



      // If update successful, return email & no error
      if (updateUser) {
        return {
          status: "success",
        };

      } else {
        return {
          status: 'failed'
        };
      }

    } else {
      return {
        status: 'notLoggedIn'
      };
    }
  },
};

export default userEditProfile;
