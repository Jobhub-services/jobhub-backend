import './register';
import 'reflect-metadata';
import { connect, connection } from 'mongoose';
import { IncomingMessage, ServerResponse } from 'http';

import { app } from '../src/index';

const DB_URL = process.env.DB_CONNECT_URL!;

let connectionPromise: Promise<void> | null = null;

function getDbConnection(): Promise<void> {
	if (connection.readyState >= 1) return Promise.resolve();
	if (!connectionPromise) {
		connectionPromise = connect(DB_URL, {})
			.then(() => { connectionPromise = null; })
			.catch((err) => { connectionPromise = null; throw err; });
	}
	return connectionPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
	await getDbConnection();
	return new Promise((resolve) => {
		(app as any)(req, res, resolve);
	});
}
