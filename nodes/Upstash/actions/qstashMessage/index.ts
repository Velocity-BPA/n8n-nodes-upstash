/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashQStashApiRequest } from '../../transport/GenericFunctions';

export async function publish(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const destination = this.getNodeParameter('destination', index) as string;
	const body = this.getNodeParameter('body', index, '') as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const headers: IDataObject = {};

	// Set content type if body is provided
	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	// Add optional headers
	if (options.delay) {
		headers['Upstash-Delay'] = options.delay;
	}
	if (options.retries !== undefined && options.retries !== null) {
		headers['Upstash-Retries'] = String(options.retries);
	}
	if (options.callback) {
		headers['Upstash-Callback'] = options.callback;
	}
	if (options.failureCallback) {
		headers['Upstash-Failure-Callback'] = options.failureCallback;
	}
	if (options.deduplicationId) {
		headers['Upstash-Deduplication-Id'] = options.deduplicationId;
	}
	if (options.contentBasedDeduplication) {
		headers['Upstash-Content-Based-Deduplication'] = 'true';
	}
	if (options.timeout) {
		headers['Upstash-Timeout'] = options.timeout;
	}
	if (options.method) {
		headers['Upstash-Method'] = options.method;
	}
	if (options.customHeaders) {
		const customHeaders = options.customHeaders as IDataObject;
		for (const [key, value] of Object.entries(customHeaders)) {
			headers[`Upstash-Forward-${key}`] = value;
		}
	}

	const response = await upstashQStashApiRequest.call(
		this,
		'POST',
		`/v2/publish/${destination}`,
		body || undefined,
		headers,
	);

	return this.helpers.returnJsonArray(response);
}

export async function publishBatch(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const messages = this.getNodeParameter('messages.message', index, []) as Array<{
		destination: string;
		body?: string;
		delay?: string;
		retries?: number;
	}>;

	const batchMessages = messages.map((msg) => {
		const message: IDataObject = {
			destination: msg.destination,
		};
		if (msg.body) {
			message.body = msg.body;
		}
		if (msg.delay) {
			message.headers = { 'Upstash-Delay': msg.delay };
		}
		if (msg.retries !== undefined) {
			message.headers = { ...((message.headers as IDataObject) || {}), 'Upstash-Retries': msg.retries.toString() };
		}
		return message;
	});

	const response = await upstashQStashApiRequest.call(
		this,
		'POST',
		'/v2/batch',
		batchMessages,
	);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const messageId = this.getNodeParameter('messageId', index) as string;

	const response = await upstashQStashApiRequest.call(this, 'GET', `/v2/messages/${messageId}`);

	return this.helpers.returnJsonArray(response);
}

export async function deleteMessage(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const messageId = this.getNodeParameter('messageId', index) as string;

	await upstashQStashApiRequest.call(this, 'DELETE', `/v2/messages/${messageId}`);

	return this.helpers.returnJsonArray({ success: true, messageId });
}

export async function cancel(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const messageId = this.getNodeParameter('messageId', index) as string;

	const response = await upstashQStashApiRequest.call(
		this,
		'DELETE',
		`/v2/messages/${messageId}`,
	);

	return this.helpers.returnJsonArray({ success: true, messageId, response });
}
