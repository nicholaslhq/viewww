/**
 * Layout transformation utilities
 */

import type { Layout } from 'react-grid-layout';
import type { WindowItem } from '../types';

/**
 * Converts WindowItem array to react-grid-layout Layout array
 * @param windows - Array of WindowItem objects
 * @returns Array of Layout objects for react-grid-layout
 */
export function windowsToGridLayout(windows: WindowItem[]): Layout[] {
    return windows.map((item) => ({
        i: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
    }));
}

/**
 * Merges grid layout changes back into WindowItem array
 * @param gridLayout - Updated layout from react-grid-layout
 * @param originalWindows - Original WindowItem array
 * @param profileId - Current profile ID to ensure consistency
 * @returns Updated WindowItem array with new positions/sizes
 */
export function mergeGridLayoutToWindows(
    gridLayout: Layout[],
    originalWindows: WindowItem[],
    profileId: string
): WindowItem[] {
    const merged: WindowItem[] = [];

    for (const layoutItem of gridLayout) {
        const original = originalWindows.find((w) => w.id === layoutItem.i);
        if (original) {
            merged.push({
                ...original,
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h,
                // Ensure profileId is always set
                profileId: original.profileId || profileId,
            });
        }
    }

    return merged;
}

/**
 * Ensures all windows in a layout have the correct profileId
 * @param windows - Array of WindowItem objects
 * @param profileId - Profile ID to assign
 * @returns Updated WindowItem array with profileId set
 */
export function ensureProfileId(windows: WindowItem[], profileId: string): WindowItem[] {
    return windows.map((w) => ({
        ...w,
        profileId: w.profileId || profileId,
    }));
}
