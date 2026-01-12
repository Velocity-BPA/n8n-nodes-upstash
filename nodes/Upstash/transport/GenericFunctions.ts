/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Make a request to the Upstash Management API
 */
export async function upstashManagementApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<any> {
	const credentials = await this.getCredentials('upstashApi');

	const options: IRequestOptions = {
		method,
		uri: `https://api.upstash.com/v2${endpoint}`,
		auth: {
			user: credentials.email as string,
			pass: credentials.apiKey as string,
		},
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (qs && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Make a request to the Upstash Redis Data API
 */
export async function upstashRedisApiRequest(
	this: IExecuteFunctions | IHookFunctions,
	command: (string | number)[],
): Promise<any> {
	const credentials = await this.getCredentials('upstashApi');

	if (!credentials.redisRestUrl || !credentials.redisRestToken) {
		throw new Error(
			'Redis REST URL and Token are required for data operations. Please configure them in your Upstash credentials.',
		);
	}

	const options: IRequestOptions = {
		method: 'POST',
		uri: credentials.redisRestUrl as string,
		headers: {
			Authorization: `Bearer ${credentials.redisRestToken}`,
			'Content-Type': 'application/json',
		},
		body: command,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);

		if (response.error) {
			throw new Error(response.error);
		}

		return response.result;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Make a pipeline request to the Upstash Redis Data API
 */
export async function upstashRedisPipelineRequest(
	this: IExecuteFunctions | IHookFunctions,
	commands: (string | number)[][],
): Promise<any[]> {
	const credentials = await this.getCredentials('upstashApi');

	if (!credentials.redisRestUrl || !credentials.redisRestToken) {
		throw new Error(
			'Redis REST URL and Token are required for data operations. Please configure them in your Upstash credentials.',
		);
	}

	const options: IRequestOptions = {
		method: 'POST',
		uri: `${credentials.redisRestUrl}/pipeline`,
		headers: {
			Authorization: `Bearer ${credentials.redisRestToken}`,
			'Content-Type': 'application/json',
		},
		body: commands,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);

		if (!Array.isArray(response)) {
			throw new Error('Unexpected pipeline response format');
		}

		return response.map((r: any) => {
			if (r.error) {
				throw new Error(r.error);
			}
			return r.result;
		});
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Make a request to the QStash API
 */
export async function upstashQStashApiRequest(
	this: IExecuteFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | IDataObject[] | string,
	headers?: IDataObject,
): Promise<any> {
	const credentials = await this.getCredentials('upstashApi');

	if (!credentials.qstashToken) {
		throw new Error(
			'QStash Token is required for QStash operations. Please configure it in your Upstash credentials.',
		);
	}

	const requestHeaders: IDataObject = {
		Authorization: `Bearer ${credentials.qstashToken}`,
		...headers,
	};

	if (typeof body === 'object' && body !== null) {
		requestHeaders['Content-Type'] = 'application/json';
	}

	const options: IRequestOptions = {
		method,
		uri: `https://qstash.upstash.io${endpoint}`,
		headers: requestHeaders,
		json: typeof body === 'object',
	};

	if (body) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Make a request to the Upstash Vector API
 */
export async function upstashVectorApiRequest(
	this: IExecuteFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | IDataObject[],
): Promise<any> {
	const credentials = await this.getCredentials('upstashApi');

	if (!credentials.vectorRestUrl || !credentials.vectorRestToken) {
		throw new Error(
			'Vector REST URL and Token are required for Vector operations. Please configure them in your Upstash credentials.',
		);
	}

	const options: IRequestOptions = {
		method,
		uri: `${credentials.vectorRestUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.vectorRestToken}`,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);

		if (response.error) {
			throw new Error(response.error);
		}

		return response.result !== undefined ? response.result : response;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Build a Redis command array from operation and parameters
 */
export function buildRedisCommand(
	operation: string,
	params: IDataObject,
): (string | number)[] {
	const command: (string | number)[] = [operation.toUpperCase()];

	switch (operation.toLowerCase()) {
		case 'set': {
			command.push(params.key as string, params.value as string);
			if (params.ttl) {
				command.push('EX', params.ttl as number);
			}
			if (params.nx) {
				command.push('NX');
			}
			if (params.xx) {
				command.push('XX');
			}
			break;
		}
		case 'get':
		case 'del':
		case 'exists':
		case 'type':
		case 'ttl':
		case 'incr':
		case 'decr':
			command.push(params.key as string);
			break;

		case 'mget': {
			const keys = params.keys as string[];
			command.push(...keys);
			break;
		}

		case 'mset': {
			const pairs = params.pairs as Array<{ key: string; value: string }>;
			for (const pair of pairs) {
				command.push(pair.key, pair.value);
			}
			break;
		}

		case 'incrby':
		case 'decrby':
			command.push(params.key as string, params.amount as number);
			break;

		case 'expire':
			command.push(params.key as string, params.seconds as number);
			break;

		case 'keys':
			command.push(params.pattern as string);
			break;

		case 'scan':
			command.push(params.cursor as number);
			if (params.pattern) {
				command.push('MATCH', params.pattern as string);
			}
			if (params.count) {
				command.push('COUNT', params.count as number);
			}
			break;

		case 'rename':
			command.push(params.key as string, params.newKey as string);
			break;

		case 'lpush':
		case 'rpush': {
			command.push(params.key as string);
			const values = params.values as string[];
			command.push(...values);
			break;
		}

		case 'lpop':
		case 'rpop':
			command.push(params.key as string);
			if (params.count) {
				command.push(params.count as number);
			}
			break;

		case 'lrange':
			command.push(params.key as string, params.start as number, params.stop as number);
			break;

		case 'sadd': {
			command.push(params.key as string);
			const members = params.members as string[];
			command.push(...members);
			break;
		}

		case 'smembers':
			command.push(params.key as string);
			break;

		case 'srem': {
			command.push(params.key as string);
			const membersToRemove = params.members as string[];
			command.push(...membersToRemove);
			break;
		}

		case 'hset':
			command.push(params.key as string, params.field as string, params.value as string);
			break;

		case 'hget':
			command.push(params.key as string, params.field as string);
			break;

		case 'hgetall':
			command.push(params.key as string);
			break;

		case 'hdel': {
			command.push(params.key as string);
			const fields = params.fields as string[];
			command.push(...fields);
			break;
		}

		case 'zadd':
			command.push(params.key as string, params.score as number, params.member as string);
			break;

		case 'zrange':
			command.push(params.key as string, params.start as number, params.stop as number);
			if (params.withScores) {
				command.push('WITHSCORES');
			}
			break;

		case 'zrem': {
			command.push(params.key as string);
			const membersToRemoveZ = params.members as string[];
			command.push(...membersToRemoveZ);
			break;
		}

		case 'publish':
			command.push(params.channel as string, params.message as string);
			break;

		default: {
			// For executeCommand, use the provided args
			if (params.args && Array.isArray(params.args)) {
				command.length = 0; // Clear the array
				command.push(...(params.args as (string | number)[]));
			}
			break;
		}
	}

	return command;
}

/**
 * Verify QStash webhook signature
 */
export function verifyQStashSignature(
	payload: string,
	signature: string,
	signingKey: string,
): boolean {
	const hmac = crypto.createHmac('sha256', signingKey);
	hmac.update(payload);
	const expectedSignature = hmac.digest('base64');
	return signature === expectedSignature;
}

/**
 * Helper to convert object to hash field-value array
 */
export function objectToHashFields(obj: IDataObject): string[] {
	const fields: string[] = [];
	for (const [key, value] of Object.entries(obj)) {
		fields.push(key, String(value));
	}
	return fields;
}

/**
 * Helper to convert hash field-value array to object
 */
export function hashFieldsToObject(fields: string[]): IDataObject {
	const obj: IDataObject = {};
	for (let i = 0; i < fields.length; i += 2) {
		obj[fields[i]] = fields[i + 1];
	}
	return obj;
}
