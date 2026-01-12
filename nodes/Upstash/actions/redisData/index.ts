/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashRedisApiRequest, buildRedisCommand, hashFieldsToObject } from '../../transport/GenericFunctions';

export async function set(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const value = this.getNodeParameter('value', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const params: IDataObject = { key, value };

	if (options.ttl) {
		params.ttl = options.ttl;
	}
	if (options.nx) {
		params.nx = true;
	}
	if (options.xx) {
		params.xx = true;
	}

	const command = buildRedisCommand('set', params);
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ success: result === 'OK', key, value });
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('get', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function del(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('del', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ deleted: result, key });
}

export async function mset(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const pairs = this.getNodeParameter('pairs.pair', index, []) as Array<{ key: string; value: string }>;

	const command = buildRedisCommand('mset', { pairs });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ success: result === 'OK', pairs });
}

export async function mget(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const keysInput = this.getNodeParameter('keys', index) as string;
	const keys = keysInput.split(',').map((k) => k.trim());

	const command = buildRedisCommand('mget', { keys });
	const result = await upstashRedisApiRequest.call(this, command);

	const values: IDataObject = {};
	keys.forEach((key, i) => {
		values[key] = result[i];
	});

	return this.helpers.returnJsonArray({ values });
}

export async function incr(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('incr', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function decr(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('decr', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function incrby(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;

	const command = buildRedisCommand('incrby', { key, amount });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function decrby(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;

	const command = buildRedisCommand('decrby', { key, amount });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function expire(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const seconds = this.getNodeParameter('seconds', index) as number;

	const command = buildRedisCommand('expire', { key, seconds });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, success: result === 1, seconds });
}

export async function ttl(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('ttl', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, ttl: result });
}

export async function exists(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('exists', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, exists: result === 1 });
}

export async function keys(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const pattern = this.getNodeParameter('pattern', index) as string;

	const command = buildRedisCommand('keys', { pattern });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ pattern, keys: result });
}

export async function scan(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const cursor = this.getNodeParameter('cursor', index, 0) as number;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const params: IDataObject = { cursor };
	if (options.pattern) {
		params.pattern = options.pattern;
	}
	if (options.count) {
		params.count = options.count;
	}

	const command = buildRedisCommand('scan', params);
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ cursor: result[0], keys: result[1] });
}

export async function type(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('type', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, type: result });
}

export async function rename(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const newKey = this.getNodeParameter('newKey', index) as string;

	const command = buildRedisCommand('rename', { key, newKey });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ success: result === 'OK', oldKey: key, newKey });
}

export async function lpush(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const valuesInput = this.getNodeParameter('values', index) as string;
	const values = valuesInput.split(',').map((v) => v.trim());

	const command = buildRedisCommand('lpush', { key, values });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, length: result, values });
}

export async function rpush(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const valuesInput = this.getNodeParameter('values', index) as string;
	const values = valuesInput.split(',').map((v) => v.trim());

	const command = buildRedisCommand('rpush', { key, values });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, length: result, values });
}

export async function lpop(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const count = this.getNodeParameter('count', index, undefined) as number | undefined;

	const params: IDataObject = { key };
	if (count) {
		params.count = count;
	}

	const command = buildRedisCommand('lpop', params);
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function rpop(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const count = this.getNodeParameter('count', index, undefined) as number | undefined;

	const params: IDataObject = { key };
	if (count) {
		params.count = count;
	}

	const command = buildRedisCommand('rpop', params);
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, value: result });
}

export async function lrange(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const start = this.getNodeParameter('start', index) as number;
	const stop = this.getNodeParameter('stop', index) as number;

	const command = buildRedisCommand('lrange', { key, start, stop });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, values: result, start, stop });
}

export async function sadd(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const membersInput = this.getNodeParameter('members', index) as string;
	const members = membersInput.split(',').map((m) => m.trim());

	const command = buildRedisCommand('sadd', { key, members });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, added: result, members });
}

export async function smembers(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('smembers', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, members: result });
}

export async function srem(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const membersInput = this.getNodeParameter('members', index) as string;
	const members = membersInput.split(',').map((m) => m.trim());

	const command = buildRedisCommand('srem', { key, members });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, removed: result, members });
}

export async function hset(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const field = this.getNodeParameter('field', index) as string;
	const value = this.getNodeParameter('value', index) as string;

	const command = buildRedisCommand('hset', { key, field, value });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, field, value, created: result === 1 });
}

export async function hget(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const field = this.getNodeParameter('field', index) as string;

	const command = buildRedisCommand('hget', { key, field });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, field, value: result });
}

export async function hgetall(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;

	const command = buildRedisCommand('hgetall', { key });
	const result = await upstashRedisApiRequest.call(this, command);

	// Convert array to object
	const fields = hashFieldsToObject(result as string[]);

	return this.helpers.returnJsonArray({ key, fields });
}

export async function hdel(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const fieldsInput = this.getNodeParameter('fields', index) as string;
	const fields = fieldsInput.split(',').map((f) => f.trim());

	const command = buildRedisCommand('hdel', { key, fields });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, deleted: result, fields });
}

export async function zadd(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const score = this.getNodeParameter('score', index) as number;
	const member = this.getNodeParameter('member', index) as string;

	const command = buildRedisCommand('zadd', { key, score, member });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, added: result, score, member });
}

export async function zrange(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const start = this.getNodeParameter('start', index) as number;
	const stop = this.getNodeParameter('stop', index) as number;
	const withScores = this.getNodeParameter('withScores', index, false) as boolean;

	const command = buildRedisCommand('zrange', { key, start, stop, withScores });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, members: result, start, stop });
}

export async function zrem(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const key = this.getNodeParameter('key', index) as string;
	const membersInput = this.getNodeParameter('members', index) as string;
	const members = membersInput.split(',').map((m) => m.trim());

	const command = buildRedisCommand('zrem', { key, members });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ key, removed: result, members });
}

export async function publish(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const channel = this.getNodeParameter('channel', index) as string;
	const message = this.getNodeParameter('message', index) as string;

	const command = buildRedisCommand('publish', { channel, message });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ channel, message, subscribers: result });
}

export async function executeCommand(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const commandInput = this.getNodeParameter('command', index) as string;
	const args = commandInput.split(' ').map((arg) => {
		// Try to parse as number if possible
		const num = Number(arg);
		return isNaN(num) ? arg : num;
	});

	const command = buildRedisCommand('executeCommand', { args });
	const result = await upstashRedisApiRequest.call(this, command);

	return this.helpers.returnJsonArray({ command: commandInput, result });
}
