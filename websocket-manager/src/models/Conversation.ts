import { Schema, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import User from '@/models/User';
import { IConversation } from '@/interfaces/conversation.interface';
import { softDeleteModel } from '@/helpers';
import messagingService from '@/services/MessagingService';

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

async function populateFiles(docs, next) {
	try {
		if (Array.isArray(docs) && docs.length > 0) {
			const fileIds = [];
			docs.forEach((doc) => {
				if (doc.userInfo && doc.userInfo.avatar && fileIds.indexOf(doc.userInfo.avatar) === -1) fileIds.push(doc.userInfo.avatar);
			});
			let fileUrls = {};
			if (fileIds.length > 0) fileUrls = await messagingService.presigneUserMedia(fileIds);
			docs.forEach((doc) => {
				if (fileUrls && doc.userInfo && doc.userInfo.avatar && fileUrls[doc.userInfo.avatar]) doc.userInfo.avatar = fileUrls[doc.userInfo.avatar];
			});
		}
	} finally {
		next();
	}
}

conversationSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true, deletedBy: true });

conversationSchema.post('aggregate', populateFiles);
conversationSchema.post('find', populateFiles);

const Conversation = softDeleteModel<IConversation>('Conversation', conversationSchema);

export default Conversation;
