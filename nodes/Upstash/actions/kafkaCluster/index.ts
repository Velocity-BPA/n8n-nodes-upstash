/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashManagementApiRequest.call(this, 'GET', '/kafka/clusters');

	return this.helpers.returnJsonArray(response);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const region = this.getNodeParameter('region', index) as string;
	const multizone = this.getNodeParameter('multizone', index, false) as boolean;

	const body: IDataObject = {
		name,
		region,
		multizone,
	};

	const response = await upstashManagementApiRequest.call(this, 'POST', '/kafka/cluster', body);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteCluster(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;

	await upstashManagementApiRequest.call(this, 'DELETE', `/kafka/cluster/${clusterId}`);

	return this.helpers.returnJsonArray({ success: true, clusterId });
}

export async function rename(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const name = this.getNodeParameter('newName', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/rename/${name}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function resetPassword(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/reset-password`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function getStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}/stats`,
	);

	return this.helpers.returnJsonArray(response);
}
