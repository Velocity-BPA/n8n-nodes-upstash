/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashManagementApiRequest.call(this, 'GET', '/teams');

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const teamId = this.getNodeParameter('teamId', index) as string;

	const response = await upstashManagementApiRequest.call(this, 'GET', `/team/${teamId}`);

	return this.helpers.returnJsonArray(response);
}

export async function listMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamId = this.getNodeParameter('teamId', index) as string;

	const response = await upstashManagementApiRequest.call(this, 'GET', `/team/${teamId}/members`);

	return this.helpers.returnJsonArray(response);
}

export async function addMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamId = this.getNodeParameter('teamId', index) as string;
	const email = this.getNodeParameter('email', index) as string;
	const role = this.getNodeParameter('role', index) as string;

	const body: IDataObject = {
		email,
		role,
	};

	const response = await upstashManagementApiRequest.call(
		this,
		'POST',
		`/team/${teamId}/member`,
		body,
	);

	return this.helpers.returnJsonArray(response);
}

export async function removeMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamId = this.getNodeParameter('teamId', index) as string;
	const email = this.getNodeParameter('email', index) as string;

	await upstashManagementApiRequest.call(this, 'DELETE', `/team/${teamId}/member/${email}`);

	return this.helpers.returnJsonArray({ success: true, teamId, email });
}
