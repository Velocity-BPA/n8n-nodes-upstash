/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as redisDatabase from './actions/redisDatabase';
import * as redisData from './actions/redisData';
import * as kafkaCluster from './actions/kafkaCluster';
import * as kafkaTopic from './actions/kafkaTopic';
import * as kafkaCredential from './actions/kafkaCredential';
import * as kafkaConnector from './actions/kafkaConnector';
import * as qstashMessage from './actions/qstashMessage';
import * as qstashSchedule from './actions/qstashSchedule';
import * as qstashDlq from './actions/qstashDlq';
import * as vectorIndex from './actions/vectorIndex';
import * as team from './actions/team';
import * as usage from './actions/usage';

import { UPSTASH_REGIONS, KAFKA_REGIONS, VECTOR_METRICS, KAFKA_CLEANUP_POLICIES, KAFKA_PERMISSIONS, TEAM_ROLES, HTTP_METHODS, LICENSING_NOTICE } from './utils/constants';

export class Upstash implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Upstash',
		name: 'upstash',
		icon: 'file:upstash.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with Upstash Redis, Kafka, QStash, and Vector databases',
		defaults: {
			name: 'Upstash',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'upstashApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Kafka Cluster', value: 'kafkaCluster' },
					{ name: 'Kafka Connector', value: 'kafkaConnector' },
					{ name: 'Kafka Credential', value: 'kafkaCredential' },
					{ name: 'Kafka Topic', value: 'kafkaTopic' },
					{ name: 'QStash Dead Letter Queue', value: 'qstashDlq' },
					{ name: 'QStash Message', value: 'qstashMessage' },
					{ name: 'QStash Schedule', value: 'qstashSchedule' },
					{ name: 'Redis Data', value: 'redisData' },
					{ name: 'Redis Database', value: 'redisDatabase' },
					{ name: 'Team', value: 'team' },
					{ name: 'Usage & Billing', value: 'usage' },
					{ name: 'Vector Index', value: 'vectorIndex' },
				],
				default: 'redisDatabase',
			},

			// Redis Database Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['redisDatabase'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new Redis database', action: 'Create a redis database' },
					{ name: 'Create Global', value: 'createGlobal', description: 'Create a global (multi-region) database', action: 'Create a global redis database' },
					{ name: 'Delete', value: 'delete', description: 'Delete a database', action: 'Delete a redis database' },
					{ name: 'Enable TLS', value: 'enableTls', description: 'Enable TLS encryption', action: 'Enable TLS on a redis database' },
					{ name: 'Get', value: 'get', description: 'Get database details', action: 'Get a redis database' },
					{ name: 'Get Stats', value: 'getStats', description: 'Get database statistics', action: 'Get redis database stats' },
					{ name: 'List', value: 'list', description: 'List all Redis databases', action: 'List redis databases' },
					{ name: 'Move to Team', value: 'moveToTeam', description: 'Move database to a team', action: 'Move redis database to team' },
					{ name: 'Rename', value: 'rename', description: 'Rename a database', action: 'Rename a redis database' },
					{ name: 'Reset Password', value: 'resetPassword', description: 'Reset database password', action: 'Reset redis database password' },
					{ name: 'Set Auto-Scaling', value: 'setAutoScaling', description: 'Enable/disable auto-scaling', action: 'Set redis database auto scaling' },
					{ name: 'Set Eviction', value: 'setEviction', description: 'Enable/disable eviction', action: 'Set redis database eviction' },
					{ name: 'Update Regions', value: 'updateRegions', description: 'Update regions for global database', action: 'Update redis database regions' },
				],
				default: 'list',
			},

			// Redis Data Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['redisData'] } },
				options: [
					{ name: 'Decr', value: 'decr', description: 'Decrement numeric value', action: 'Decrement a value' },
					{ name: 'Decrby', value: 'decrby', description: 'Decrement by specific amount', action: 'Decrement by amount' },
					{ name: 'Del', value: 'del', description: 'Delete a key', action: 'Delete a key' },
					{ name: 'Execute Command', value: 'executeCommand', description: 'Execute arbitrary Redis command', action: 'Execute redis command' },
					{ name: 'Exists', value: 'exists', description: 'Check if key exists', action: 'Check if key exists' },
					{ name: 'Expire', value: 'expire', description: 'Set key expiration', action: 'Set key expiration' },
					{ name: 'Get', value: 'get', description: 'Get value by key', action: 'Get a value' },
					{ name: 'Hash Del', value: 'hdel', description: 'Delete hash field', action: 'Delete hash field' },
					{ name: 'Hash Get', value: 'hget', description: 'Get hash field', action: 'Get hash field' },
					{ name: 'Hash Get All', value: 'hgetall', description: 'Get all hash fields', action: 'Get all hash fields' },
					{ name: 'Hash Set', value: 'hset', description: 'Set hash field', action: 'Set hash field' },
					{ name: 'Incr', value: 'incr', description: 'Increment numeric value', action: 'Increment a value' },
					{ name: 'Incrby', value: 'incrby', description: 'Increment by specific amount', action: 'Increment by amount' },
					{ name: 'Keys', value: 'keys', description: 'Get keys matching pattern', action: 'Get keys by pattern' },
					{ name: 'List Pop Left', value: 'lpop', description: 'Pop from list (left)', action: 'Pop from list left' },
					{ name: 'List Push Left', value: 'lpush', description: 'Push to list (left)', action: 'Push to list left' },
					{ name: 'List Range', value: 'lrange', description: 'Get list range', action: 'Get list range' },
					{ name: 'List Pop Right', value: 'rpop', description: 'Pop from list (right)', action: 'Pop from list right' },
					{ name: 'List Push Right', value: 'rpush', description: 'Push to list (right)', action: 'Push to list right' },
					{ name: 'MGet', value: 'mget', description: 'Get multiple values', action: 'Get multiple values' },
					{ name: 'MSet', value: 'mset', description: 'Set multiple key-value pairs', action: 'Set multiple values' },
					{ name: 'Publish', value: 'publish', description: 'Publish to channel', action: 'Publish to channel' },
					{ name: 'Rename', value: 'rename', description: 'Rename a key', action: 'Rename a key' },
					{ name: 'Scan', value: 'scan', description: 'Iterate through keys', action: 'Scan keys' },
					{ name: 'Set', value: 'set', description: 'Set a key-value pair', action: 'Set a value' },
					{ name: 'Set Add', value: 'sadd', description: 'Add to set', action: 'Add to set' },
					{ name: 'Set Members', value: 'smembers', description: 'Get set members', action: 'Get set members' },
					{ name: 'Set Remove', value: 'srem', description: 'Remove from set', action: 'Remove from set' },
					{ name: 'Sorted Set Add', value: 'zadd', description: 'Add to sorted set', action: 'Add to sorted set' },
					{ name: 'Sorted Set Range', value: 'zrange', description: 'Get sorted set range', action: 'Get sorted set range' },
					{ name: 'Sorted Set Remove', value: 'zrem', description: 'Remove from sorted set', action: 'Remove from sorted set' },
					{ name: 'TTL', value: 'ttl', description: 'Get time-to-live for key', action: 'Get key TTL' },
					{ name: 'Type', value: 'type', description: 'Get data type of key', action: 'Get key type' },
				],
				default: 'get',
			},

			// Kafka Cluster Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['kafkaCluster'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new Kafka cluster', action: 'Create a kafka cluster' },
					{ name: 'Delete', value: 'delete', description: 'Delete a cluster', action: 'Delete a kafka cluster' },
					{ name: 'Get', value: 'get', description: 'Get cluster details', action: 'Get a kafka cluster' },
					{ name: 'Get Stats', value: 'getStats', description: 'Get cluster statistics', action: 'Get kafka cluster stats' },
					{ name: 'List', value: 'list', description: 'List all Kafka clusters', action: 'List kafka clusters' },
					{ name: 'Rename', value: 'rename', description: 'Rename a cluster', action: 'Rename a kafka cluster' },
					{ name: 'Reset Password', value: 'resetPassword', description: 'Reset cluster password', action: 'Reset kafka cluster password' },
				],
				default: 'list',
			},

			// Kafka Topic Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['kafkaTopic'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new topic', action: 'Create a kafka topic' },
					{ name: 'Delete', value: 'delete', description: 'Delete a topic', action: 'Delete a kafka topic' },
					{ name: 'Get', value: 'get', description: 'Get topic details', action: 'Get a kafka topic' },
					{ name: 'Get Stats', value: 'getStats', description: 'Get topic statistics', action: 'Get kafka topic stats' },
					{ name: 'List', value: 'list', description: 'List topics in a cluster', action: 'List kafka topics' },
					{ name: 'Reconfigure', value: 'reconfigure', description: 'Update topic configuration', action: 'Reconfigure kafka topic' },
				],
				default: 'list',
			},

			// Kafka Credential Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['kafkaCredential'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create new credentials', action: 'Create kafka credentials' },
					{ name: 'Delete', value: 'delete', description: 'Delete credentials', action: 'Delete kafka credentials' },
					{ name: 'List', value: 'list', description: 'List credentials for a cluster', action: 'List kafka credentials' },
				],
				default: 'list',
			},

			// Kafka Connector Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['kafkaConnector'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new connector', action: 'Create kafka connector' },
					{ name: 'Delete', value: 'delete', description: 'Delete a connector', action: 'Delete kafka connector' },
					{ name: 'Get', value: 'get', description: 'Get connector details', action: 'Get kafka connector' },
					{ name: 'List', value: 'list', description: 'List connectors in a cluster', action: 'List kafka connectors' },
					{ name: 'Reconfigure', value: 'reconfigure', description: 'Update connector configuration', action: 'Reconfigure kafka connector' },
					{ name: 'Restart', value: 'restart', description: 'Restart a connector', action: 'Restart kafka connector' },
				],
				default: 'list',
			},

			// QStash Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['qstashMessage'] } },
				options: [
					{ name: 'Cancel', value: 'cancel', description: 'Cancel a scheduled message', action: 'Cancel qstash message' },
					{ name: 'Delete', value: 'delete', description: 'Delete a scheduled message', action: 'Delete qstash message' },
					{ name: 'Get', value: 'get', description: 'Get message details', action: 'Get qstash message' },
					{ name: 'Publish', value: 'publish', description: 'Publish a message to a URL', action: 'Publish qstash message' },
					{ name: 'Publish Batch', value: 'publishBatch', description: 'Publish multiple messages', action: 'Publish batch qstash messages' },
				],
				default: 'publish',
			},

			// QStash Schedule Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['qstashSchedule'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new schedule', action: 'Create qstash schedule' },
					{ name: 'Delete', value: 'delete', description: 'Delete a schedule', action: 'Delete qstash schedule' },
					{ name: 'Get', value: 'get', description: 'Get schedule details', action: 'Get qstash schedule' },
					{ name: 'List', value: 'list', description: 'List all schedules', action: 'List qstash schedules' },
					{ name: 'Pause', value: 'pause', description: 'Pause a schedule', action: 'Pause qstash schedule' },
					{ name: 'Resume', value: 'resume', description: 'Resume a schedule', action: 'Resume qstash schedule' },
				],
				default: 'list',
			},

			// QStash DLQ Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['qstashDlq'] } },
				options: [
					{ name: 'Delete', value: 'delete', description: 'Delete message from DLQ', action: 'Delete dlq message' },
					{ name: 'List', value: 'list', description: 'List messages in DLQ', action: 'List dlq messages' },
					{ name: 'Retry', value: 'retry', description: 'Retry message from DLQ', action: 'Retry dlq message' },
				],
				default: 'list',
			},

			// Vector Index Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['vectorIndex'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new index', action: 'Create vector index' },
					{ name: 'Delete', value: 'delete', description: 'Delete an index', action: 'Delete vector index' },
					{ name: 'Delete Vectors', value: 'deleteVectors', description: 'Delete vectors by ID', action: 'Delete vectors' },
					{ name: 'Fetch', value: 'fetch', description: 'Fetch vectors by ID', action: 'Fetch vectors' },
					{ name: 'Get', value: 'get', description: 'Get index details', action: 'Get vector index' },
					{ name: 'Get Stats', value: 'getStats', description: 'Get index statistics', action: 'Get vector index stats' },
					{ name: 'List', value: 'list', description: 'List all vector indexes', action: 'List vector indexes' },
					{ name: 'Query', value: 'query', description: 'Query similar vectors', action: 'Query vectors' },
					{ name: 'Reset', value: 'reset', description: 'Reset (clear) index', action: 'Reset vector index' },
					{ name: 'Upsert', value: 'upsert', description: 'Insert or update vectors', action: 'Upsert vectors' },
				],
				default: 'list',
			},

			// Team Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['team'] } },
				options: [
					{ name: 'Add Member', value: 'addMember', description: 'Add member to team', action: 'Add team member' },
					{ name: 'Get', value: 'get', description: 'Get team details', action: 'Get team' },
					{ name: 'List', value: 'list', description: 'List teams', action: 'List teams' },
					{ name: 'List Members', value: 'listMembers', description: 'List team members', action: 'List team members' },
					{ name: 'Remove Member', value: 'removeMember', description: 'Remove member from team', action: 'Remove team member' },
				],
				default: 'list',
			},

			// Usage Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['usage'] } },
				options: [
					{ name: 'Get Billing', value: 'getBilling', description: 'Get billing information', action: 'Get billing info' },
					{ name: 'Get Daily Stats', value: 'getDailyStats', description: 'Get daily usage statistics', action: 'Get daily stats' },
					{ name: 'Get Monthly Stats', value: 'getMonthlyStats', description: 'Get monthly usage statistics', action: 'Get monthly stats' },
				],
				default: 'getDailyStats',
			},

			// ============ FIELD DEFINITIONS ============

			// Database ID field (used by multiple resources)
			{
				displayName: 'Database ID',
				name: 'databaseId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the Redis database',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['get', 'delete', 'rename', 'resetPassword', 'enableTls', 'setEviction', 'setAutoScaling', 'moveToTeam', 'getStats', 'updateRegions'],
					},
				},
			},

			// Name field (for create operations)
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name for the database',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['create', 'createGlobal'],
					},
				},
			},

			// Region field
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: UPSTASH_REGIONS,
				required: true,
				default: 'us-east-1',
				description: 'Region for the database',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['create'],
					},
				},
			},

			// TLS field
			{
				displayName: 'Enable TLS',
				name: 'tls',
				type: 'boolean',
				default: true,
				description: 'Whether to enable TLS encryption',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['create', 'createGlobal'],
					},
				},
			},

			// Primary Region (for global database)
			{
				displayName: 'Primary Region',
				name: 'primaryRegion',
				type: 'options',
				options: UPSTASH_REGIONS,
				required: true,
				default: 'us-east-1',
				description: 'Primary region for the global database',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['createGlobal'],
					},
				},
			},

			// Read Regions (for global database)
			{
				displayName: 'Read Regions',
				name: 'readRegions',
				type: 'multiOptions',
				options: UPSTASH_REGIONS,
				required: true,
				default: [],
				description: 'Read replica regions for the global database',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['createGlobal', 'updateRegions'],
					},
				},
			},

			// New Name (for rename)
			{
				displayName: 'New Name',
				name: 'newName',
				type: 'string',
				required: true,
				default: '',
				description: 'New name for the database',
				displayOptions: {
					show: {
						resource: ['redisDatabase', 'kafkaCluster'],
						operation: ['rename'],
					},
				},
			},

			// Eviction setting
			{
				displayName: 'Enable Eviction',
				name: 'eviction',
				type: 'boolean',
				default: false,
				description: 'Whether to enable eviction when memory is full',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['setEviction'],
					},
				},
			},

			// Auto-scaling setting
			{
				displayName: 'Enable Auto-Scaling',
				name: 'autoScale',
				type: 'boolean',
				default: false,
				description: 'Whether to enable auto-scaling',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['setAutoScaling'],
					},
				},
			},

			// Team ID
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the team',
				displayOptions: {
					show: {
						resource: ['redisDatabase'],
						operation: ['moveToTeam'],
					},
				},
			},

			// ============ REDIS DATA FIELDS ============

			// Key field
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				required: true,
				default: '',
				description: 'The Redis key',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['set', 'get', 'del', 'incr', 'decr', 'incrby', 'decrby', 'expire', 'ttl', 'exists', 'type', 'rename', 'lpush', 'rpush', 'lpop', 'rpop', 'lrange', 'sadd', 'smembers', 'srem', 'hset', 'hget', 'hgetall', 'hdel', 'zadd', 'zrange', 'zrem'],
					},
				},
			},

			// Value field
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				required: true,
				default: '',
				description: 'The value to set',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['set', 'hset'],
					},
				},
			},

			// Options for SET operation
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['set'],
					},
				},
				options: [
					{
						displayName: 'TTL (Seconds)',
						name: 'ttl',
						type: 'number',
						default: 0,
						description: 'Time-to-live in seconds',
					},
					{
						displayName: 'Only If Not Exists (NX)',
						name: 'nx',
						type: 'boolean',
						default: false,
						description: 'Whether to only set the key if it does not exist',
					},
					{
						displayName: 'Only If Exists (XX)',
						name: 'xx',
						type: 'boolean',
						default: false,
						description: 'Whether to only set the key if it already exists',
					},
				],
			},

			// Keys field (for MGET)
			{
				displayName: 'Keys',
				name: 'keys',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of keys to get',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['mget'],
					},
				},
			},

			// Pairs field (for MSET)
			{
				displayName: 'Key-Value Pairs',
				name: 'pairs',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['mset'],
					},
				},
				options: [
					{
						name: 'pair',
						displayName: 'Pair',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},

			// Amount field (for INCRBY/DECRBY)
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 1,
				description: 'Amount to increment/decrement by',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['incrby', 'decrby'],
					},
				},
			},

			// Seconds field (for EXPIRE)
			{
				displayName: 'Seconds',
				name: 'seconds',
				type: 'number',
				required: true,
				default: 60,
				description: 'TTL in seconds',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['expire'],
					},
				},
			},

			// Pattern field (for KEYS)
			{
				displayName: 'Pattern',
				name: 'pattern',
				type: 'string',
				required: true,
				default: '*',
				description: 'Pattern to match keys (e.g., user:*, *:session)',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['keys'],
					},
				},
			},

			// Cursor field (for SCAN)
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'number',
				default: 0,
				description: 'Cursor position (0 to start)',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['scan'],
					},
				},
			},

			// Scan options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['scan'],
					},
				},
				options: [
					{
						displayName: 'Pattern',
						name: 'pattern',
						type: 'string',
						default: '*',
						description: 'Pattern to match',
					},
					{
						displayName: 'Count',
						name: 'count',
						type: 'number',
						default: 10,
						description: 'Hint for number of elements to return',
					},
				],
			},

			// New Key (for RENAME)
			{
				displayName: 'New Key',
				name: 'newKey',
				type: 'string',
				required: true,
				default: '',
				description: 'New key name',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['rename'],
					},
				},
			},

			// Values field (for LPUSH, RPUSH)
			{
				displayName: 'Values',
				name: 'values',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated values to push',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['lpush', 'rpush'],
					},
				},
			},

			// Count field (for LPOP, RPOP)
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 1,
				description: 'Number of elements to pop',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['lpop', 'rpop'],
					},
				},
			},

			// Start/Stop fields (for LRANGE, ZRANGE)
			{
				displayName: 'Start',
				name: 'start',
				type: 'number',
				required: true,
				default: 0,
				description: 'Start index',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['lrange', 'zrange'],
					},
				},
			},
			{
				displayName: 'Stop',
				name: 'stop',
				type: 'number',
				required: true,
				default: -1,
				description: 'Stop index (-1 for end)',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['lrange', 'zrange'],
					},
				},
			},

			// Members field (for SADD, SREM, ZREM)
			{
				displayName: 'Members',
				name: 'members',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated members',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['sadd', 'srem', 'zrem'],
					},
				},
			},

			// Hash field
			{
				displayName: 'Field',
				name: 'field',
				type: 'string',
				required: true,
				default: '',
				description: 'Hash field name',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['hset', 'hget'],
					},
				},
			},

			// Fields (for HDEL)
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated field names to delete',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['hdel'],
					},
				},
			},

			// Score/Member (for ZADD)
			{
				displayName: 'Score',
				name: 'score',
				type: 'number',
				required: true,
				default: 0,
				description: 'Score for the member',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['zadd'],
					},
				},
			},
			{
				displayName: 'Member',
				name: 'member',
				type: 'string',
				required: true,
				default: '',
				description: 'Member to add',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['zadd'],
					},
				},
			},

			// With Scores (for ZRANGE)
			{
				displayName: 'With Scores',
				name: 'withScores',
				type: 'boolean',
				default: false,
				description: 'Whether to include scores in results',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['zrange'],
					},
				},
			},

			// Channel/Message (for PUBLISH)
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				default: '',
				description: 'Channel to publish to',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['publish'],
					},
				},
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				default: '',
				description: 'Message to publish',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['publish'],
					},
				},
			},

			// Execute Command
			{
				displayName: 'Command',
				name: 'command',
				type: 'string',
				required: true,
				default: '',
				description: 'Redis command to execute (e.g., "GET mykey" or "SET foo bar")',
				displayOptions: {
					show: {
						resource: ['redisData'],
						operation: ['executeCommand'],
					},
				},
			},

			// ============ KAFKA FIELDS ============

			// Cluster ID
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the Kafka cluster',
				displayOptions: {
					show: {
						resource: ['kafkaCluster'],
						operation: ['get', 'delete', 'rename', 'resetPassword', 'getStats'],
					},
				},
			},
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the Kafka cluster',
				displayOptions: {
					show: {
						resource: ['kafkaTopic', 'kafkaCredential', 'kafkaConnector'],
					},
				},
			},

			// Kafka Cluster Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name for the cluster',
				displayOptions: {
					show: {
						resource: ['kafkaCluster'],
						operation: ['create'],
					},
				},
			},

			// Kafka Region
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: KAFKA_REGIONS,
				required: true,
				default: 'us-east-1',
				description: 'Region for the cluster',
				displayOptions: {
					show: {
						resource: ['kafkaCluster'],
						operation: ['create'],
					},
				},
			},

			// Multizone
			{
				displayName: 'Multi-Zone',
				name: 'multizone',
				type: 'boolean',
				default: false,
				description: 'Whether to enable multi-zone deployment',
				displayOptions: {
					show: {
						resource: ['kafkaCluster'],
						operation: ['create'],
					},
				},
			},

			// Topic Name
			{
				displayName: 'Topic Name',
				name: 'topicName',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the topic',
				displayOptions: {
					show: {
						resource: ['kafkaTopic'],
						operation: ['create', 'get', 'delete', 'reconfigure', 'getStats'],
					},
				},
			},

			// Partitions
			{
				displayName: 'Partitions',
				name: 'partitions',
				type: 'number',
				default: 1,
				description: 'Number of partitions',
				displayOptions: {
					show: {
						resource: ['kafkaTopic'],
						operation: ['create'],
					},
				},
			},

			// Topic options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['kafkaTopic'],
						operation: ['create', 'reconfigure'],
					},
				},
				options: [
					{
						displayName: 'Retention Time (ms)',
						name: 'retentionTime',
						type: 'number',
						default: 604800000,
						description: 'Retention time in milliseconds',
					},
					{
						displayName: 'Retention Size (bytes)',
						name: 'retentionSize',
						type: 'number',
						default: 268435456,
						description: 'Retention size in bytes',
					},
					{
						displayName: 'Max Message Size (bytes)',
						name: 'maxMessageSize',
						type: 'number',
						default: 1048576,
						description: 'Maximum message size in bytes',
					},
					{
						displayName: 'Cleanup Policy',
						name: 'cleanupPolicy',
						type: 'options',
						options: KAFKA_CLEANUP_POLICIES,
						default: 'delete',
						description: 'Cleanup policy for the topic',
					},
				],
			},

			// Credential Name
			{
				displayName: 'Credential Name',
				name: 'credentialName',
				type: 'string',
				required: true,
				default: '',
				description: 'Name for the credential',
				displayOptions: {
					show: {
						resource: ['kafkaCredential'],
						operation: ['create'],
					},
				},
			},

			// Topic (for credential)
			{
				displayName: 'Topic',
				name: 'topic',
				type: 'string',
				required: true,
				default: '*',
				description: 'Topic to scope the credential to (* for all)',
				displayOptions: {
					show: {
						resource: ['kafkaCredential'],
						operation: ['create'],
					},
				},
			},

			// Permissions
			{
				displayName: 'Permissions',
				name: 'permissions',
				type: 'options',
				options: KAFKA_PERMISSIONS,
				required: true,
				default: 'ALL',
				description: 'Permission level for the credential',
				displayOptions: {
					show: {
						resource: ['kafkaCredential'],
						operation: ['create'],
					},
				},
			},

			// Credential ID
			{
				displayName: 'Credential ID',
				name: 'credentialId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the credential',
				displayOptions: {
					show: {
						resource: ['kafkaCredential'],
						operation: ['delete'],
					},
				},
			},

			// Connector Name
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name for the connector',
				displayOptions: {
					show: {
						resource: ['kafkaConnector'],
						operation: ['create'],
					},
				},
			},

			// Connector Class
			{
				displayName: 'Connector Class',
				name: 'connectorClass',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g., io.debezium.connector.mysql.MySqlConnector',
				description: 'Fully qualified connector class name',
				displayOptions: {
					show: {
						resource: ['kafkaConnector'],
						operation: ['create'],
					},
				},
			},

			// Connector Properties
			{
				displayName: 'Properties',
				name: 'properties',
				type: 'json',
				default: '{}',
				description: 'Connector configuration properties as JSON',
				displayOptions: {
					show: {
						resource: ['kafkaConnector'],
						operation: ['create', 'reconfigure'],
					},
				},
			},

			// Connector ID
			{
				displayName: 'Connector ID',
				name: 'connectorId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the connector',
				displayOptions: {
					show: {
						resource: ['kafkaConnector'],
						operation: ['get', 'delete', 'reconfigure', 'restart'],
					},
				},
			},

			// ============ QSTASH FIELDS ============

			// Destination
			{
				displayName: 'Destination URL',
				name: 'destination',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/webhook',
				description: 'Target URL for the message',
				displayOptions: {
					show: {
						resource: ['qstashMessage', 'qstashSchedule'],
						operation: ['publish', 'create'],
					},
				},
			},

			// Body
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Message payload (JSON)',
				displayOptions: {
					show: {
						resource: ['qstashMessage', 'qstashSchedule'],
						operation: ['publish', 'create'],
					},
				},
			},

			// Cron
			{
				displayName: 'Cron Expression',
				name: 'cron',
				type: 'string',
				required: true,
				default: '',
				placeholder: '0 0 * * *',
				description: 'Cron expression for the schedule',
				displayOptions: {
					show: {
						resource: ['qstashSchedule'],
						operation: ['create'],
					},
				},
			},

			// QStash Message options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['qstashMessage'],
						operation: ['publish'],
					},
				},
				options: [
					{
						displayName: 'Delay',
						name: 'delay',
						type: 'string',
						default: '',
						placeholder: '10s, 1m, 1h',
						description: 'Delay before delivery',
					},
					{
						displayName: 'Retries',
						name: 'retries',
						type: 'number',
						default: 3,
						description: 'Number of retries',
					},
					{
						displayName: 'Callback URL',
						name: 'callback',
						type: 'string',
						default: '',
						description: 'Callback URL after delivery',
					},
					{
						displayName: 'Failure Callback URL',
						name: 'failureCallback',
						type: 'string',
						default: '',
						description: 'Callback URL on failure',
					},
					{
						displayName: 'Deduplication ID',
						name: 'deduplicationId',
						type: 'string',
						default: '',
						description: 'Deduplication identifier',
					},
					{
						displayName: 'Content-Based Deduplication',
						name: 'contentBasedDeduplication',
						type: 'boolean',
						default: false,
						description: 'Whether to enable content-based deduplication',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'string',
						default: '',
						placeholder: '30s',
						description: 'Request timeout',
					},
					{
						displayName: 'HTTP Method',
						name: 'method',
						type: 'options',
						options: HTTP_METHODS,
						default: 'POST',
						description: 'HTTP method to use',
					},
				],
			},

			// QStash Schedule options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['qstashSchedule'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Retries',
						name: 'retries',
						type: 'number',
						default: 3,
						description: 'Number of retries',
					},
					{
						displayName: 'Callback URL',
						name: 'callback',
						type: 'string',
						default: '',
						description: 'Callback URL after delivery',
					},
					{
						displayName: 'Failure Callback URL',
						name: 'failureCallback',
						type: 'string',
						default: '',
						description: 'Callback URL on failure',
					},
					{
						displayName: 'HTTP Method',
						name: 'method',
						type: 'options',
						options: HTTP_METHODS,
						default: 'POST',
						description: 'HTTP method to use',
					},
				],
			},

			// Batch messages
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['qstashMessage'],
						operation: ['publishBatch'],
					},
				},
				options: [
					{
						name: 'message',
						displayName: 'Message',
						values: [
							{
								displayName: 'Destination URL',
								name: 'destination',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Body',
								name: 'body',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Delay',
								name: 'delay',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Retries',
								name: 'retries',
								type: 'number',
								default: 3,
							},
						],
					},
				],
			},

			// Message ID
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the message',
				displayOptions: {
					show: {
						resource: ['qstashMessage'],
						operation: ['get', 'delete', 'cancel'],
					},
				},
			},

			// Schedule ID
			{
				displayName: 'Schedule ID',
				name: 'scheduleId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the schedule',
				displayOptions: {
					show: {
						resource: ['qstashSchedule'],
						operation: ['get', 'delete', 'pause', 'resume'],
					},
				},
			},

			// DLQ ID
			{
				displayName: 'DLQ ID',
				name: 'dlqId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the DLQ entry',
				displayOptions: {
					show: {
						resource: ['qstashDlq'],
						operation: ['delete', 'retry'],
					},
				},
			},

			// ============ VECTOR FIELDS ============

			// Index Name
			{
				displayName: 'Index Name',
				name: 'indexName',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the vector index',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['create', 'get', 'delete'],
					},
				},
			},

			// Dimension
			{
				displayName: 'Dimension',
				name: 'dimension',
				type: 'number',
				required: true,
				default: 128,
				description: 'Number of dimensions for vectors',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['create'],
					},
				},
			},

			// Metric
			{
				displayName: 'Similarity Metric',
				name: 'metric',
				type: 'options',
				options: VECTOR_METRICS,
				default: 'COSINE',
				description: 'Similarity function to use',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['create'],
					},
				},
			},

			// Vector Region
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: UPSTASH_REGIONS,
				required: true,
				default: 'us-east-1',
				description: 'Region for the index',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['create'],
					},
				},
			},

			// Vectors (for upsert)
			{
				displayName: 'Vectors',
				name: 'vectors',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['upsert'],
					},
				},
				options: [
					{
						name: 'vector',
						displayName: 'Vector',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'Unique identifier for the vector',
							},
							{
								displayName: 'Vector Values',
								name: 'vector',
								type: 'string',
								default: '',
								placeholder: '0.1, 0.2, 0.3, ...',
								description: 'Comma-separated vector values',
							},
							{
								displayName: 'Metadata',
								name: 'metadata',
								type: 'json',
								default: '{}',
								description: 'Optional metadata as JSON',
							},
						],
					},
				],
			},

			// Query Vector
			{
				displayName: 'Query Vector',
				name: 'vector',
				type: 'string',
				required: true,
				default: '',
				placeholder: '0.1, 0.2, 0.3, ...',
				description: 'Comma-separated vector values for query',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['query'],
					},
				},
			},

			// Top K
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 10,
				description: 'Number of similar vectors to return',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['query'],
					},
				},
			},

			// Query options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['query', 'fetch'],
					},
				},
				options: [
					{
						displayName: 'Include Metadata',
						name: 'includeMetadata',
						type: 'boolean',
						default: true,
						description: 'Whether to include metadata in results',
					},
					{
						displayName: 'Include Vectors',
						name: 'includeVectors',
						type: 'boolean',
						default: false,
						description: 'Whether to include vectors in results',
					},
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'string',
						default: '',
						description: 'Metadata filter as JSON',
					},
				],
			},

			// IDs (for delete/fetch vectors)
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated vector IDs',
				displayOptions: {
					show: {
						resource: ['vectorIndex'],
						operation: ['deleteVectors', 'fetch'],
					},
				},
			},

			// ============ TEAM FIELDS ============

			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the team',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['get', 'listMembers', 'addMember', 'removeMember'],
					},
				},
			},

			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'name@example.com',
				description: 'Email address of the team member',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['addMember', 'removeMember'],
					},
				},
			},

			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: TEAM_ROLES,
				required: true,
				default: 'dev',
				description: 'Role for the team member',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['addMember'],
					},
				},
			},

			// ============ USAGE FIELDS ============

			{
				displayName: 'Resource Type',
				name: 'resourceType',
				type: 'options',
				options: [
					{ name: 'Redis', value: 'redis' },
					{ name: 'Kafka', value: 'kafka' },
					{ name: 'Vector', value: 'vector' },
				],
				required: true,
				default: 'redis',
				description: 'Type of resource to get stats for',
				displayOptions: {
					show: {
						resource: ['usage'],
						operation: ['getDailyStats', 'getMonthlyStats'],
					},
				},
			},

			{
				displayName: 'Resource ID',
				name: 'resourceId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the resource (database, cluster, or index)',
				displayOptions: {
					show: {
						resource: ['usage'],
						operation: ['getDailyStats', 'getMonthlyStats'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Log licensing notice once
		this.logger.warn(LICENSING_NOTICE);

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'redisDatabase':
						switch (operation) {
							case 'list':
								result = await redisDatabase.list.call(this);
								break;
							case 'create':
								result = await redisDatabase.create.call(this, i);
								break;
							case 'createGlobal':
								result = await redisDatabase.createGlobal.call(this, i);
								break;
							case 'get':
								result = await redisDatabase.get.call(this, i);
								break;
							case 'delete':
								result = await redisDatabase.deleteDatabase.call(this, i);
								break;
							case 'rename':
								result = await redisDatabase.rename.call(this, i);
								break;
							case 'resetPassword':
								result = await redisDatabase.resetPassword.call(this, i);
								break;
							case 'enableTls':
								result = await redisDatabase.enableTls.call(this, i);
								break;
							case 'setEviction':
								result = await redisDatabase.setEviction.call(this, i);
								break;
							case 'setAutoScaling':
								result = await redisDatabase.setAutoScaling.call(this, i);
								break;
							case 'moveToTeam':
								result = await redisDatabase.moveToTeam.call(this, i);
								break;
							case 'getStats':
								result = await redisDatabase.getStats.call(this, i);
								break;
							case 'updateRegions':
								result = await redisDatabase.updateRegions.call(this, i);
								break;
						}
						break;

					case 'redisData':
						switch (operation) {
							case 'set':
								result = await redisData.set.call(this, i);
								break;
							case 'get':
								result = await redisData.get.call(this, i);
								break;
							case 'del':
								result = await redisData.del.call(this, i);
								break;
							case 'mset':
								result = await redisData.mset.call(this, i);
								break;
							case 'mget':
								result = await redisData.mget.call(this, i);
								break;
							case 'incr':
								result = await redisData.incr.call(this, i);
								break;
							case 'decr':
								result = await redisData.decr.call(this, i);
								break;
							case 'incrby':
								result = await redisData.incrby.call(this, i);
								break;
							case 'decrby':
								result = await redisData.decrby.call(this, i);
								break;
							case 'expire':
								result = await redisData.expire.call(this, i);
								break;
							case 'ttl':
								result = await redisData.ttl.call(this, i);
								break;
							case 'exists':
								result = await redisData.exists.call(this, i);
								break;
							case 'keys':
								result = await redisData.keys.call(this, i);
								break;
							case 'scan':
								result = await redisData.scan.call(this, i);
								break;
							case 'type':
								result = await redisData.type.call(this, i);
								break;
							case 'rename':
								result = await redisData.rename.call(this, i);
								break;
							case 'lpush':
								result = await redisData.lpush.call(this, i);
								break;
							case 'rpush':
								result = await redisData.rpush.call(this, i);
								break;
							case 'lpop':
								result = await redisData.lpop.call(this, i);
								break;
							case 'rpop':
								result = await redisData.rpop.call(this, i);
								break;
							case 'lrange':
								result = await redisData.lrange.call(this, i);
								break;
							case 'sadd':
								result = await redisData.sadd.call(this, i);
								break;
							case 'smembers':
								result = await redisData.smembers.call(this, i);
								break;
							case 'srem':
								result = await redisData.srem.call(this, i);
								break;
							case 'hset':
								result = await redisData.hset.call(this, i);
								break;
							case 'hget':
								result = await redisData.hget.call(this, i);
								break;
							case 'hgetall':
								result = await redisData.hgetall.call(this, i);
								break;
							case 'hdel':
								result = await redisData.hdel.call(this, i);
								break;
							case 'zadd':
								result = await redisData.zadd.call(this, i);
								break;
							case 'zrange':
								result = await redisData.zrange.call(this, i);
								break;
							case 'zrem':
								result = await redisData.zrem.call(this, i);
								break;
							case 'publish':
								result = await redisData.publish.call(this, i);
								break;
							case 'executeCommand':
								result = await redisData.executeCommand.call(this, i);
								break;
						}
						break;

					case 'kafkaCluster':
						switch (operation) {
							case 'list':
								result = await kafkaCluster.list.call(this);
								break;
							case 'create':
								result = await kafkaCluster.create.call(this, i);
								break;
							case 'get':
								result = await kafkaCluster.get.call(this, i);
								break;
							case 'delete':
								result = await kafkaCluster.deleteCluster.call(this, i);
								break;
							case 'rename':
								result = await kafkaCluster.rename.call(this, i);
								break;
							case 'resetPassword':
								result = await kafkaCluster.resetPassword.call(this, i);
								break;
							case 'getStats':
								result = await kafkaCluster.getStats.call(this, i);
								break;
						}
						break;

					case 'kafkaTopic':
						switch (operation) {
							case 'list':
								result = await kafkaTopic.list.call(this, i);
								break;
							case 'create':
								result = await kafkaTopic.create.call(this, i);
								break;
							case 'get':
								result = await kafkaTopic.get.call(this, i);
								break;
							case 'delete':
								result = await kafkaTopic.deleteTopic.call(this, i);
								break;
							case 'reconfigure':
								result = await kafkaTopic.reconfigure.call(this, i);
								break;
							case 'getStats':
								result = await kafkaTopic.getStats.call(this, i);
								break;
						}
						break;

					case 'kafkaCredential':
						switch (operation) {
							case 'list':
								result = await kafkaCredential.list.call(this, i);
								break;
							case 'create':
								result = await kafkaCredential.create.call(this, i);
								break;
							case 'delete':
								result = await kafkaCredential.deleteCredential.call(this, i);
								break;
						}
						break;

					case 'kafkaConnector':
						switch (operation) {
							case 'list':
								result = await kafkaConnector.list.call(this, i);
								break;
							case 'create':
								result = await kafkaConnector.create.call(this, i);
								break;
							case 'get':
								result = await kafkaConnector.get.call(this, i);
								break;
							case 'delete':
								result = await kafkaConnector.deleteConnector.call(this, i);
								break;
							case 'reconfigure':
								result = await kafkaConnector.reconfigure.call(this, i);
								break;
							case 'restart':
								result = await kafkaConnector.restart.call(this, i);
								break;
						}
						break;

					case 'qstashMessage':
						switch (operation) {
							case 'publish':
								result = await qstashMessage.publish.call(this, i);
								break;
							case 'publishBatch':
								result = await qstashMessage.publishBatch.call(this, i);
								break;
							case 'get':
								result = await qstashMessage.get.call(this, i);
								break;
							case 'delete':
								result = await qstashMessage.deleteMessage.call(this, i);
								break;
							case 'cancel':
								result = await qstashMessage.cancel.call(this, i);
								break;
						}
						break;

					case 'qstashSchedule':
						switch (operation) {
							case 'list':
								result = await qstashSchedule.list.call(this);
								break;
							case 'create':
								result = await qstashSchedule.create.call(this, i);
								break;
							case 'get':
								result = await qstashSchedule.get.call(this, i);
								break;
							case 'delete':
								result = await qstashSchedule.deleteSchedule.call(this, i);
								break;
							case 'pause':
								result = await qstashSchedule.pause.call(this, i);
								break;
							case 'resume':
								result = await qstashSchedule.resume.call(this, i);
								break;
						}
						break;

					case 'qstashDlq':
						switch (operation) {
							case 'list':
								result = await qstashDlq.list.call(this);
								break;
							case 'delete':
								result = await qstashDlq.deleteDlqMessage.call(this, i);
								break;
							case 'retry':
								result = await qstashDlq.retry.call(this, i);
								break;
						}
						break;

					case 'vectorIndex':
						switch (operation) {
							case 'list':
								result = await vectorIndex.list.call(this);
								break;
							case 'create':
								result = await vectorIndex.create.call(this, i);
								break;
							case 'get':
								result = await vectorIndex.get.call(this, i);
								break;
							case 'delete':
								result = await vectorIndex.deleteIndex.call(this, i);
								break;
							case 'getStats':
								result = await vectorIndex.getStats.call(this, i);
								break;
							case 'upsert':
								result = await vectorIndex.upsert.call(this, i);
								break;
							case 'query':
								result = await vectorIndex.query.call(this, i);
								break;
							case 'deleteVectors':
								result = await vectorIndex.deleteVectors.call(this, i);
								break;
							case 'fetch':
								result = await vectorIndex.fetch.call(this, i);
								break;
							case 'reset':
								result = await vectorIndex.reset.call(this);
								break;
						}
						break;

					case 'team':
						switch (operation) {
							case 'list':
								result = await team.list.call(this);
								break;
							case 'get':
								result = await team.get.call(this, i);
								break;
							case 'listMembers':
								result = await team.listMembers.call(this, i);
								break;
							case 'addMember':
								result = await team.addMember.call(this, i);
								break;
							case 'removeMember':
								result = await team.removeMember.call(this, i);
								break;
						}
						break;

					case 'usage':
						switch (operation) {
							case 'getDailyStats':
								result = await usage.getDailyStats.call(this, i);
								break;
							case 'getMonthlyStats':
								result = await usage.getMonthlyStats.call(this, i);
								break;
							case 'getBilling':
								result = await usage.getBilling.call(this);
								break;
						}
						break;

					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
