import { Types } from 'mongoose';
import { IJobQuestion } from '@/interfaces/companyJob.interface';

export type UserResponse = {
	question: IJobQuestion;
	response?: String;
};

export enum ApplicationStatus {
	NEW = 'NEW',
	IN_PROGRESS = 'IN_PROGRESS',
	DECLINED = 'DECLINED',
	ACCEPTED = 'ACCEPTED',
	HIRED = 'HIRED',
}

export interface IApplication {
	jobId: Types.ObjectId;
	companyId: Types.ObjectId;
	userId: Types.ObjectId;
	responses?: UserResponse[];
	status?: ApplicationStatus;
	motivation: string;
	notice_period?: String;
	start_date?: String;
}
