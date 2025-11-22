/**
 * Application-wide constants and configuration
 */

// Proxy Configuration
export const PROXY_BASE_URL = '';
export const PROXY_ENDPOINT = `/proxy`;
export const PROXY_METADATA_ENDPOINT = `/proxy/metadata`;

// Default Window Sizes
export const DEFAULT_WINDOW_SIZES = {
    mobile: { w: 2, h: 8 },
    smallTablet: { w: 4, h: 8 },
    tablet: { w: 3, h: 10 },
    desktop: { w: 4, h: 10 },
} as const;

// Responsive Breakpoints (must match GridCanvas breakpoints)
export const BREAKPOINTS = {
    mobile: 480,
    smallTablet: 768,
    tablet: 996,
    desktop: 1200,
} as const;

// Grid Layout Configuration
export const GRID_CONFIG = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 30,
    margin: [10, 10] as [number, number],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    viewwwStorage: 'viewww-storage',
} as const;

// Application Metadata
export const APP_VERSION = '1.0.0';
export const APP_MODE = 'Local Mode';

// Scroll Update Debounce
export const SCROLL_DEBOUNCE_MS = 100;

// User Agent for Proxy Requests
export const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
