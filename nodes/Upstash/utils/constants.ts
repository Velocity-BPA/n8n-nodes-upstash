/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodePropertyOptions } from 'n8n-workflow';

export const UPSTASH_REGIONS: INodePropertyOptions[] = [
	{ name: 'US East 1 (N. Virginia)', value: 'us-east-1' },
	{ name: 'US West 1 (N. California)', value: 'us-west-1' },
	{ name: 'US West 2 (Oregon)', value: 'us-west-2' },
	{ name: 'EU West 1 (Ireland)', value: 'eu-west-1' },
	{ name: 'EU Central 1 (Frankfurt)', value: 'eu-central-1' },
	{ name: 'AP Southeast 1 (Singapore)', value: 'ap-southeast-1' },
	{ name: 'AP Southeast 2 (Sydney)', value: 'ap-southeast-2' },
	{ name: 'AP Northeast 1 (Tokyo)', value: 'ap-northeast-1' },
	{ name: 'SA East 1 (São Paulo)', value: 'sa-east-1' },
];

export const KAFKA_REGIONS: INodePropertyOptions[] = [
	{ name: 'US East 1 (N. Virginia)', value: 'us-east-1' },
	{ name: 'EU West 1 (Ireland)', value: 'eu-west-1' },
	{ name: 'AP Southeast 1 (Singapore)', value: 'ap-southeast-1' },
];

export const VECTOR_METRICS: INodePropertyOptions[] = [
	{ name: 'Cosine Similarity', value: 'COSINE' },
	{ name: 'Euclidean Distance', value: 'EUCLIDEAN' },
	{ name: 'Dot Product', value: 'DOT_PRODUCT' },
];

export const KAFKA_CLEANUP_POLICIES: INodePropertyOptions[] = [
	{ name: 'Delete', value: 'delete' },
	{ name: 'Compact', value: 'compact' },
];

export const KAFKA_PERMISSIONS: INodePropertyOptions[] = [
	{ name: 'All', value: 'ALL' },
	{ name: 'Produce Only', value: 'PRODUCE' },
	{ name: 'Consume Only', value: 'CONSUME' },
];

export const TEAM_ROLES: INodePropertyOptions[] = [
	{ name: 'Admin', value: 'admin' },
	{ name: 'Developer', value: 'dev' },
	{ name: 'Finance', value: 'finance' },
];

export const HTTP_METHODS: INodePropertyOptions[] = [
	{ name: 'GET', value: 'GET' },
	{ name: 'POST', value: 'POST' },
	{ name: 'PUT', value: 'PUT' },
	{ name: 'DELETE', value: 'DELETE' },
	{ name: 'PATCH', value: 'PATCH' },
];

export const LICENSING_NOTICE = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;
