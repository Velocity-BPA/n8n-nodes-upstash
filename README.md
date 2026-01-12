# n8n-nodes-upstash

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Upstash, the serverless data platform providing Redis, Kafka, QStash, and Vector databases. This node enables workflow automation for database management, Redis operations, Kafka messaging, vector search, and task scheduling through Upstash's Management and Data APIs.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **Redis Database Management**: Create, configure, and manage Redis databases with support for global multi-region deployments
- **Redis Data Operations**: Full CRUD operations including strings, lists, sets, hashes, sorted sets, and pub/sub
- **Kafka Clusters**: Manage Kafka clusters, topics, credentials, and connectors
- **QStash Messaging**: Publish messages, create schedules, and manage dead letter queues
- **Vector Databases**: Create indexes, upsert vectors, and perform similarity searches
- **Team & Usage**: Manage teams, members, and monitor usage statistics
- **Webhook Triggers**: Receive QStash callbacks with signature verification

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Search for `n8n-nodes-upstash`
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-upstash
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-upstash.git
cd n8n-nodes-upstash

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-upstash

# Restart n8n
n8n start
```

## Credentials Setup

The Upstash node requires credentials to authenticate with Upstash APIs.

### Required Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Email | Your Upstash account email | Yes |
| API Key | API key from Upstash Console | Yes |

### Optional Credentials (for Data Operations)

| Field | Description | Required For |
|-------|-------------|--------------|
| Redis REST URL | Database REST endpoint | Redis data operations |
| Redis REST Token | Database REST token | Redis data operations |
| QStash Token | QStash API token | QStash operations |
| QStash Signing Key | Webhook signature verification | QStash triggers |
| Vector REST URL | Vector index REST endpoint | Vector operations |
| Vector REST Token | Vector index REST token | Vector operations |

### Getting Your Credentials

1. **Management API (Email + API Key)**:
   - Log into [Upstash Console](https://console.upstash.com)
   - Navigate to Account settings
   - Find "API Keys" section
   - Copy your API key (or create a new one)

2. **Redis REST Credentials**:
   - Select your database in Upstash Console
   - Find "REST API" section on database details page
   - Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

3. **QStash Credentials**:
   - Go to [QStash Console](https://console.upstash.com/qstash)
   - Copy your QStash token from the dashboard
   - For webhook verification, copy the signing key

4. **Vector Credentials**:
   - Select your vector index in Upstash Console
   - Copy the REST URL and token from the index details

## Resources & Operations

### Redis Databases (12 operations)
| Operation | Description |
|-----------|-------------|
| List | List all Redis databases |
| Create | Create a new Redis database |
| Create Global | Create a multi-region global database |
| Get | Get database details |
| Delete | Delete a database |
| Rename | Rename a database |
| Reset Password | Reset database password |
| Enable TLS | Enable TLS encryption |
| Set Eviction | Enable/disable eviction |
| Set Auto Scaling | Enable/disable auto-scaling |
| Move to Team | Move database to a team |
| Get Stats | Get database statistics |

### Redis Data Operations (33 operations)
| Category | Operations |
|----------|------------|
| Strings | set, get, del, mset, mget, incr, decr, incrby, decrby |
| Keys | expire, ttl, exists, keys, scan, type, rename |
| Lists | lpush, rpush, lpop, rpop, lrange |
| Sets | sadd, smembers, srem |
| Hashes | hset, hget, hgetall, hdel |
| Sorted Sets | zadd, zrange, zrem |
| Pub/Sub | publish |
| Custom | executeCommand |

### Kafka Clusters (7 operations)
| Operation | Description |
|-----------|-------------|
| List | List all Kafka clusters |
| Create | Create a new Kafka cluster |
| Get | Get cluster details |
| Delete | Delete a cluster |
| Rename | Rename a cluster |
| Reset Password | Reset cluster password |
| Get Stats | Get cluster statistics |

### Kafka Topics (6 operations)
| Operation | Description |
|-----------|-------------|
| List | List topics in a cluster |
| Create | Create a new topic |
| Get | Get topic details |
| Delete | Delete a topic |
| Reconfigure | Update topic configuration |
| Get Stats | Get topic statistics |

### Kafka Credentials (3 operations)
| Operation | Description |
|-----------|-------------|
| List | List credentials for a cluster |
| Create | Create new credentials |
| Delete | Delete credentials |

### Kafka Connectors (6 operations)
| Operation | Description |
|-----------|-------------|
| List | List connectors in a cluster |
| Create | Create a new connector |
| Get | Get connector details |
| Delete | Delete a connector |
| Reconfigure | Update connector configuration |
| Restart | Restart a connector |

### QStash Messages (5 operations)
| Operation | Description |
|-----------|-------------|
| Publish | Publish a message to a URL |
| Publish Batch | Publish multiple messages |
| Get | Get message details |
| Delete | Delete a scheduled message |
| Cancel | Cancel a scheduled message |

### QStash Schedules (6 operations)
| Operation | Description |
|-----------|-------------|
| List | List all schedules |
| Create | Create a new schedule |
| Get | Get schedule details |
| Delete | Delete a schedule |
| Pause | Pause a schedule |
| Resume | Resume a schedule |

### QStash Dead Letter Queue (3 operations)
| Operation | Description |
|-----------|-------------|
| List | List messages in DLQ |
| Delete | Delete message from DLQ |
| Retry | Retry message from DLQ |

### Vector Indexes (10 operations)
| Operation | Description |
|-----------|-------------|
| List | List all vector indexes |
| Create | Create a new index |
| Get | Get index details |
| Delete | Delete an index |
| Get Stats | Get index statistics |
| Upsert | Insert or update vectors |
| Query | Query similar vectors |
| Delete Vectors | Delete vectors by ID |
| Fetch | Fetch vectors by ID |
| Reset | Reset (clear) index |

### Teams (5 operations)
| Operation | Description |
|-----------|-------------|
| List | List teams |
| Get | Get team details |
| List Members | List team members |
| Add Member | Add member to team |
| Remove Member | Remove member from team |

### Usage & Billing (3 operations)
| Operation | Description |
|-----------|-------------|
| Get Daily Stats | Get daily usage statistics |
| Get Monthly Stats | Get monthly usage statistics |
| Get Billing | Get billing information |

## Trigger Node

The **Upstash Trigger** node receives QStash webhook callbacks.

### Events

| Event | Description |
|-------|-------------|
| Message Delivered | Triggered when a message is successfully delivered |
| Message Failed | Triggered when message delivery fails |
| Message DLQ | Triggered when a message is moved to dead letter queue |
| All Events | Receive all QStash webhook events |

### Configuration

1. Add the **Upstash Trigger** node to your workflow
2. Configure your Upstash credentials
3. Enable **Verify Signature** for security
4. Copy the webhook URL from n8n
5. Configure your QStash messages to callback to this URL

## Usage Examples

### Create and Use a Redis Database

```javascript
// 1. Create a Redis database
{
  "resource": "redisDatabase",
  "operation": "create",
  "name": "my-cache",
  "region": "us-east-1",
  "tls": true
}

