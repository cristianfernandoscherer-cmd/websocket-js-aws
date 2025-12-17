'use strict';

/**
 * Interface for Connection Repository.
 * @interface
 */
class ConnectionRepository {
    /**
     * Adds a new connection.
     * @param {object} connection - The connection object to add.
     * @returns {Promise<void>}
     */
    async add(connection) { throw new Error('Not implemented'); }

    /**
     * Removes a connection by ID.
     * @param {string} connectionId - The ID of the connection to remove.
     * @returns {Promise<void>}
     */
    async remove(connectionId) { throw new Error('Not implemented'); }

    /**
     * Finds all active connections.
     * @returns {Promise<Array<object>>} List of connections.
     */
    async findAll() { throw new Error('Not implemented'); }
}

module.exports = ConnectionRepository;
