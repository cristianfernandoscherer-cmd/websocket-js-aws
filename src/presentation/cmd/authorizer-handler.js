'use strict';

const AuthorizeUseCase = require('../../domain/usecases/authorize');

const authorizeUseCase = new AuthorizeUseCase(process.env.JWT_SECRET);

/**
 * Authorizer Handler for WebSocket connections.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @param {Function} callback - The Lambda callback function.
 * @returns {void}
 */
module.exports.handler = (event, context, callback) => {
    const token = event.headers.Authorization || event.queryStringParameters.Authorization;

    if (!token) {
        return callback('Unauthorized');
    }

    try {
        const policy = authorizeUseCase.execute(token, event.methodArn);
        callback(null, policy);
    } catch (err) {
        callback('Unauthorized');
    }
};
