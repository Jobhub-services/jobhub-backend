import { model, Schema, Types, Document } from 'mongoose';
import User from '@/models/User';

const developerSchema: Schema = new Schema({
	userId: { type: Types.ObjectId, ref: User },
});

const Developer = model<Document>('Developer', developerSchema);

export default Developer;
