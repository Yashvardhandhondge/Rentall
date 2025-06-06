var CronJob = require('cron').CronJob;
import sequelize from '../../data/sequelize';
import { Reservation, ThreadItems, Threads } from '../../data/models';
import moment from 'moment';
import { emailBroadcast } from './completedEmail';

const reservationComplete = app => {

	new CronJob('0 0 */4 * * *', async function () {

		console.log('holy moly completed reservation');

		let attributes = [], having = {}, offset = 0, limit = 100, totalPages = 1;

		attributes = [
			'id',
			'reservationState',
			'hostId',
			'checkIn',
			'checkOut',
			'guests',
			'startTime',
			'endTime',
			[sequelize.literal('TIMESTAMPDIFF(HOUR, checkOut, NOW())'), 'hours_difference']
		]

		having = {
			'hours_difference': { $gt: 4 },
			reservationState: 'approved',
		}

		const getReservationIdsCount = await Reservation.findAll({
			attributes,
			having
		});

		if (getReservationIdsCount && getReservationIdsCount?.length > 0) {

			totalPages = Math.floor((getReservationIdsCount?.length - 1) / limit) + 1;

			for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

				offset = (currentPage - 1) * limit;

				const getReservationIds = await Reservation.findAll({
					limit,
					offset,
					attributes,
					having
				});

				// Update Reservation Status to completed
				if (getReservationIds != null && getReservationIds.length > 0) {
					getReservationIds.map(async (item) => {
						// Get ThreadId
						let getThreadId = await ThreadItems.findOne({
							where: {
								reservationId: item.id
							}
						});

						// Create new ThreaItem for completion
						if (getThreadId) {
							let createThreadItem = await ThreadItems.create({
								threadId: getThreadId.threadId,
								sentBy: item.hostId,
								type: 'completed',
								startDate: item.checkIn,
								endDate: item.checkOut,
								personCapacity: item.guests,
								reservationId: item.id,
								startTime: item.startTime,
								endTime: item.endTime,
							});

							await Threads.update({
								isRead: false,
								messageUpdatedDate: new Date()
							},
								{
									where: {
										id: getThreadId.threadId
									}
								}
							);
						}

						// Update Reservation Status
						let updateReservation = await Reservation.update({
							reservationState: 'completed'
						}, {
							where: {
								id: item.id
							}
						});

						// Update ThreadItems
						/*let updateThreadItems = await ThreadItems.update({
							type: 'completed'
						}, {
							where: {
								reservationId: item.id
							}
						});*/

						//await emailBroadcast(item.id);
					})
				}

			}
		}
	}, null, true, 'America/Los_Angeles');

};

export default reservationComplete;