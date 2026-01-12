/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { upstashQStashApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashQStashApiRequest.call(this, 'GET', '/v2/dlq');

	return this.helpers.returnJsonArray(response);
}

export async function deleteDlqMessage(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const dlqId = this.getNodeParameter('dlqId', index) as string;

	await upstashQStashApiRequest.call(this, 'DELETE', `/v2/dlq/${dlqId}`);

	return this.helpers.returnJsonArray({ success: true, dlqId });
}

export async function retry(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const dlqId = this.getNodeParameter('dlqId', index) as string;

	const response = await upstashQStashApiRequest.call(this, 'POST', `/v2/dlq/${dlqId}`);

	return this.helpers.returnJsonArray({ success: true, dlqId, response });
}
