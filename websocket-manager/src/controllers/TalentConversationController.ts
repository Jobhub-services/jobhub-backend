import Conversation from '@/models/Conversation';
import { Request, Response } from 'express';

class TalentConversationController {
	getConversations = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const { name = '', limit = 20, page } = req.query;
			const count = await Conversation.count({ createdBy: rootObjectId });
			let queryConditions: any = { members: { $in: [rootObjectId] } };
			console.log(rootObjectId);
			const query = Conversation.aggregate([
				{ $match: queryConditions },
				{
					$lookup: {
						from: 'companies',
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
									companyName: 1,
									industry: '$generalinfo.industry',
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

export default TalentConversationController;
