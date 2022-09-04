import { Schema } from 'mongoose';
export function metadataSchema(schema: any) {
	return new Schema(schema, {
		_id: false,
	});
}

export function createTransactionPostURL(metadata: any) {
	const transaction_token = generateTransactionToken(metadata);
	return `${process.env.APP_URL}/api/payments/charges/transaction/confirm?transaction_token=${transaction_token}`;
}

function generateTransactionToken(metadata: any) {
	const text = JSON.stringify(metadata);
	const buff = Buffer.from(text);
	const base64data = buff.toString('base64');
	return base64data;
}

export function decodeTransactionToken(token: string) {
	const buff = Buffer.from(token, 'base64');
	const text = buff.toString('ascii');
	const metadata = JSON.parse(text);
	return metadata;
}
