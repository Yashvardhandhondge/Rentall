import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import {UserProfile} from '../models';
import ProfileType from './ProfileType';

const ForgotPasswordType = new ObjectType({
  name: 'ForgotPassword',
  fields: {
    id: { type: StringType },
    userId: { type: StringType },
    token: { type: StringType },
    profile: {
      type: ProfileType,
      resolve (forgotPassword) {
        return UserProfile.findOne({
          where: { userId: forgotPassword.userId}
        });
      }
    },
    email: { type: StringType },
    createdAt: { type: StringType },
    status: {type: StringType},
  },
});

export default ForgotPasswordType;