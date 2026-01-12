/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}/topics`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const topicName = this.getNodeParameter('topicName', index) as string;
	const partitions = this.getNodeParameter('partitions', index, 1) as number;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const body: IDataObject = {
		name: topicName,
		partitions,
	};

	if (options.retentionTime) {
		body.retention_time = options.retentionTime;
	}
	if (options.retentionSize) {
		body.retention_size = options.retentionSize;
	}
	if (options.maxMessageSize) {
		body.max_message_size = options.maxMessageSize;
	}
	if (options.cleanupPolicy) {
		body.cleanup_policy = options.cleanupPolicy;
	}

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/topic`,
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const topicName = this.getNodeParameter('topicName', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}/topic/${topicName}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteTopic(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const topicName = this.getNodeParameter('topicName', index) as string;

	await upstashManagementApiRequest.call(
		this,
		'DELETE',
		`/kafka/cluster/${clusterId}/topic/${topicName}`,
	);

	return this.helpers.returnJsonArray({ success: true, clusterId, topicName });
}

export async function reconfigure(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const topicName = this.getNodeParameter('topicName', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const body: IDataObject = {};

	if (options.retentionTime !== undefined) {
		body.retention_time = options.retentionTime;
	}
	if (options.retentionSize !== undefined) {
		body.retention_size = options.retentionSize;
	}
	if (options.maxMessageSize !== undefined) {
		body.max_message_size = options.maxMessageSize;
	}

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/topic/${topicName}/reconfigure`,
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function getStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const topicName = this.getNodeParameter('topicName', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}/topic/${topicName}/stats`,
	);

	return this.helpers.returnJsonArray(response);
}
