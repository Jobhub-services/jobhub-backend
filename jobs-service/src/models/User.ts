import { model, Schema, Document } from 'mongoose';
import { IUser, UserType } from '@/interfaces/users.interface';

const developerSchema: Schema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	applications: [{
		application: { type: Schema.Types.ObjectId, ref: 'Application' },
		job: { type: Schema.Types.ObjectId, ref: 'CompanyJob' },
	}]
});
const companySchema: Schema = new Schema({
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	companyName: {
		type: String,
		required: true,
	},
});
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
		developerInfo: developerSchema,
		companyInfo: companySchema,
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
			},
		},
	}
);
const User = model<IUser & Document>('User', userSchema);

export default User;
