'use strict';

const AWS = require('aws-sdk');
const ConnectionRepository = require('../../../domain/repository/connection-repository.interface');

/**
 * DynamoDB implementation of the Connection Repository.
 * @implements {ConnectionRepository}
 */
class DynamoDBConnectionRepository extends ConnectionRepository {
    /**
     * @param {string} tableName - The name of the DynamoDB table.
     */
    constructor(tableName) {
        super();
        this.dynamo = new AWS.DynamoDB.DocumentClient();
        this.tableName = tableName;
    }

    /**
     * Adds a new connection to DynamoDB.
     * @param {object} connection - The connection object.
     * @returns {Promise<object>} The DynamoDB promise result.
     */
    async add(connection) {
        return this.dynamo.put({
            TableName: this.tableName,
            Item: {
                connectionId: connection.connectionId,
                userId: connection.userId,
                username: connection.username,
                roles: connection.roles,
                connectedAt: connection.connectedAt,
            },
        }).promise();
    }

    /**
     * Removes a connection from DynamoDB.
     * @param {string} connectionId - The ID of the connection to remove.
     * @returns {Promise<object>} The DynamoDB promise result.
     */
    async remove(connectionId) {
        return this.dynamo.delete({
            TableName: this.tableName,
            Key: { connectionId },
        }).promise();
    }

    /**
     * Retrieves all connections from DynamoDB.
     * @returns {Promise<Array<object>>} The list of items.
     */
    async findAll() {
        const result = await this.dynamo.scan({
            TableName: this.tableName,
            ProjectionExpression: 'connectionId',
        }).promise();
        return result.Items;
    }
}

module.exports = DynamoDBConnectionRepository;
