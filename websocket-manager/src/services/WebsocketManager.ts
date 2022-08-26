import type { Responder, ReactiveSocket, Payload, ISubscription } from 'rsocket-types';
import { Flowable, Single } from 'rsocket-flowable';
import RSocketWebSocketServer from 'rsocket-websocket-server';
import { RSocketServer, MAX_STREAM_ID, Leases } from 'rsocket-core';
import { ServerOptions } from '@/types/WebSocket';

export class SymmetricResponder implements Responder<string, string> {
	logRequest(type: string, payload: Payload<string, string>) {
		console.log(
			`Server got ${type} with payload: data: ${payload.data || 'null'},
      metadata: ${payload.metadata || 'null'}`
		);
	}
	make(data: any): Payload<string, string> {
		return {
			data,
			metadata: '',
		};
	}
	fireAndForget(payload): void {
		this.logRequest('fnf', payload);
	}

	requestResponse(payload): Single<Payload<string, string>> {
		this.logRequest('requestResponse', payload);
		return Single.of(this.make(JSON.stringify({ tets: payload })));
	}

	requestStream(payload): Flowable<Payload<string, string>> {
		this.logRequest('requestStream', payload);
		return Flowable.just(this.make(JSON.stringify({ content: 'Hello' })), this.make(JSON.stringify({ content: 'world!' })));
	}

	requestChannel(payloads: Flowable<Payload<string, string>>): Flowable<Payload<string, string>> {
		this.logRequest('requestChannel', null);
		return Flowable.error(new Error());
	}

	metadataPush(payload): Single<void> {
		this.logRequest('metadataPush', payload);
		return Single.error(new Error());
	}
}
export class WebSocketManager {
	private _server: ReactiveSocket<any, any> | undefined;
	private serverOptions: ServerOptions;
	constructor(options: ServerOptions) {
		this.serverOptions = {
			host: options.host,
			port: options.port,
		};
	}
	doOperation(socket: ReactiveSocket<string, string>, operation: string, payload: string): Flowable<Payload<string, string>> {
		switch (operation) {
			case 'none':
				return Flowable.never();
			case 'stream':
			default:
				console.log(`Requesting stream with payload: ${payload}`);
				return socket.requestStream({
					data: `i a requesting data ${payload}`,
					metadata: '',
				});
		}
	}
	runOperation(socket, options) {
		console.log('i will run runOperation');
		return new Promise((resolve, reject) => {
			let subscription: ISubscription;
			this.doOperation(socket, options.operation, options.payload).subscribe({
				onComplete() {
					console.log('onComplete()', options.payload);
					resolve(options.payload);
				},
				onError(error) {
					console.log('onError(%s)', error.message);
					reject(error);
				},
				onNext(payload) {
					console.log('onNext(%s)', payload.data);
				},
				onSubscribe(_subscription) {
					subscription = _subscription;
					subscription.request(MAX_STREAM_ID);
				},
			});
		});
	}
	async run() {
		return new Promise(() => {
			const server = new RSocketServer({
				getRequestHandler: (socket, payload) => {
					socket.connectionStatus().subscribe({
						onComplete() {
							console.log('connecion is set');
						},
						onNext(value) {
							console.log('the value is ', value, payload);
						},
						onError(error) {
							console.log(error);
						},
						onSubscribe: (sucbscription) => {
							console.log('subscription ', sucbscription.request(2));
						},
					});
					console.log('payload is ', payload, socket.availability());
					this.runOperation(socket, this.serverOptions);
					return new SymmetricResponder();
				},
				transport: new RSocketWebSocketServer({ ...this.serverOptions }),
			});
			server.start();
			console.log(`Server started on ${this.serverOptions.host}:${this.serverOptions.port}`);
		});
	}
}
