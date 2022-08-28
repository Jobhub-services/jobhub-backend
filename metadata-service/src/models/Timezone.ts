import { model, Schema, Document } from 'mongoose';
import { ITimezone } from '@/interfaces/timezone.interface';
const timezoneSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	utc: String,
});

timezoneSchema.index({ code: 'text', name: 'text' });

const Timezone = model<ITimezone & Document>('Timezone', timezoneSchema);

export default Timezone;