// 2. Store data
{
  "resource": "redisData",
  "operation": "set",
  "key": "user:123",
  "value": "{\"name\": \"John\", \"email\": \"john@example.com\"}",
  "ttl": 3600
}

// 3. Retrieve data
{
  "resource": "redisData",
  "operation": "get",
  "key": "user:123"
}
```

### Schedule a Message with QStash

```javascript
// Create a recurring schedule
{
  "resource": "qstashSchedule",
  "operation": "create",
  "destination": "https://api.example.com/process",
  "cron": "0 9 * * *",
  "body": "{\"type\": \"daily-report\"}",
  "retries": 3
}
```

### Vector Similarity Search

```javascript
// 1. Create an index
{
  "resource": "vectorIndex",
  "operation": "create",
  "indexName": "embeddings",
  "dimension": 1536,
  "metric": "cosine"
}

// 2. Upsert vectors
{
  "resource": "vectorIndex",
  "operation": "upsert",
  "indexName": "embeddings",
  "vectors": [
    {
      "id": "doc-1",
      "vector": [0.1, 0.2, ...],
      "metadata": {"title": "Document 1"}
    }
  ]
}

// 3. Query similar vectors
{
  "resource": "vectorIndex",
  "operation": "query",
  "indexName": "embeddings",
  "vector": [0.1, 0.2, ...],
  "topK": 10,
  "includeMetadata": true
}
```

## Upstash Concepts

### Serverless Architecture
Upstash provides serverless data services with pay-per-request pricing. Databases scale automatically and you only pay for what you use.

### Global Databases
Redis databases can be deployed globally with read replicas in multiple regions for low-latency access worldwide.

### REST APIs
All Upstash services offer HTTP-based REST APIs, making them accessible from serverless functions and edge computing environments where TCP connections aren't available.

### QStash
QStash is a message queue and scheduler service that guarantees at-least-once delivery with automatic retries and dead letter queues.

## Regions

### Redis Regions
| Region | Location |
|--------|----------|
| us-east-1 | N. Virginia, USA |
| us-west-1 | N. California, USA |
| us-west-2 | Oregon, USA |
| eu-west-1 | Ireland |
| eu-central-1 | Frankfurt, Germany |
| ap-southeast-1 | Singapore |
| ap-southeast-2 | Sydney, Australia |
| ap-northeast-1 | Tokyo, Japan |
| sa-east-1 | São Paulo, Brazil |

### Kafka Regions
| Region | Location |
|--------|----------|
| us-east-1 | N. Virginia, USA |
| eu-west-1 | Ireland |
| ap-southeast-1 | Singapore |

## Error Handling

The node handles common Upstash API errors:

| Status Code | Description | Handling |
|-------------|-------------|----------|
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Verify credentials |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Implement backoff |
| 500 | Server Error | Retry operation |

Enable **Continue On Fail** in n8n to handle errors gracefully in workflows.

## Security Best Practices

1. **Use Environment Variables**: Store credentials in environment variables, not in workflows
2. **Enable TLS**: Always enable TLS for Redis databases
3. **Verify Signatures**: Enable webhook signature verification for QStash triggers
4. **Scope Credentials**: Use topic-scoped Kafka credentials with minimal permissions
5. **Read-Only Tokens**: Use read-only Redis tokens when write access isn't needed

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Passes all tests (`npm test`)
- Passes linting (`npm run lint`)
- Includes appropriate documentation
- Follows the existing code style

## Support

- **Documentation**: [Upstash Docs](https://docs.upstash.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-upstash/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Upstash](https://upstash.com) for the excellent serverless data platform
- [n8n](https://n8n.io) for the powerful workflow automation platform
- The n8n community for inspiration and support
