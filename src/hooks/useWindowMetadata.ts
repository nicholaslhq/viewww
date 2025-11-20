/**
 * Custom hook for fetching and managing window metadata (title)
 */

import { useEffect } from 'react';
import { PROXY_METADATA_ENDPOINT } from '../constants';

interface UseWindowMetadataProps {
    url: string;
    windowId: string;
    currentTitle: string;
    profileId?: string;
    onTitleUpdate: (windowId: string, title: string, profileId?: string) => void;
}

/**
 * Fetches metadata (title) for a window and updates it
 */
export function useWindowMetadata({
    url,
    windowId,
    currentTitle,
    profileId,
    onTitleUpdate,
}: UseWindowMetadataProps): void {
    useEffect(() => {
        if (!url) return;

        const fetchMetadata = async () => {
            try {
                const response = await fetch(
                    `${PROXY_METADATA_ENDPOINT}?url=${encodeURIComponent(url)}`
                );

                if (!response.ok) return;

                const data = await response.json();
                if (data.title && data.title !== currentTitle) {
                    onTitleUpdate(windowId, data.title, profileId);
                }
            } catch (error) {
                // Silently fail - metadata fetching is not critical
                console.error('Failed to fetch metadata:', error);
            }
        };

        fetchMetadata();
    }, [url, windowId, currentTitle, profileId, onTitleUpdate]);
}
