'use strict';

const AWS = require('aws-sdk');

/**
 * Gateway for sending messages via AWS API Gateway.
 */
class ApiGatewayMessageGateway {
    /**
     * @param {string} endpoint - The API Gateway endpoint (domain + stage).
     */
    constructor(endpoint) {
        this.apigw = new AWS.ApiGatewayManagementApi({ endpoint });
    }

    /**
     * Sends data to a connected client.
     * @param {string} connectionId - The connection ID of the recipient.
     * @param {any} data - The data to send.
     * @returns {Promise<object>} The AWS promise result.
     */
    async sendToConnection(connectionId, data) {
        // Logic to handle if data is string or object is handled by caller or here. 
        // Use case passed object for broadcast and specific message, assuming data is payload.
        // But verify protocol:
        // Broadcast Use Case: sends object {message, timestamp}
        // Specific Message Use Case: sends 'data' directly.

        // Let's ensure we send a string.
        const payload = typeof data === 'string' ? data : JSON.stringify(data);

        return this.apigw.postToConnection({
            ConnectionId: connectionId,
            Data: payload,
        }).promise();
    }
}

module.exports = ApiGatewayMessageGateway;
