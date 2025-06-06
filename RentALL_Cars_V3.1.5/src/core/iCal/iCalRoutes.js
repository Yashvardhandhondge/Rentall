var ical = require('ical');
var request = require('request');
import { findURL, storeCalendar } from './dbFunctions';
import { getDates } from '../../helpers/dateRange';
import moment from 'moment';

const iCalRoutes = app => {

	app.post('/import-calendar', async function (req, res) {

		if (!req.user) {
			res.redirect('/');
		} else {
			const listId = req.body.data.listId;
			const url = req.body.data.url;
			const name = req.body.data.name;
			const calendarId = req.body.data.calendarId;
			const toSearch = ["text/calendar", "application/octet-stream", "application/ics", "application/force-download"];



			if (!calendarId) {
				const isURLAvailable = await findURL(url, listId);
				if (isURLAvailable) {
					res.send({ status: 409 });
					return;
				}
			}

			request({ url, headers: { accept: '*/*' } }, async function (error, response, body) {
				if (error) {
					res.send({ status: 400 });
					return;
				}

				if (response && response.statusCode === 200) {
					var contentType = response.headers['content-type'];
					contentType = contentType.includes(";") ? contentType.split(";")[0] : contentType;
					var dataIndex = toSearch.indexOf(contentType);

					if (dataIndex > -1) {
						var calendarData, calendarDataId;
						if (!calendarId) {
							calendarData = await storeCalendar(url, listId, name);
							calendarDataId = calendarData.id;
						} else {
							calendarDataId = calendarId;
						}
						var data = ical.parseICS(body);
						var blockedDateCollection = [];
						for (var k in data) {
							if (data.hasOwnProperty(k)) {
								var ev = data[k];
								if (ev.start && ev.end) {
									// if (ev.start.getDate() === ev.end.getDate()) {
									if (ev.start.getDate() === ev.end.getDate() && ev.start.getFullYear() === ev.end.getFullYear() && ev.start.getMonth() === ev.end.getMonth()) {
										blockedDateCollection.push(ev.start);
									} else {
										var range = getDates(moment(ev.start), moment(ev.end));
										range.map(async (item) => {
											blockedDateCollection.push(moment(item));
										});
									}
								}
							}
						}
						res.send({ status: 200, blockedDates: blockedDateCollection, calendarDataId });

					} else {
						res.send({ status: 400 });
						return;
					}

				} else {
					res.send({ status: 400 });
					return;
				}
			});
		}
	})
};

export default iCalRoutes;