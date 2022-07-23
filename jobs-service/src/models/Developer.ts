import { model, Schema, Types, Document } from 'mongoose';
const developerSchema: Schema = new Schema({
	userId: { type: Types.ObjectId },
});

const Developer = model<Document>('Developer', developerSchema);

export default Developer;
