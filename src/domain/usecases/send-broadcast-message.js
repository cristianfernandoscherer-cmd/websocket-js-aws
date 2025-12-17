'use strict';

const { log } = require('../../shared/logger');

/**
 * Use Case for broadcasting a message to all connected users.
 */
class SendBroadcastMessageUseCase {
    /**
     * @param {import('../repository/connection-repository.interface')} connectionRepository - The connection repository.
     * @param {import('../../infra/gateways/message-gateway')} messageGateway - The message gateway.
     */
    constructor(connectionRepository, messageGateway) {
        this.connectionRepository = connectionRepository;
        this.messageGateway = messageGateway;
    }

    /**
     * Executes the broadcast logic.
     * @param {string} fromConnectionId - The ID of the sender connection.
     * @param {Array<string>} roles - The roles of the sender.
     * @param {string} message - The message to broadcast.
     * @returns {Promise<void>}
     * @throws {Error} If sender is not an admin.
     */
    async execute(fromConnectionId, roles, message) {
        if (!roles.includes('admin')) {
            log('warn', 'send_message_denied', {
                connectionId: fromConnectionId,
                reason: 'not_admin',
            });
            throw new Error('Função reservada para administradores');
        }

        const connections = await this.connectionRepository.findAll();

        log('info', 'broadcast_start', {
            totalConnections: connections.length,
        });

        const results = await Promise.allSettled(
            connections.map(item =>
                this.messageGateway.sendToConnection(item.connectionId, {
                    message,
                    timestamp: new Date().toISOString()
                })
            )
        );

        // Log partial failures if needed (using Promise.allSettled logic)
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                log('warn', 'broadcast_partial_failure', {
                    targetConnection: connections[index].connectionId,
                    error: result.reason.message,
                });
            }
        });
    }
}

module.exports = SendBroadcastMessageUseCase;
