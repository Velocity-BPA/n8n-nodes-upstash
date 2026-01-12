/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashQStashApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashQStashApiRequest.call(this, 'GET', '/v2/schedules');

	return this.helpers.returnJsonArray(response);
}

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const destination = this.getNodeParameter('destination', index) as string;
	const cron = this.getNodeParameter('cron', index) as string;
	const body = this.getNodeParameter('body', index, '') as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const headers: IDataObject = {
		'Upstash-Cron': cron,
	};

	// Set content type if body is provided
	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	// Add optional headers
	if (options.retries !== undefined && options.retries !== null) {
		headers['Upstash-Retries'] = options.retries.toString();
	}
	if (options.callback) {
		headers['Upstash-Callback'] = options.callback;
	}
	if (options.failureCallback) {
		headers['Upstash-Failure-Callback'] = options.failureCallback;
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
		`/v2/schedules/${destination}`,
		body || undefined,
		headers,
	);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const scheduleId = this.getNodeParameter('scheduleId', index) as string;

	const response = await upstashQStashApiRequest.call(this, 'GET', `/v2/schedules/${scheduleId}`);

	return this.helpers.returnJsonArray(response);
}

export async function deleteSchedule(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const scheduleId = this.getNodeParameter('scheduleId', index) as string;

	await upstashQStashApiRequest.call(this, 'DELETE', `/v2/schedules/${scheduleId}`);

	return this.helpers.returnJsonArray({ success: true, scheduleId });
}

export async function pause(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const scheduleId = this.getNodeParameter('scheduleId', index) as string;

	const response = await upstashQStashApiRequest.call(
		this,
		'POST',
		`/v2/schedules/${scheduleId}/pause`,
	);

	return this.helpers.returnJsonArray({ success: true, scheduleId, paused: true, response });
}

export async function resume(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const scheduleId = this.getNodeParameter('scheduleId', index) as string;

	const response = await upstashQStashApiRequest.call(
		this,
		'POST',
		`/v2/schedules/${scheduleId}/resume`,
	);

	return this.helpers.returnJsonArray({ success: true, scheduleId, paused: false, response });
}
