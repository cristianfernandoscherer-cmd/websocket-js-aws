'use strict';

const { log } = require('../../shared/logger');

/**
 * Use Case for sending a message to a specific connection.
 */
class SendMessageUseCase {
    /**
     * @param {import('../../infra/gateways/message-gateway')} messageGateway - The message gateway.
     */
    constructor(messageGateway) {
        this.messageGateway = messageGateway;
    }

    /**
     * Executes the send message logic.
     * @param {string} fromConnectionId - The ID of the sender connection.
     * @param {string} toConnectionId - The ID of the recipient connection.
     * @param {any} data - The message data to send.
     * @returns {Promise<void>}
     * @throws {Error} If validation fails or sending fails.
     */
    async execute(fromConnectionId, toConnectionId, data) {
        if (!toConnectionId || !data) {
            log('warn', 'send_specific_invalid_payload', { fromConnection: fromConnectionId });
            throw new Error('connectionId and data are required');
        }

        try {
            await this.messageGateway.sendToConnection(toConnectionId, data);
            log('info', 'send_specific_success', {
                fromConnection: fromConnectionId,
                toConnection: toConnectionId,
            });
        } catch (err) {
            log('error', 'send_specific_failed', {
                fromConnection: fromConnectionId,
                error: err.message,
            });
            throw err;
        }
    }
}

module.exports = SendMessageUseCase;
