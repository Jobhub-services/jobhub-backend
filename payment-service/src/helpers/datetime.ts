import moment from 'moment-timezone';
export function getCurrentDataWithFormat(format: string, timezone: string) {
	return moment().tz(timezone).format(format);
}
