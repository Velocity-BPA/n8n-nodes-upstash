/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { upstashManagementApiRequest, upstashVectorApiRequest } from '../../transport/GenericFunctions';

export async function list(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashManagementApiRequest.call(this, 'GET', '/vector/indexes');

	return this.helpers.returnJsonArray(response);
}

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const indexName = this.getNodeParameter('indexName', index) as string;
	const dimension = this.getNodeParameter('dimension', index) as number;
	const metric = this.getNodeParameter('metric', index, 'COSINE') as string;
	const region = this.getNodeParameter('region', index) as string;

	const body: IDataObject = {
		name: indexName,
		dimension,
		similarity_function: metric,
		region,
	};

	const response = await upstashManagementApiRequest.call(this, 'POST', '/vector/index', body);

	return this.helpers.returnJsonArray(response);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const indexName = this.getNodeParameter('indexName', index) as string;

	const response = await upstashManagementApiRequest.call(
		this,
		'GET',
		`/vector/index/${indexName}`,
	);

	return this.helpers.returnJsonArray(response);
}

export async function deleteIndex(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const indexName = this.getNodeParameter('indexName', index) as string;

	await upstashManagementApiRequest.call(this, 'DELETE', `/vector/index/${indexName}`);

	return this.helpers.returnJsonArray({ success: true, indexName });
}

export async function getStats(
	this: IExecuteFunctions,
	_index: number,
): Promise<INodeExecutionData[]> {
	const response = await upstashVectorApiRequest.call(this, 'GET', '/info');

	return this.helpers.returnJsonArray(response);
}

export async function upsert(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const vectors = this.getNodeParameter('vectors.vector', index, []) as Array<{
		id: string;
		vector: string;
		metadata?: IDataObject;
	}>;

	const vectorData = vectors.map((v) => ({
		id: v.id,
		vector: v.vector.split(',').map((n) => parseFloat(n.trim())),
		metadata: v.metadata || {},
	}));

	const response = await upstashVectorApiRequest.call(this, 'POST', '/upsert', vectorData);

	return this.helpers.returnJsonArray({ success: true, upserted: vectors.length, response });
}

export async function query(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const vectorInput = this.getNodeParameter('vector', index) as string;
	const topK = this.getNodeParameter('topK', index, 10) as number;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const vector = vectorInput.split(',').map((n) => parseFloat(n.trim()));

	const body: IDataObject = {
		vector,
		topK,
	};

	if (options.includeMetadata) {
		body.includeMetadata = true;
	}
	if (options.includeVectors) {
		body.includeVectors = true;
	}
	if (options.filter) {
		try {
			body.filter = JSON.parse(options.filter as string);
		} catch {
			body.filter = options.filter;
		}
	}

	const response = await upstashVectorApiRequest.call(this, 'POST', '/query', body);

	return this.helpers.returnJsonArray(response);
}

export async function deleteVectors(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const idsInput = this.getNodeParameter('ids', index) as string;
	const ids = idsInput.split(',').map((id) => id.trim());

	const response = await upstashVectorApiRequest.call(this, 'POST', '/delete', { ids });

	return this.helpers.returnJsonArray({ success: true, deleted: ids, response });
}

export async function fetch(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const idsInput = this.getNodeParameter('ids', index) as string;
	const ids = idsInput.split(',').map((id) => id.trim());
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const body: IDataObject = { ids };

	if (options.includeMetadata) {
		body.includeMetadata = true;
	}
	if (options.includeVectors) {
		body.includeVectors = true;
	}

	const response = await upstashVectorApiRequest.call(this, 'POST', '/fetch', body);

	return this.helpers.returnJsonArray(response);
}

export async function reset(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = await upstashVectorApiRequest.call(this, 'POST', '/reset');

	return this.helpers.returnJsonArray({ success: true, response });
}
