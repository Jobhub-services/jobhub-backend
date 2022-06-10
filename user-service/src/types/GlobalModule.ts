import { IUser } from '@/interfaces/users.interface';
declare global {
	var authUser: IUser;
	var accessToken: string;
}
export {};
