'use strict';

const SendBroadcastMessageUseCase = require('../../domain/usecases/send-broadcast-message');
const DynamoDBConnectionRepository = require('../../infra/db/dynamodb/connection-repository');
const ApiGatewayMessageGateway = require('../../infra/gateways/message-gateway');
const { log } = require('../../shared/logger');

const connectionRepository = new DynamoDBConnectionRepository(process.env.TABLE_NAME);

/**
 * Handler for sending broadcast messages.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} The Lambda response.
 */
module.exports.handler = async (event, context) => {
    const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;
    const messageGateway = new ApiGatewayMessageGateway(endpoint);
    const useCase = new SendBroadcastMessageUseCase(connectionRepository, messageGateway);

    const { connectionId } = event.requestContext;
    const body = JSON.parse(event.body);
    const message = body.data;
    const roles = JSON.parse(event.requestContext.authorizer.roles || '[]');

    try {
        await useCase.execute(connectionId, roles, message);
        log('info', 'send_message_success', { connectionId });
        return { statusCode: 200, body: 'everything is alright' };
    } catch (err) {
        log('error', 'send_message_failed', { connectionId, error: err.message });
        const statusCode = err.message === 'Função reservada para administradores' ? 403 : 500;
        return { statusCode, body: err.message };
    }
};
