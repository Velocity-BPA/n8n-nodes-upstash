/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest } from '../../transport/GenericFunctions';

export async function getDailyStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resourceType = this.getNodeParameter('resourceType', index) as string;
	const resourceId = this.getNodeParameter('resourceId', index) as string;

	let endpoint: string;

	switch (resourceType) {
		case 'redis':
			endpoint = `/redis/database/${resourceId}/stats`;
			break;
		case 'kafka':
			endpoint = `/kafka/cluster/${resourceId}/stats`;
			break;
		case 'vector':
			endpoint = `/vector/index/${resourceId}/stats`;
			break;
		default:
			throw new Error(`Unknown resource type: ${resourceType}`);
	}

	const response = await upstashManagementApiRequest.call(this, 'GET', endpoint);

	return this.helpers.returnJsonArray(response);
}

export async function getMonthlyStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resourceType = this.getNodeParameter('resourceType', index) as string;
	const resourceId = this.getNodeParameter('resourceId', index) as string;

	let endpoint: string;

	switch (resourceType) {
		case 'redis':
			endpoint = `/redis/database/${resourceId}/stats/monthly`;
			break;
		case 'kafka':
			endpoint = `/kafka/cluster/${resourceId}/stats/monthly`;
			break;
		case 'vector':
			endpoint = `/vector/index/${resourceId}/stats/monthly`;
			break;
		default:
			throw new Error(`Unknown resource type: ${resourceType}`);
	}

	const response = await upstashManagementApiRequest.call(this, 'GET', endpoint);

	return this.helpers.returnJsonArray(response);
}

export async function getBilling(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashManagementApiRequest.call(this, 'GET', '/billing');

	return this.helpers.returnJsonArray(response);
}
