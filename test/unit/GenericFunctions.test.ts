/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	buildRedisCommand,
	verifyQStashSignature,
	objectToHashFields,
	hashFieldsToObject,
} from '../../nodes/Upstash/transport/GenericFunctions';

describe('GenericFunctions', () => {
	describe('buildRedisCommand', () => {
		it('should build SET command with key and value', () => {
			const result = buildRedisCommand('set', { key: 'mykey', value: 'myvalue' });
			expect(result).toEqual(['SET', 'mykey', 'myvalue']);
		});

		it('should build SET command with TTL', () => {
			const result = buildRedisCommand('set', { key: 'mykey', value: 'myvalue', ttl: 60 });
			expect(result).toEqual(['SET', 'mykey', 'myvalue', 'EX', 60]);
		});

		it('should build GET command', () => {
			const result = buildRedisCommand('get', { key: 'mykey' });
			expect(result).toEqual(['GET', 'mykey']);
		});

		it('should build DEL command', () => {
			const result = buildRedisCommand('del', { key: 'mykey' });
			expect(result).toEqual(['DEL', 'mykey']);
		});

		it('should build MSET command', () => {
			const result = buildRedisCommand('mset', {
				pairs: [
					{ key: 'key1', value: 'value1' },
					{ key: 'key2', value: 'value2' },
				],
			});
			expect(result).toEqual(['MSET', 'key1', 'value1', 'key2', 'value2']);
		});

		it('should build MGET command', () => {
			const result = buildRedisCommand('mget', { keys: ['key1', 'key2', 'key3'] });
			expect(result).toEqual(['MGET', 'key1', 'key2', 'key3']);
		});

		it('should build INCR command', () => {
			const result = buildRedisCommand('incr', { key: 'counter' });
			expect(result).toEqual(['INCR', 'counter']);
		});

		it('should build INCRBY command', () => {
			const result = buildRedisCommand('incrby', { key: 'counter', amount: 5 });
			expect(result).toEqual(['INCRBY', 'counter', 5]);
		});

		it('should build EXPIRE command', () => {
			const result = buildRedisCommand('expire', { key: 'mykey', seconds: 300 });
			expect(result).toEqual(['EXPIRE', 'mykey', 300]);
		});

		it('should build KEYS command with pattern', () => {
			const result = buildRedisCommand('keys', { pattern: 'user:*' });
			expect(result).toEqual(['KEYS', 'user:*']);
		});

		it('should build LPUSH command', () => {
			const result = buildRedisCommand('lpush', { key: 'mylist', values: ['item1', 'item2'] });
			expect(result).toEqual(['LPUSH', 'mylist', 'item1', 'item2']);
		});

		it('should build LRANGE command', () => {
			const result = buildRedisCommand('lrange', { key: 'mylist', start: 0, stop: -1 });
			expect(result).toEqual(['LRANGE', 'mylist', 0, -1]);
		});

		it('should build SADD command', () => {
			const result = buildRedisCommand('sadd', { key: 'myset', members: ['member1', 'member2'] });
			expect(result).toEqual(['SADD', 'myset', 'member1', 'member2']);
		});

		it('should build HSET command', () => {
			const result = buildRedisCommand('hset', { key: 'myhash', field: 'field1', value: 'value1' });
			expect(result).toEqual(['HSET', 'myhash', 'field1', 'value1']);
		});

		it('should build HGET command', () => {
			const result = buildRedisCommand('hget', { key: 'myhash', field: 'field1' });
			expect(result).toEqual(['HGET', 'myhash', 'field1']);
		});

		it('should build ZADD command', () => {
			const result = buildRedisCommand('zadd', { key: 'myzset', score: 1, member: 'member1' });
			expect(result).toEqual(['ZADD', 'myzset', 1, 'member1']);
		});

		it('should build ZRANGE command', () => {
			const result = buildRedisCommand('zrange', { key: 'myzset', start: 0, stop: -1 });
			expect(result).toEqual(['ZRANGE', 'myzset', 0, -1]);
		});

		it('should build PUBLISH command', () => {
			const result = buildRedisCommand('publish', { channel: 'mychannel', message: 'Hello!' });
			expect(result).toEqual(['PUBLISH', 'mychannel', 'Hello!']);
		});

		it('should build custom command from args array', () => {
			const result = buildRedisCommand('executeCommand', { args: ['PING'] });
			expect(result).toEqual(['PING']);
		});
	});

	describe('verifyQStashSignature', () => {
		const signingKey = 'test-signing-key-12345';

		it('should return true for valid signature', () => {
			const payload = '{"test": "data"}';
			// Pre-computed valid signature for this payload and key
			const crypto = require('crypto');
			const hmac = crypto.createHmac('sha256', signingKey);
			hmac.update(payload);
			const validSignature = hmac.digest('base64');

			const result = verifyQStashSignature(payload, validSignature, signingKey);
			expect(result).toBe(true);
		});

		it('should return false for invalid signature', () => {
			const payload = '{"test": "data"}';
			const invalidSignature = 'invalid-signature-base64==';

			const result = verifyQStashSignature(payload, invalidSignature, signingKey);
			expect(result).toBe(false);
		});

		it('should return false for tampered payload', () => {
			const originalPayload = '{"test": "data"}';
			const tamperedPayload = '{"test": "tampered"}';
			
			const crypto = require('crypto');
			const hmac = crypto.createHmac('sha256', signingKey);
			hmac.update(originalPayload);
			const signature = hmac.digest('base64');

			const result = verifyQStashSignature(tamperedPayload, signature, signingKey);
			expect(result).toBe(false);
		});
	});

	describe('objectToHashFields', () => {
		it('should convert object to array of key-value pairs', () => {
			const obj = { field1: 'value1', field2: 'value2' };
			const result = objectToHashFields(obj);
			expect(result).toEqual(['field1', 'value1', 'field2', 'value2']);
		});

		it('should handle empty object', () => {
			const result = objectToHashFields({});
			expect(result).toEqual([]);
		});

		it('should convert numeric values to strings', () => {
			const obj = { count: 42, score: 3.14 };
			const result = objectToHashFields(obj);
			expect(result).toEqual(['count', '42', 'score', '3.14']);
		});

		it('should handle boolean values', () => {
			const obj = { active: true, disabled: false };
			const result = objectToHashFields(obj);
			expect(result).toEqual(['active', 'true', 'disabled', 'false']);
		});
	});

	describe('hashFieldsToObject', () => {
		it('should convert array of key-value pairs to object', () => {
			const fields = ['field1', 'value1', 'field2', 'value2'];
			const result = hashFieldsToObject(fields);
			expect(result).toEqual({ field1: 'value1', field2: 'value2' });
		});

		it('should handle empty array', () => {
			const result = hashFieldsToObject([]);
			expect(result).toEqual({});
		});

		it('should handle odd number of elements', () => {
			const fields = ['field1', 'value1', 'field2'];
			const result = hashFieldsToObject(fields);
			// Last field without value should still be included with undefined
			expect(result).toHaveProperty('field1', 'value1');
		});
	});
});
