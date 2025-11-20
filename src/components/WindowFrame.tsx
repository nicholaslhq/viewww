import React from 'react';
import { X, RefreshCw, GripHorizontal } from 'lucide-react';
import type { WindowItem } from '../store/useStore';
import { useStore } from '../store/useStore';

interface WindowFrameProps {
    window: WindowItem;
    style?: React.CSSProperties;
    className?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    onTouchEnd?: React.TouchEventHandler;
}

export const WindowFrame = React.forwardRef<HTMLDivElement, WindowFrameProps>(
    ({ window, style, className, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
        const removeWindow = useStore((state) => state.removeWindow);
        const updateWindow = useStore((state) => state.updateWindow);
        const [refreshKey, setRefreshKey] = React.useState(0);
        const iframeRef = React.useRef<HTMLIFrameElement>(null);

        // Proxy URL construction
        // For development, we'll assume the proxy is running locally on port 3001
        // Include windowId in URL so iframe knows its identity immediately
        const proxyUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(window.url)}&windowId=${encodeURIComponent(window.id)}`;

        React.useEffect(() => {
            if (!window.url) return;

            const fetchMetadata = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/proxy/metadata?url=${encodeURIComponent(window.url)}`);
                    if (!response.ok) return;

                    const data = await response.json();
                    if (data.title && data.title !== window.title) {
                        updateWindow(window.id, { title: data.title }, window.profileId);
                    }
                } catch (error) {
                    console.error('Failed to fetch metadata:', error);
                }
            };

            fetchMetadata();
        }, [window.url, window.id, window.profileId, updateWindow]);

        React.useEffect(() => {
            const isMounted = { current: true };

            const handleMessage = (event: MessageEvent) => {
                if (!event.data) return;

                // Ignore messages if component is unmounting or unmounted
                if (!isMounted.current) {
                    return;
                }

                // Only process messages from our own iframe
                if (event.source !== iframeRef.current?.contentWindow) {
                    return;
                }

                if (event.data.type === 'SCROLL_UPDATE') {
                    // Only process scroll updates that match our window ID
                    if (event.data.windowId === window.id) {
                        updateWindow(window.id, {
                            scrollX: event.data.scrollX,
                            scrollY: event.data.scrollY
                        }, window.profileId);
                    }
                } else if (event.data.type === 'PROXY_FRAME_READY') {
                    // Restore scroll position and send windowId
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({
                            type: 'RESTORE_SCROLL',
                            windowId: window.id,
                            scrollX: window.scrollX || 0,
                            scrollY: window.scrollY || 0
                        }, '*');
                    }
                }
            };

            globalThis.addEventListener('message', handleMessage);

            return () => {
                isMounted.current = false;
                globalThis.removeEventListener('message', handleMessage);
            };
        }, [window.id, window.scrollX, window.scrollY, window.profileId, updateWindow]);

        const handleRefresh = () => {
            setRefreshKey((prev) => prev + 1);
        };

        return (
            <div
                ref={ref}
                style={style}
                className={`flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg ${className}`}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchEnd={onTouchEnd}
                {...props}
            >
                {/* Header / Drag Handle */}
                <div className="drag-handle h-8 bg-gray-800 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing select-none border-b border-gray-700">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <GripHorizontal size={16} className="text-gray-500" />
                        <span className="text-xs text-gray-300 truncate font-medium" title={window.url}>
                            {window.title || window.url}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleRefresh}
                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button
                            onClick={() => removeWindow(window.id)}
                            className="p-1 hover:bg-red-900/50 rounded text-gray-400 hover:text-red-400 transition-colors"
                            title="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative bg-white">
                    <iframe
                        ref={iframeRef}
                        key={`${window.id}-${refreshKey}`}
                        src={proxyUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        title={window.title}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                    {/* Overlay to capture clicks during dragging (optional optimization, handled by grid layout usually) */}
                </div>
            </div>
        );
    }
);

WindowFrame.displayName = 'WindowFrame';
