'use strict';

/**
 * Logs a message with a specific level, action, and additional data.
 * @param {string} level - The log level (e.g., 'info', 'warn', 'error').
 * @param {string} action - The action identifier associated with the log.
 * @param {object} [data={}] - Additional data to be logged.
 */
const log = (level, action, data = {}) => {
    console.log(JSON.stringify({
        level,
        action,
        timestamp: new Date().toISOString(),
        ...data,
    }));
};

module.exports = { log };
