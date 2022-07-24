import { Types } from 'mongoose';
import { IJobQuestion } from '@/interfaces/companyJob.interface';

export enum ApplicationStatus {
	NEW = 'NEW',
	IN_PROGRESS = 'IN_PROGRESS',
	DECLINED = 'DECLINED',
	ACCEPTED = 'ACCEPTED',
	HIRED = 'HIRED',
}

export enum InterviewStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	FINISHED = 'FINISHED',
}

export type UserResponse = {
	question: IJobQuestion;
	response?: String;
};

export type ApplicationInterview = {
	_id?: Types.ObjectId;
	title?: string;
	startDate?: string;
	endDate?: string;
	note?: string;
	link?: string;
	location?: string;
	status?: InterviewStatus;
};

export interface IApplication {
	_id?: Types.ObjectId;
	jobId: Types.ObjectId;
	companyId: Types.ObjectId;
	userId: Types.ObjectId;
	status?: ApplicationStatus;
	motivation: string;
	notice_period?: String;
	start_date?: String;
	responses?: UserResponse[];
	interviews?: ApplicationInterview[];
}
