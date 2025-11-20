/**
 * Custom hook for managing scroll position persistence via iframe messaging
 */

import { useEffect, useRef } from 'react';
import type { IFrameMessage, ScrollUpdateMessage } from '../types';

interface UseScrollPersistenceProps {
    windowId: string;
    scrollX?: number;
    scrollY?: number;
    profileId?: string;
    onScrollUpdate: (windowId: string, scrollX: number, scrollY: number, profileId?: string) => void;
}

/**
 * Manages scroll position persistence for an iframe window
 */
export function useScrollPersistence({
    windowId,
    scrollX = 0,
    scrollY = 0,
    profileId,
    onScrollUpdate,
}: UseScrollPersistenceProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        const handleMessage = (event: MessageEvent<IFrameMessage>) => {
            if (!event.data) return;

            // Ignore messages if component is unmounting or unmounted
            if (!isMountedRef.current) return;

            // Only process messages from our own iframe
            if (event.source !== iframeRef.current?.contentWindow) return;

            if (event.data.type === 'SCROLL_UPDATE') {
                const scrollData = event.data as ScrollUpdateMessage;
                // Only process scroll updates that match our window ID
                if (scrollData.windowId === windowId) {
                    onScrollUpdate(windowId, scrollData.scrollX, scrollData.scrollY, profileId);
                }
            } else if (event.data.type === 'PROXY_FRAME_READY') {
                // Restore scroll position when iframe is ready
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                        {
                            type: 'RESTORE_SCROLL',
                            windowId,
                            scrollX,
                            scrollY,
                        },
                        '*'
                    );
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            isMountedRef.current = false;
            window.removeEventListener('message', handleMessage);
        };
    }, [windowId, scrollX, scrollY, profileId, onScrollUpdate]);

    return iframeRef;
}
