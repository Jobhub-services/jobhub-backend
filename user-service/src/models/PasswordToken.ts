import { model, Schema, Document, Types } from 'mongoose';
import { IPasswordToken } from '@/interfaces/users.interface';
import User from '@/models/User';

const passwordTokenSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		passCode: String,
	},
	{
		timestamps: true,
	}
);

const PasswordToken = model<IPasswordToken & Document>('PasswordToken', passwordTokenSchema);

export default PasswordToken;
