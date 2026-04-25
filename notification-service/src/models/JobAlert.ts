import { model, Schema, Document, Types } from 'mongoose';

const jobAlertSchema: Schema = new Schema({
	pageNumber: Number,
});

const JobAlert = model<any & Document>('JobAlert', jobAlertSchema);

export default JobAlert;
