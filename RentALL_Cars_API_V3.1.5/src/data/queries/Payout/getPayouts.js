import { Payout } from '../../models';
import PayoutWholeType from '../../types/PayoutWholeType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getPayouts = {
    type: PayoutWholeType,
    args: {},
    async resolve({ request }, { }) {
        try {
            if (request.user && !request.user.admin) {
                let userId = request.user.id

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const results = await Payout.findAll({
                    where: {
                        userId
                    },
                    order: [
                        [`default`, `DESC`],
                    ],
                })

                return await {
                    results,
                    status: 200
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'getProfile' })
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getPayouts;