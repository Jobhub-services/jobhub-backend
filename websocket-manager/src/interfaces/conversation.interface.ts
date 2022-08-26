import { Types } from 'mongoose';

export interface IConversation {
	_id: Types.ObjectId;
	createdBy: Types.ObjectId;
	members: Types.ObjectId[];
	messages: [
		{
			content: string;
			sender: Types.ObjectId;
		}
	];
}
