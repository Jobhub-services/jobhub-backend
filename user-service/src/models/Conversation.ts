import { model, Schema, Types, Document } from 'mongoose';
import User from '@/models/User';

const conversationSchema: Schema = new Schema({
	members: [{ type: Types.ObjectId, ref: User, required: true }],
});

const Conversation = model<Document>('Conversation', conversationSchema);

export default Conversation;
