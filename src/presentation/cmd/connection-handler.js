'use strict';

const ConnectUseCase = require('../../domain/usecases/connect');
const DynamoDBConnectionRepository = require('../../infra/db/dynamodb/connection-repository');

const connectionRepository = new DynamoDBConnectionRepository(process.env.TABLE_NAME);
const connectUseCase = new ConnectUseCase(connectionRepository);

const successfullResponse = {
    statusCode: 200,
    body: 'everything is alright',
};

/**
 * Connection Handler for WebSocket $connect and $disconnect events.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} The Lambda response.
 */
module.exports.handler = async (event, context) => {
    const { eventType, connectionId } = event.requestContext;

    try {
        if (eventType === 'CONNECT') {
            const authorizer = event.requestContext.authorizer;
            await connectUseCase.execute(connectionId, authorizer);
        } else if (eventType === 'DISCONNECT') {
            await connectUseCase.disconnect(connectionId);
        }
        return successfullResponse;
    } catch (error) {
        console.error('Connection error:', error);
        return {
            statusCode: 500,
            body: 'Failed to process connection event'
        };
    }
};
