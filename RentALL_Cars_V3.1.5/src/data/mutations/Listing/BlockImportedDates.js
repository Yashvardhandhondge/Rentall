import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
import { ListBlockedDates, Listing } from '../../models';
import ListBlockedDatesType from '../../types/ListBlockedDatesType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const blockImportedDates = {
    type: ListBlockedDatesType,
    args: {
        calendarId: { type: new NonNull(IntType) },
        listId: { type: new NonNull(IntType) },
        blockedDates: { type: new List(StringType) },
    },
    async resolve({ request }, { calendarId, listId, blockedDates }) {

        try {
            // Check whether user is logged in
            if (request.user || request.user.admin) {
                var blockedDatesCollection = [], reservationDatesCollection = [];
                let where = { id: listId };
                if (!request.user.admin) {
                    where = {
                        id: listId,
                        userId: request.user.id
                    };
                }
                // Remove Existing Imported Blocked Dates
                const isListingAvailable = await Listing.find({ where });

                if (isListingAvailable) {
                    if (calendarId) {
                        await ListBlockedDates.destroy({
                            where: {
                                listId,
                                calendarId
                            }
                        });
                    }

                    if (blockedDates?.length > 0) {
                        // Collect rest of the blocked dates for that list                
                        const reservationDates = await ListBlockedDates.findAll({
                            where: {
                                listId
                            }
                        });

                        // Prepare for reservation blocked dates
                        if (reservationDates?.length > 0) {
                            reservationDates.map((item) => {
                                reservationDatesCollection.push({ blockedDates: moment(item.blockedDates).format('YYYY-MM-DD'), id: item.id, reservationId: item.reservationId });
                            })
                        }

                        // Prepare for bulk imported blocked dates
                        blockedDates.map(async (item) => {
                            let existRecords = reservationDatesCollection.find((v) => moment(item).format('YYYY-MM-DD') === moment(v.blockedDates).format('YYYY-MM-DD')),
                                checkDate = reservationDatesCollection.indexOf(item),
                                blockedDatesInstance;
                            if (checkDate === -1 && !existRecords) {
                                blockedDatesInstance = {
                                    id: null,
                                    listId,
                                    calendarId,
                                    blockedDates: moment(item).format('YYYY-MM-DD'),
                                    calendarStatus: 'blocked'
                                };
                                blockedDatesCollection.push(blockedDatesInstance);
                            } else if (checkDate === -1 && existRecords && !existRecords.reservationId) {
                                //get data for updating
                                blockedDatesInstance = {
                                    id: existRecords.id,
                                    listId,
                                    calendarId,
                                    blockedDates: moment(existRecords.blockedDates).format('YYYY-MM-DD'),
                                    calendarStatus: 'blocked'
                                }
                                blockedDatesCollection.push(blockedDatesInstance);
                            }
                        });

                        // Do the bulk insert for the imported blocked dates
                        const bulkCreate = await ListBlockedDates.bulkCreate(blockedDatesCollection, {
                            updateOnDuplicate: ['blockedDates', 'listId', 'createdAt', 'updatedAt', 'calendarId', 'calendarStatus']
                        });

                        if (bulkCreate) {
                            return {
                                status: '200'
                            };
                        }

                    } else {
                        return {
                            status: '200'
                        };
                    }
                } else {
                    return {
                        status: '404'
                    };
                }
            } else {
                return {
                    status: '403'
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

export default blockImportedDates;


/**
mutation BlockImportedDates($listId: Int!, $calendarId: Int!, $blockedDates: [String]) {
    blockImportedDates(listId: $listId, calendarId: $calendarId, blockedDates: $blockedDates) {
        status
    }
}
 */
