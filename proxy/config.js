/**
 * Proxy server configuration
 */

export const config = {
    port: 3001,
    corsOrigin: '*',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    headersToRemove: [
        'x-frame-options',
        'content-security-policy',
        'content-security-policy-report-only',
        'frame-options',
        'content-encoding',
        'content-length',
        'transfer-encoding',
    ],
    scrollDebounceMs: 100,
};
