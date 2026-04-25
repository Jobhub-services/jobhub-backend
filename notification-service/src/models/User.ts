import { model, Schema, Document } from 'mongoose';
import { IUser } from '@/interfaces/users.interface';

const userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

const User = model<IUser & Document>('User', userSchema);

export default User;
