/**
 * Main proxy route handler
 */

import axios from 'axios';
import { config } from '../config.js';
import { filterHeaders } from '../middleware/headerFilter.js';
import { createScriptInjector } from '../utils/scriptInjector.js';

/**
 * Handles proxy requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function proxyHandler(req, res) {
    const targetUrl = req.query.url;
    const windowId = req.query.windowId;

    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': config.userAgent,
                ...config.defaultHeaders
            }
        });

        // Get the final URL (after redirects) or fallback to targetUrl
        const finalUrl = response.request.res.responseUrl || targetUrl;

        // Filter and set headers
        filterHeaders(response.headers, res);

        // Create script injector and pipe response
        const scriptInjector = createScriptInjector(windowId, config.scrollDebounceMs, finalUrl);
        response.data.pipe(scriptInjector).pipe(res);
    } catch (error) {
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
}
