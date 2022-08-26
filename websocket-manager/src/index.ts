import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import { connect, set, Types } from 'mongoose';
import express, { json, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import '@/types';
import { dbConnection } from '@/config/db.config';
import { SERVICE_API_PATH } from '@/constants/app.constants';
import Router from '@/routes';
/*
import {
	OnExtensionSubscriber,
	OnNextSubscriber,
	OnTerminalSubscriber,
	Payload,
	RSocketServer,
} from 'rsocket-core';*/
import { WebsocketServerTransport } from 'rsocket-websocket-server';
import WebSocket from 'ws';
import { exit } from 'process';
import { WebSocketManager } from '@/services/WebsocketManager';
import { ServerOptions } from '@/types/WebSocket';

const serverOptions: ServerOptions = {
	host: 'localhost',
	port: 3010,
};

const app = express();

app.use(fileUpload({}));
app.use(cookieParser());
app.use(json());
app.use(cors());
app.use('/', (req: Request, res: Response, next) => {
	if (req.headers['user_id'] && req.headers['user']) {
		req.user = JSON.parse(req.headers['user'] as string);
		const userId = new Types.ObjectId(String(req.headers['user_id']));
		req.user._id = userId;
		global.authUser = req.user;
		req.rootObjectId = userId;
	}
	next();
});
app.use(`/api/${SERVICE_API_PATH}`, Router);

if (NODE_ENV !== 'production') set('debug', true);

const websocket = new WebSocketManager(serverOptions);
Promise.resolve(websocket.run())
	.then(() => {
		console.log('will exit websocket server');
		//process.exit(0);
	})
	.catch((error) => {
		console.error('handle ------------------------------------------', error.stack);
		process.exit(1);
	});
/*websocket
	.run()
	.then(() => {
		console.log('server is lunched');
		//process.exit(0);
	})
	.catch((error) => {
		console.log('iw ill print error');
		console.error(error.stack);
	});*/

connect(dbConnection.url, dbConnection.options)
	.then(async (_connection) => {
		app.listen(process.env.APP_PORT, () => {
			console.log(`server started. ${process.env.APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));

/*async function main() {
	const transport = new WebsocketServerTransport({
		wsCreator: (options) => {
			return new WebSocket.Server({
				host: process.env.SOCKET_URL,
				port: process.env.SOCKET_PORT,
			});
		},
	});
	const server = new RSocketServer({
		transport: transport,
		acceptor: {
			accept: async () => ({
				requestResponse: (payload: Payload, responderStream: OnTerminalSubscriber & OnNextSubscriber & OnExtensionSubscriber) => {
					console.log(payload.data.toString(), payload.metadata.toString());
					const timeout = setTimeout(
						() =>
							responderStream.onNext(
								{
									data: Buffer.from(JSON.stringify({ name: payload }), 'utf-8'),
								},
								true
							),
						1000
					);
					return {
						cancel: () => {
							clearTimeout(timeout);
							console.log('cancelled');
						},
						onExtension: () => {
							console.log('Received Extension request');
						},
					};
				},

			}),
		},
	});
	const serverClosable = await server.bind().;
	//serverClosable.close();
}
main()
	.then((e: any) => console.log('wait client to send data', e))
	.catch((error: Error) => {
		console.error(error);
		exit(1);
	});
*/
