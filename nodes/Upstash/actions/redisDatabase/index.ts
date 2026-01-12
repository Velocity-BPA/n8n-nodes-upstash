/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashManagementApiRequest.call(this, 'GET', '/redis/databases');

	return this.helpers.returnJsonArray(response);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const region = this.getNodeParameter('region', index) as string;
	const tls = this.getNodeParameter('tls', index, true) as boolean;

	const body: IDataObject = {
		name,
		region,
		tls,
	};

	const response = await upstashManagementApiRequest.call(this, 'POST', '/redis/database', body);

	return this.helpers.returnJsonArray(response);
}

export async function createGlobal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const primaryRegion = this.getNodeParameter('primaryRegion', index) as string;
	const readRegions = this.getNodeParameter('readRegions', index) as string[];
	const tls = this.getNodeParameter('tls', index, true) as boolean;

	const body: IDataObject = {
		name,
		primary_region: primaryRegion,
		read_regions: readRegions,
		tls,
	};

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		'/redis/database/global',
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/redis/database/${databaseId}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteDatabase(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;

	await upstashManagementApiRequest.call(this, 'DELETE', `/redis/database/${databaseId}`);

	return this.helpers.returnJsonArray({ success: true, databaseId });
}

export async function rename(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;
	const name = this.getNodeParameter('newName', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/rename/${name}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function resetPassword(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/reset-password`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function enableTls(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/enable-tls`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function setEviction(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;
	const eviction = this.getNodeParameter('eviction', index) as boolean;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/set-eviction`,
		{ eviction },
	);

	return this.helpers.returnJsonArray(response);
}

export async function setAutoScaling(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;
	const autoScale = this.getNodeParameter('autoScale', index) as boolean;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/autoscale`,
		{ autoscale: autoScale },
	);

	return this.helpers.returnJsonArray(response);
}

export async function moveToTeam(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;
	const teamId = this.getNodeParameter('teamId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/move-to-team/${teamId}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function getStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/redis/database/${databaseId}/stats`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function updateRegions(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const databaseId = this.getNodeParameter('databaseId', index) as string;
	const readRegions = this.getNodeParameter('readRegions', index) as string[];

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/redis/database/${databaseId}/regions`,
		{ read_regions: readRegions },
	);

	return this.helpers.returnJsonArray(response);
}
