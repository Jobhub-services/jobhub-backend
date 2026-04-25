import { ConnectOptions } from 'mongoose';

const { DB_CONNECT_URL } = process.env;

type DBConnection = {
	url: string;
	options: ConnectOptions;
};

export const dbConnection: DBConnection = {
	url: DB_CONNECT_URL,
	options: {},
};
