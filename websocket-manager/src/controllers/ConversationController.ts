import { ConversationDto } from '@/dtos/conversation.dto';
import { isValidObjectId } from '@/helpers';
import Conversation from '@/models/Conversation';
import { permissionService } from '@/services/PermissionService';
import { Request, Response } from 'express';
class ConversationController {
	createConversation = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const convData: ConversationDto = req.body;
			const members = convData.members;
			if (members.indexOf(rootObjectId.toString() as any) < 0) return res.status(406).send({ message: 'Owner should be member in conversation' });
			if (members.length < 2) return res.status(406).send({ message: 'Members at least must be two' });
			const conversationItem = await Conversation.findOne({ members: members, createdBy: rootObjectId });
			if (conversationItem) return res.status(200).send({ message: 'Conversation created successfully', data: conversationItem._id });
			const contactsNumber = await permissionService.getSubscriptionContactInfo(rootObjectId);
			if (contactsNumber == 0)
				return res.status(406).send({ message: "Your don't have enough contact to create this conversation , please wait contact support" });
			const conversation = await Conversation.create({
				createdBy: rootObjectId,
				members: convData.members,
				messages: [],
			});
			await permissionService.subtractContactsSubscription(rootObjectId);
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
			let queryConditions: any = { createdBy: rootObjectId };
			const count = await Conversation.count(queryConditions);

			const limitFilters = [];
			let pageN;
			const limitN = Number(limit);
			if (page) {
				pageN = Number(page);
				limitFilters.push({ $skip: pageN * limitN });
			}
			limitFilters.push({ $limit: limitN });

			const query = Conversation.aggregate([
				{ $match: queryConditions },
				...limitFilters,
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
}

export default ConversationController;
