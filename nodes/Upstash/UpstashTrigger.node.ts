/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

import { verifyQStashSignature } from './transport/GenericFunctions';

export class UpstashTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Upstash Trigger',
		name: 'upstashTrigger',
		icon: 'file:upstash.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receives QStash webhook callbacks from Upstash',
		defaults: {
			name: 'Upstash Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'upstashApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Message Delivered',
						value: 'message.delivered',
						description: 'Triggered when a QStash message is successfully delivered',
					},
					{
						name: 'Message Failed',
						value: 'message.failed',
						description: 'Triggered when a QStash message delivery fails',
					},
					{
						name: 'Message DLQ',
						value: 'message.dlq',
						description: 'Triggered when a message is moved to dead letter queue',
					},
					{
						name: 'All Events',
						value: 'all',
						description: 'Receive all QStash webhook events',
					},
				],
				default: 'all',
				description: 'The event type to listen for',
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the QStash webhook signature for security',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Headers',
						name: 'includeHeaders',
						type: 'boolean',
						default: false,
						description: 'Whether to include request headers in the output',
					},
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw request body',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Webhooks are created externally in QStash
				// This just returns true to indicate webhook mode is enabled
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// No automatic webhook creation - user configures in QStash
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// No automatic webhook deletion
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const event = this.getNodeParameter('event') as string;
		const verifySignature = this.getNodeParameter('verifySignature') as boolean;
		const options = this.getNodeParameter('options') as {
			includeHeaders?: boolean;
			includeRawBody?: boolean;
		};

		// Get the request body
		const body = this.getBodyData();

		// Verify signature if enabled
		if (verifySignature) {
			const credentials = await this.getCredentials('upstashApi');
			const qstashSigningKey = credentials.qstashSigningKey as string;

			if (!qstashSigningKey) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'QStash signing key not configured' },
					},
				};
			}

			const signature = req.headers['upstash-signature'] as string;

			if (!signature) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'Missing Upstash-Signature header' },
					},
				};
			}

			// Get raw body for signature verification
			const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

			const isValid = verifyQStashSignature(rawBody, signature, qstashSigningKey);

			if (!isValid) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'Invalid signature' },
					},
				};
			}
		}

		// Extract event type from headers or body
		const eventType = (req.headers['upstash-message-status'] as string) || 
			(body as Record<string, unknown>).status || 'unknown';

		// Filter by event type if not 'all'
		if (event !== 'all') {
			const eventMatches = 
				(event === 'message.delivered' && eventType === 'delivered') ||
				(event === 'message.failed' && eventType === 'failed') ||
				(event === 'message.dlq' && eventType === 'dlq');

			if (!eventMatches) {
				// Return 200 but don't trigger workflow
				return {
					webhookResponse: {
						status: 200,
						body: { received: true, filtered: true },
					},
				};
			}
		}

		// Build response data
		const responseData: IDataObject = {
			event: eventType as string,
			messageId: (req.headers['upstash-message-id'] as string) || null,
			scheduleId: (req.headers['upstash-schedule-id'] as string) || null,
			retried: parseInt(req.headers['upstash-retried'] as string, 10) || 0,
			maxRetries: parseInt(req.headers['upstash-max-retries'] as string, 10) || 3,
			body: body,
			receivedAt: new Date().toISOString(),
		};

		// Include headers if requested
		if (options.includeHeaders) {
			responseData.headers = req.headers;
		}

		// Include raw body if requested
		if (options.includeRawBody) {
			responseData.rawBody = typeof body === 'string' ? body : JSON.stringify(body);
		}

		return {
			workflowData: [
				[
					{
						json: responseData,
					},
				],
			],
		};
	}
}
