import { model, Schema, Document, Types } from 'mongoose';
import User from '@/models/User';
import { IConversation } from '@/interfaces/conversation.interface';
import { softDeleteModel } from '@/helpers';

const messageSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		sender: { type: Types.ObjectId, ref: User, required: true },
	},
	{
		timestamps: true,
	}
);
const conversationSchema: Schema = new Schema(
	{
		createdBy: { type: Types.ObjectId, ref: User, required: true },
		members: [{ type: Types.ObjectId, ref: User, required: true }],
		messages: [messageSchema],
	},
	{
		timestamps: true,
	}
);

const Conversation = softDeleteModel<IConversation>('Conversation', conversationSchema);

export default Conversation;
