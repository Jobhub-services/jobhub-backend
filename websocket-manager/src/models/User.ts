import { model, Schema, Document } from 'mongoose';
import { IUser, UserType } from '@/interfaces/users.interface';

const userSchema: Schema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: false,
		},
		userType: {
			type: String,
			enum: UserType,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret: IUser) {
				delete ret.password;
			},
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

const User = model<IUser & Document>('User', userSchema);

export default User;
