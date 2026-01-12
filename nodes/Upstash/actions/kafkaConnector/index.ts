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
		`/kafka/cluster/${clusterId}/connectors`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const connectorClass = this.getNodeParameter('connectorClass', index) as string;
	const properties = this.getNodeParameter('properties', index, {}) as IDataObject;

	const body: IDataObject = {
		name,
		properties: {
			'connector.class': connectorClass,
			...properties,
		},
	};

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/connector`,
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const connectorId = this.getNodeParameter('connectorId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/kafka/cluster/${clusterId}/connector/${connectorId}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteConnector(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const connectorId = this.getNodeParameter('connectorId', index) as string;

	await upstashManagementApiRequest.call(
		this,
		'DELETE',
		`/kafka/cluster/${clusterId}/connector/${connectorId}`,
	);

	return this.helpers.returnJsonArray({ success: true, clusterId, connectorId });
}

export async function reconfigure(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const connectorId = this.getNodeParameter('connectorId', index) as string;
	const properties = this.getNodeParameter('properties', index, {}) as IDataObject;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/connector/${connectorId}/reconfigure`,
		{ properties },
	);

	return this.helpers.returnJsonArray(response);
}

export async function restart(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clusterId = this.getNodeParameter('clusterId', index) as string;
	const connectorId = this.getNodeParameter('connectorId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/kafka/cluster/${clusterId}/connector/${connectorId}/restart`,
	);

	return this.helpers.returnJsonArray(response);
}
