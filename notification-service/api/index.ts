import 'reflect-metadata';
import { connect, connection } from 'mongoose';
import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';

import { app } from '../src/index';

const DB_URL = process.env.DB_CONNECT_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

const PUBLIC_ROUTES = [
	'/api/notifications/newsletter/subscribe',
	'/api/notifications/contact-us',
	'/api/notifications/preview/reset-password',
	'/api/notifications/preview/job-alerts',
];

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

function applyAuth(req: any, res: any): boolean {
	const path: string = req.url?.split('?')[0] ?? '';
	const isPublic = PUBLIC_ROUTES.some((r) => path === r || path.startsWith(r + '/'));
	if (isPublic) return true;

	const token = (req.headers.authorization as string | undefined)?.replace(/^Bearer\s+/i, '');
	if (!token) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ message: 'Unauthorized' }));
		return false;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as any;
		req.headers['user'] = JSON.stringify(decoded);
		req.headers['user_id'] = decoded._id ?? decoded.id ?? '';
		return true;
	} catch {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ message: 'Invalid token' }));
		return false;
	}
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
	await getDbConnection();
	if (!applyAuth(req, res)) return;
	return new Promise((resolve) => {
		(app as any)(req, res, resolve);
	});
}
