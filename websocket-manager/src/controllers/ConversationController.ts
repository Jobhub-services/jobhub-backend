import { ConversationDto } from '@/dtos/conversation.dto';
import { isValidObjectId } from '@/helpers';
import { IConversation } from '@/interfaces/conversation.interface';
import Conversation from '@/models/Conversation';
import { Request, Response } from 'express';
import { OutgoingMessage } from 'http';
class ConversationController {
	createConversation = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const convData: ConversationDto = req.body;
			if (convData.members.length < 2) return res.status(406).send({ message: 'Members at least must be two' });
			const convs = await Conversation.find({ members: { $all: convData.members } });
			const firstConv = convs.find((val) => val.members.length === convData.members.length);
			if (firstConv) return res.status(200).send({ message: 'Conversation created successfully jje', data: firstConv._id });
			const conversation = await Conversation.create({
				createdBy: rootObjectId,
				members: convData.members,
				messages: [],
			});
			res.status(200).send({ message: 'Conversation created successfully', data: conversation._id });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	deleteConversation = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const chatId = req.params.chatId;
			if (!chatId || !isValidObjectId(chatId)) return res.status(406).send({ message: 'Conversation not found' });
			const chat = await Conversation.delete({ _id: chatId, createdBy: rootObjectId });
			if (!chat) return res.status(406).send({ message: 'Conversation not found' });
			res.status(200).send({ message: 'Conversation deleted successfully' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getConversations = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const { name = '', limit = 20, page } = req.query;
			const count = await Conversation.count({ createdBy: rootObjectId });
			let queryConditions: any = { createdBy: rootObjectId };
			console.log(rootObjectId);
			const query = Conversation.aggregate([
				{ $match: queryConditions },
				{
					$lookup: {
						from: 'developers',
						let: { members: '$members' },
						pipeline: [
							{
								$match: {
									$expr: {
										$in: ['$userId', '$$members'],
									},
								},
							},
							{
								$project: {
									userId: 1,
									avatar: 1,
									firstName: 1,
									lastName: 1,
									role: '$role.primary_role.name',
									experience: '$role.experience',
								},
							},
						],
						as: 'userInfo',
					},
				},
				{
					$project: {
						members: 1,
						message: { $last: '$messages' },
						userInfo: { $first: '$userInfo' },
					},
				},
			]);
			const convs = await query;
			res.status(200).send({ content: convs, count, size: convs.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getMessages = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const chatId = req.params.chatId;
			if (!chatId || !isValidObjectId(chatId)) return res.status(406).send({ message: 'Conversation not found' });
			const conv = await Conversation.findOne({ _id: chatId });
			if (!conv) return res.status(406).send({ message: 'Conversation not found' });
			res.status(200).send({ content: conv });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	addMessage = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const convData = req.body;
			if (!convData.chatId || !isValidObjectId(convData.chatId)) return res.status(406).send({ message: 'Conversation not found' });
			if (!convData.content || convData.content === '') return res.status(406).send({ message: 'Message content must be not empty' });
			let conv = await Conversation.findOne({ _id: convData.chatId });
			const message = {
				content: convData.content as string,
				sender: rootObjectId,
				createdAt: convData.createdAt,
			};
			conv.messages.push(message);
			await conv.save();
			res.status(200).send({ message: 'Message added', data: convData.content });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default ConversationController;
