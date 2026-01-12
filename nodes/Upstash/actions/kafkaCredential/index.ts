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
		`/kafka/cluster/${clusterId}/credentials`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const credentialName = this.getNodeParameter('credentialName', index) as string;
	const topic = this.getNodeParameter('topic', index) as string;
	const permissions = this.getNodeParameter('permissions', index) as string;

	const body: IDataObject = {
		credential_name: credentialName,
		topic,
		permissions,
	};

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/credential`,
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteCredential(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const credentialId = this.getNodeParameter('credentialId', index) as string;

	await upstashManagementApiRequest.call(
		this,
		'DELETE',
		`/kafka/cluster/${clusterId}/credential/${credentialId}`,
	);

	return this.helpers.returnJsonArray({ success: true, clusterId, credentialId });
}
