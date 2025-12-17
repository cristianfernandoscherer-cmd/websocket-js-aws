'use strict';

const SendeMessageUseCase = require('../../domain/usecases/send-message');
const ApiGatewayMessageGateway = require('../../infra/gateways/message-gateway');
const { log } = require('../../shared/logger');

/**
 * Handler for sending specific messages.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} The Lambda response.
 */
module.exports.handler = async (event, context) => {
    const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;
    const messageGateway = new ApiGatewayMessageGateway(endpoint);
    const useCase = new SendeMessageUseCase(messageGateway);

    const { connectionId } = event.requestContext;

    try {
        const body = JSON.parse(event.body);
        await useCase.execute(connectionId, body.connectionId, body.data);
        return { statusCode: 200, body: 'everything is alright' };
    } catch (err) {
        log('error', 'send_specific_handler_error', { error: err.message });
        const statusCode = err.message.includes('required') || err.message.includes('Invalid') ? 400 : 500;
        return { statusCode, body: err.message };
    }
};
