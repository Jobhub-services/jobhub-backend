import { model, Schema, Document } from 'mongoose';
import { IUserContact } from '@/interfaces/userContacts.interface';

const userContactSchema: Schema = new Schema({
	email: String,
	name: String,
	companyName: String,
	message: String,
});

const UserContact = model<IUserContact & Document>('UserContact', userContactSchema);

export default UserContact;
