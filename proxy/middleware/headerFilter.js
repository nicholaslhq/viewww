/**
 * Header filtering middleware
 */

import { config } from '../config.js';

/**
 * Filters and removes restrictive headers from the response
 * @param {Object} headers - Response headers object
 * @param {Object} res - Express response object
 */
export function filterHeaders(headers, res) {
    // Copy headers except the ones we want to remove
    Object.entries(headers).forEach(([key, value]) => {
        if (!config.headersToRemove.includes(key.toLowerCase())) {
            res.setHeader(key, value);
        }
    });

    // Ensure we allow iframe embedding
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
}
