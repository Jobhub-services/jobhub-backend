import { ConnectOptions } from 'mongoose';

const { DB_PASSWORD, DB_USERNAME, DB_NAME } = process.env;

type DBConnection = {
	url: string;
	options: ConnectOptions;
};

export const dbConnection: DBConnection = {
	url: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@staak-cluster.ntblm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
	options: {},
};
