import { Types } from 'mongoose';
export interface IUserConnection {
	userId: Types.ObjectId;
	connections: any[];
}
