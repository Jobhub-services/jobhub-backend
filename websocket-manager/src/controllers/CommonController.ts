import { isValidObjectId } from '@/helpers';
import { IConversation } from '@/interfaces/conversation.interface';
import Conversation from '@/models/Conversation';
import { Request, Response } from 'express';

class CommonController {
	getMessages = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const chatId = req.params.chatId;
			if (!chatId || !isValidObjectId(chatId)) return res.status(406).send({ message: 'Conversation not found' });
			const conv: IConversation = await Conversation.findOne({ _id: chatId, members: { $in: rootObjectId } });
			const isMember = conv?.members?.some((elem) => elem.toString() === rootObjectId.toString());
			if (!conv || !isMember) return res.status(406).send({ message: 'Conversation not found' });
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
			let conv = await Conversation.findOne({ _id: convData.chatId, members: { $in: rootObjectId } });
			if (!conv) return res.status(406).send({ message: 'Conversation not found' });
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

export default CommonController;
