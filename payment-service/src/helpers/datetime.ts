import moment from 'moment-timezone';
export function getCurrentDataWithFormat(format: string, timezone: string) {
	return moment().tz(timezone).format(format);
}
export function addDaysToDate(datetime, days) {
	return moment(datetime).add(days, 'days');
}
