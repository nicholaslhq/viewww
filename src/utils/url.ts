/**
 * URL utility functions
 */

/**
 * Normalizes a URL by adding https:// protocol if missing
 * @param url - The URL to normalize
 * @returns The normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
    if (!url) return url;

    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        return `https://${trimmedUrl}`;
    }

    return trimmedUrl;
}

/**
 * Builds a proxy URL for the given target URL and window ID
 * @param baseUrl - The proxy server base URL
 * @param targetUrl - The URL to proxy
 * @param windowId - The window ID for tracking
 * @returns The complete proxy URL
 */
export function buildProxyUrl(baseUrl: string, targetUrl: string, windowId: string): string {
    return `${baseUrl}?url=${encodeURIComponent(targetUrl)}&windowId=${encodeURIComponent(windowId)}`;
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL to validate
 * @returns True if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(normalizeUrl(url));
        return true;
    } catch {
        return false;
    }
}
