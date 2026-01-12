/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

// Redis Database Types
export interface IRedisDatabase {
	database_id: string;
	database_name: string;
	database_type: string;
	region: string;
	port: number;
	creation_time: number;
	state: string;
	password: string;
	user_email: string;
	endpoint: string;
	tls: boolean;
	rest_token: string;
	read_only_rest_token: string;
	db_max_clients: number;
	db_max_request_size: number;
	db_disk_threshold: number;
	db_max_entry_size: number;
	db_memory_threshold: number;
	db_daily_bandwidth_limit: number;
	db_max_commands_per_second: number;
	db_request_limit: number;
}

export interface ICreateDatabaseParams {
	name: string;
	region: string;
	tls?: boolean;
}

export interface ICreateGlobalDatabaseParams {
	name: string;
	primary_region: string;
	read_regions: string[];
	tls?: boolean;
}

// Kafka Types
export interface IKafkaCluster {
	cluster_id: string;
	name: string;
	region: string;
	type: string;
	multizone: boolean;
	tcp_endpoint: string;
	rest_endpoint: string;
	state: string;
	username: string;
	password: string;
	max_retention_size: number;
	max_retention_time: number;
	max_messages_per_second: number;
	max_message_size: number;
	max_partitions: number;
	creation_time: number;
}

export interface IKafkaTopic {
	topic_id: string;
	topic_name: string;
	cluster_id: string;
	region: string;
	creation_time: number;
	state: string;
	partitions: number;
	multizone: boolean;
	tcp_endpoint: string;
	rest_endpoint: string;
	username: string;
	password: string;
	cleanup_policy: string;
	retention_size: number;
	retention_time: number;
	max_message_size: number;
}

export interface IKafkaCredential {
	credential_id: string;
	credential_name: string;
	topic: string;
	permissions: string;
	cluster_id: string;
	username: string;
	creation_time: number;
	password: string;
	state: string;
}

export interface IKafkaConnector {
	connector_id: string;
	name: string;
	cluster_id: string;
	creation_time: number;
	state: string;
	connector_state: string;
	connector_class: string;
	encoded_username: string;
	TTL: number;
	properties: IDataObject;
}

// QStash Types
export interface IQStashMessage {
	messageId: string;
	topicName?: string;
	url: string;
	method: string;
	header: IDataObject;
	body: string;
	maxRetries: number;
	notBefore: number;
	createdAt: number;
	callback?: string;
	failureCallback?: string;
	scheduleId?: string;
}

export interface IQStashSchedule {
	scheduleId: string;
	cron: string;
	destination: string;
	method: string;
	header: IDataObject;
	body?: string;
	retries: number;
	delay?: string;
	callback?: string;
	failureCallback?: string;
	createdAt: number;
	paused: boolean;
}

export interface IQStashDlqMessage {
	dlqId: string;
	messageId: string;
	topicName?: string;
	url: string;
	method: string;
	header: IDataObject;
	body: string;
	maxRetries: number;
	responseStatus: number;
	responseHeader: IDataObject;
	responseBody: string;
	responseBodyBase64: string;
	createdAt: number;
}

// Vector Types
export interface IVectorIndex {
	name: string;
	dimension: number;
	similarity_function: string;
	endpoint: string;
	token: string;
	read_only_token: string;
	type: string;
	region: string;
	max_vector_count: number;
	max_daily_updates: number;
	max_daily_queries: number;
	max_monthly_bandwidth: number;
	max_writes_per_second: number;
	max_query_per_second: number;
	max_reads_per_request: number;
	max_writes_per_request: number;
	creation_time: number;
}

export interface IVector {
	id: string;
	vector: number[];
	metadata?: IDataObject;
}

export interface IVectorQueryResult {
	id: string;
	score: number;
	vector?: number[];
	metadata?: IDataObject;
}

// Team Types
export interface ITeam {
	team_id: string;
	team_name: string;
	copy_cc: boolean;
}

export interface ITeamMember {
	email: string;
	role: string;
}

// Usage Types
export interface IUsageStats {
	date: string;
	read_count: number;
	write_count: number;
	storage: number;
	billing: number;
}

// Generic Response Types
export interface IUpstashResponse<T> {
	result?: T;
	error?: string;
}

// Resource and Operation Types
export type UpstashResource =
	| 'redisDatabase'
	| 'redisData'
	| 'kafkaCluster'
	| 'kafkaTopic'
	| 'kafkaCredential'
	| 'kafkaConnector'
	| 'qstashMessage'
	| 'qstashSchedule'
	| 'qstashDlq'
	| 'vectorIndex'
	| 'team'
	| 'usage';

// Redis Data Operation Types
export type RedisDataOperation =
	| 'set'
	| 'get'
	| 'del'
	| 'mset'
	| 'mget'
	| 'incr'
	| 'decr'
	| 'incrby'
	| 'decrby'
	| 'expire'
	| 'ttl'
	| 'exists'
	| 'keys'
	| 'scan'
	| 'type'
	| 'rename'
	| 'lpush'
	| 'rpush'
	| 'lpop'
	| 'rpop'
	| 'lrange'
	| 'sadd'
	| 'smembers'
	| 'srem'
	| 'hset'
	| 'hget'
	| 'hgetall'
	| 'hdel'
	| 'zadd'
	| 'zrange'
	| 'zrem'
	| 'publish'
	| 'executeCommand';
