import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { WishListGroup, UserLogin, User } from '../../models';
import GetWishListType from '../../types/GetWishListType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getWishListGroup = {
    type: GetWishListType,
    args: {
        id: { type: new NonNull(IntType) },
        currentPage: { type: IntType },
    },
    async resolve({ request }, { id, currentPage }) {

        let where, status = 200, errorMessage, convertedName, currentToken;
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

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

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });
                if (checkLogin && id) {

                    const wishListData = await WishListGroup.findOne({
                        where: {
                            userId: request.user.id,
                            id
                        }
                    });
                    let updatedWishListData;
                    updatedWishListData = Object.assign({}, wishListData.dataValues, { currentPage });
                    if (wishListData) {
                        return {
                            status: 200,
                            results: updatedWishListData
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                        }
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' }),
                        status: 500
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' }),
                    status: 500
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
}

export default getWishListGroup;