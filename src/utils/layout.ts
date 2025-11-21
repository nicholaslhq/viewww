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

/**
 * Finds the first available position in the grid for a new window
 * @param layout - Current array of WindowItem objects
 * @param w - Width of the new window
 * @param h - Height of the new window
 * @param cols - Total number of columns in the grid
 * @returns Object containing x and y coordinates
 */
export function findNextAvailablePosition(
    layout: WindowItem[],
    w: number,
    h: number,
    cols: number
): { x: number; y: number } {
    // Create a 2D map of occupied cells
    // We'll check up to a reasonable height (e.g., bottom of lowest window + new window height)
    const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const searchHeight = maxY + h + 1; // Add some buffer

    const occupied = new Set<string>();

    layout.forEach((item) => {
        for (let x = item.x; x < item.x + item.w; x++) {
            for (let y = item.y; y < item.y + item.h; y++) {
                occupied.add(`${x},${y}`);
            }
        }
    });

    // Search for the first available spot
    // We search row by row (y), then column by column (x)
    for (let y = 0; y < searchHeight; y++) {
        for (let x = 0; x <= cols - w; x++) {
            let fits = true;

            // Check if the rectangle [x, y] to [x+w, y+h] is free
            for (let dx = 0; dx < w; dx++) {
                for (let dy = 0; dy < h; dy++) {
                    if (occupied.has(`${x + dx},${y + dy}`)) {
                        fits = false;
                        break;
                    }
                }
                if (!fits) break;
            }

            if (fits) {
                return { x, y };
            }
        }
    }

    // If no spot found (shouldn't happen given our search height), place at bottom
    return { x: 0, y: maxY };
}

/**
 * Packs windows tightly into the grid to minimize gaps
 * @param windows - Array of WindowItem objects to pack
 * @param cols - Total number of columns in the grid
 * @returns New array of WindowItem objects with updated positions
 */
export function packWindows(windows: WindowItem[], cols: number): WindowItem[] {
    // Sort windows by position (top-to-bottom, left-to-right) to maintain relative order
    const sortedWindows = [...windows].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
    });

    const packedWindows: WindowItem[] = [];
    const occupied = new Set<string>();

    // Helper to check if a position is free
    const isPositionFree = (x: number, y: number, w: number, h: number) => {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                if (occupied.has(`${x + dx},${y + dy}`)) return false;
            }
        }
        return true;
    };

    // Helper to mark position as occupied
    const markOccupied = (x: number, y: number, w: number, h: number) => {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                occupied.add(`${x + dx},${y + dy}`);
            }
        }
    };

    // Place each window in the first available spot
    for (const window of sortedWindows) {
        let placed = false;
        // Search for a spot starting from top-left
        // We search up to a reasonable height. 
        // In a packing algo, we shouldn't need to go much deeper than the current total height
        const maxSearchY = Math.max(
            ...packedWindows.map(w => w.y + w.h),
            ...sortedWindows.map(w => w.y + w.h)
        ) + window.h + 10;

        for (let y = 0; y < maxSearchY; y++) {
            for (let x = 0; x <= cols - window.w; x++) {
                if (isPositionFree(x, y, window.w, window.h)) {
                    packedWindows.push({
                        ...window,
                        x,
                        y
                    });
                    markOccupied(x, y, window.w, window.h);
                    placed = true;
                    break;
                }
            }
            if (placed) break;
        }

        // Fallback if no spot found (should be rare with dynamic height)
        if (!placed) {
            const lastY = Math.max(0, ...packedWindows.map(w => w.y + w.h));
            packedWindows.push({
                ...window,
                x: 0,
                y: lastY
            });
            markOccupied(0, lastY, window.w, window.h);
        }
    }

    return packedWindows;
}
