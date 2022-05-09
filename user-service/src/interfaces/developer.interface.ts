import { Schema } from 'mongoose';
export interface IDeveloper {
	userId: Schema.Types.ObjectId;
	summary: string;
}
