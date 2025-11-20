/**
 * Responsive layout utility functions
 */

import { BREAKPOINTS, DEFAULT_WINDOW_SIZES } from '../constants';
import type { WindowSize } from '../types';

/**
 * Calculates default window size based on screen width
 * @param screenWidth - Current screen width in pixels
 * @param customW - Optional custom width override
 * @param customH - Optional custom height override
 * @returns Window size configuration
 */
export function calculateDefaultWindowSize(
    screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200,
    customW?: number,
    customH?: number
): WindowSize {
    // If both custom dimensions are provided, use them
    if (customW !== undefined && customH !== undefined) {
        return { w: customW, h: customH };
    }

    // Determine defaults based on breakpoints
    let defaults: WindowSize;

    if (screenWidth < BREAKPOINTS.mobile) {
        defaults = DEFAULT_WINDOW_SIZES.mobile;
    } else if (screenWidth < BREAKPOINTS.smallTablet) {
        defaults = DEFAULT_WINDOW_SIZES.smallTablet;
    } else if (screenWidth < BREAKPOINTS.tablet) {
        defaults = DEFAULT_WINDOW_SIZES.tablet;
    } else {
        defaults = DEFAULT_WINDOW_SIZES.desktop;
    }

    return {
        w: customW ?? defaults.w,
        h: customH ?? defaults.h,
    };
}

/**
 * Gets the current breakpoint name based on screen width
 * @param screenWidth - Current screen width in pixels
 * @returns Breakpoint name
 */
export function getCurrentBreakpoint(screenWidth: number): 'mobile' | 'smallTablet' | 'tablet' | 'desktop' {
    if (screenWidth < BREAKPOINTS.mobile) return 'mobile';
    if (screenWidth < BREAKPOINTS.smallTablet) return 'smallTablet';
    if (screenWidth < BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
}
