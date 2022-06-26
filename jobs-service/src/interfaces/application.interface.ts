import { Schema } from 'mongoose';

export type UserResponse = {
	question: Schema.Types.ObjectId;
	response?: String;
};

export enum ApplicationStatus {
	NEW = 'NEW',
	IN_PROGRESS = 'IN_PROGRESS',
	REFUSED = 'REFUSED',
	ACCEPTED = 'ACCEPTED',
}

export interface IApplication {
	jobId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
	motivation: string;
	responses?: UserResponse[];
	notice_period?: String;
	start_date?: String;
	status?: ApplicationStatus;
}
