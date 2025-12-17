'use strict';

const { log } = require('../../shared/logger');

/**
 * Use Case for handling user connections.
 */
class ConnectUseCase {
    /**
     * @param {import('../repository/connection-repository.interface')} connectionRepository - The connection repository.
     */
    constructor(connectionRepository) {
        this.connectionRepository = connectionRepository;
    }

    /**
     * Executes the connection logic.
     * @param {string} connectionId - The ID of the connection.
     * @param {object} authorizer - The authorizer context containing user info.
     * @returns {Promise<void>}
     */
    async execute(connectionId, authorizer) {
        const userData = {
            userId: authorizer?.userId || 'anonymous',
            username: authorizer?.username || 'Usuário',
            roles: authorizer?.roles ? JSON.parse(authorizer.roles) : ['user'],
        };

        log('info', 'user_connected', {
            connectionId,
            userId: userData.userId,
            roles: userData.roles,
        });

        const connection = {
            connectionId,
            ...userData,
            connectedAt: new Date().toISOString(),
        };

        return this.connectionRepository.add(connection);
    }

    /**
     * Executes the disconnection logic.
     * @param {string} connectionId - The ID of the connection to remove.
     * @returns {Promise<void>}
     */
    async disconnect(connectionId) {
        log('info', 'user_disconnected', { connectionId });
        return this.connectionRepository.remove(connectionId);
    }
}

module.exports = ConnectUseCase;
