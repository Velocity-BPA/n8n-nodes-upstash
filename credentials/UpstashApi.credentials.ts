/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UpstashApi implements ICredentialType {
	name = 'upstashApi';
	displayName = 'Upstash API';
	documentationUrl = 'https://docs.upstash.com/redis/features/restapi';
	properties: INodeProperties[] = [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			placeholder: 'name@example.com',
			default: '',
			required: true,
			description: 'Your Upstash account email address',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'API key from Upstash Console (Account → API Keys). Used for Management API authentication.',
		},
		{
			displayName: 'Redis REST URL',
			name: 'redisRestUrl',
			type: 'string',
			default: '',
			placeholder: 'https://xxx.upstash.io',
			description:
				'Redis database REST URL from your database details page. Required for Redis data operations.',
		},
		{
			displayName: 'Redis REST Token',
			name: 'redisRestToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'Redis database REST token (UPSTASH_REDIS_REST_TOKEN) from your database details page. Required for Redis data operations.',
		},
		{
			displayName: 'QStash Token',
			name: 'qstashToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'QStash token from the QStash dashboard. Required for QStash message and schedule operations.',
		},
		{
			displayName: 'QStash Signing Key',
			name: 'qstashSigningKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'QStash signing key for webhook verification. Required for the Upstash Trigger node.',
		},
		{
			displayName: 'Vector REST URL',
			name: 'vectorRestUrl',
			type: 'string',
			default: '',
			placeholder: 'https://xxx-vector.upstash.io',
			description:
				'Vector index REST URL from your index details page. Required for Vector operations.',
		},
		{
			displayName: 'Vector REST Token',
			name: 'vectorRestToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'Vector index REST token from your index details page. Required for Vector operations.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.email}}',
				password: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.upstash.com/v2',
			url: '/redis/databases',
			method: 'GET',
		},
	};
}
