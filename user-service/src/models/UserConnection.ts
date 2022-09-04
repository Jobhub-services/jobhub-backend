import { model, Schema, Document, Types } from 'mongoose';
import { IUserConnection } from '@/interfaces/userConnection.interface';
import User from '@/models/User';

const userConnectionSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		connections: [Schema.Types.Mixed],
	},
	{
		timestamps: true,
	}
);

const UserConnection = model<IUserConnection & Document>('UserConnection', userConnectionSchema);

export default UserConnection;
