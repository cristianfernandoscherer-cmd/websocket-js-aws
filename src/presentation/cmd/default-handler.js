'use strict';

const { log } = require('../../shared/logger');

/**
 * Default Handler for unmatched WebSocket routes.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} The Lambda response.
 */
module.exports.handler = async (event, context) => {
    log('warn', 'default_route_hit', {
        connectionId: event.requestContext.connectionId,
        route: event.requestContext.routeKey,
    });

    return { statusCode: 200 };
};
