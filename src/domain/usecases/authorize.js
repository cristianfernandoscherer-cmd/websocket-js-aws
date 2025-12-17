'use strict';

const jwt = require('jsonwebtoken');
const { log } = require('../../shared/logger');

class AuthorizeUseCase {
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    /**
     * @param {string} rawToken - Token com ou sem prefixo Bearer
     * @param {string} methodArn
     */
    execute(rawToken, methodArn) {
        try {
            const token = this.extractToken(rawToken);

            const decoded = jwt.verify(token, this.jwtSecret);

            log('info', 'token_verified', {
                sub: decoded.sub,
                roles: decoded.roles,
            });

            return this.generatePolicy(
                decoded.sub,
                'Allow',
                methodArn,
                {
                    userId: decoded.sub,
                    username: decoded.name,
                    roles: JSON.stringify(decoded.roles || []),
                }
            );

        } catch (err) {
            log('warn', 'authorization_failed', {
                reason: err.message,
            });

            throw new Error('Unauthorized');
        }
    }

    extractToken(rawToken) {
        if (!rawToken) {
            throw new Error('Token not provided');
        }

        if (rawToken.startsWith('Bearer ')) {
            return rawToken.replace('Bearer ', '');
        }

        return rawToken;
    }

    generatePolicy(principalId, effect, resource, context) {
        return {
            principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: resource,
                    },
                ],
            },
            context,
        };
    }
}

module.exports = AuthorizeUseCase;
