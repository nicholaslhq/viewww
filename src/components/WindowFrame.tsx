import React from 'react';
import { X, RefreshCw, GripHorizontal, Loader2 } from 'lucide-react';
import type { WindowItem } from '../types';
import { useStore } from '../store/useStore';
import { useWindowMetadata } from '../hooks/useWindowMetadata';
import { useScrollPersistence } from '../hooks/useScrollPersistence';
import { buildProxyUrl } from '../utils/url';
import { PROXY_ENDPOINT } from '../constants';

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
        const [isLoading, setIsLoading] = React.useState(true);

        // Build proxy URL
        const proxyUrl = buildProxyUrl(PROXY_ENDPOINT, window.url, window.id);

        // Use custom hook for metadata fetching
        useWindowMetadata({
            url: window.url,
            windowId: window.id,
            currentTitle: window.title,
            profileId: window.profileId,
            onTitleUpdate: (windowId, title, profileId) => {
                updateWindow(windowId, { title }, profileId);
            },
        });

        // Use custom hook for scroll persistence
        const iframeRef = useScrollPersistence({
            windowId: window.id,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            profileId: window.profileId,
            onScrollUpdate: (windowId, scrollX, scrollY, profileId) => {
                updateWindow(windowId, { scrollX, scrollY }, profileId);
            },
        });

        const handleRefresh = () => {
            setIsLoading(true);
            setRefreshKey((prev) => prev + 1);
        };

        return (
            <div
                ref={ref}
                style={style}
                className={`
                    group flex flex-col 
                    bg-white dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700 
                    rounded-xl overflow-hidden 
                    shadow-xl dark:shadow-black/50 
                    ${className}
                `}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchEnd={onTouchEnd}
                {...props}
            >
                {/* Header */}
                <div className="
                    h-9 
                    bg-gray-50 dark:bg-gray-800 
                    flex items-center justify-between 
                    border-b border-gray-200 dark:border-gray-700
                ">
                    {/* Drag Handle - Title Section */}
                    <div className="
                        drag-handle 
                        flex items-center gap-2 overflow-hidden flex-1
                        cursor-grab active:cursor-grabbing select-none
                        px-3 h-full
                    ">
                        <GripHorizontal size={16} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium" title={window.title || window.url}>
                            {window.title || window.url}
                        </span>
                    </div>

                    {/* Buttons - Outside Drag Handle */}
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity px-3">
                        <button
                            onClick={handleRefresh}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={12} />
                        </button>
                        <button
                            onClick={() => removeWindow(window.id)}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Close"
                        >
                            <X size={12} />
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
                        onLoad={() => setIsLoading(false)}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

WindowFrame.displayName = 'WindowFrame';

