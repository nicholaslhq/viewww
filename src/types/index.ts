/**
 * Centralized TypeScript type definitions
 */

/**
 * Represents a window/widget in the grid layout
 */
export interface WindowItem {
    /** Unique identifier for the window */
    id: string;
    /** URL to display in the iframe */
    url: string;
    /** Display title for the window */
    title: string;
    /** Grid X position */
    x: number;
    /** Grid Y position */
    y: number;
    /** Grid width in units */
    w: number;
    /** Grid height in units */
    h: number;
    /** Horizontal scroll position */
    scrollX?: number;
    /** Vertical scroll position */
    scrollY?: number;
    /** ID of the profile this window belongs to */
    profileId?: string;
}

/**
 * Represents a profile containing a layout of windows
 */
export interface Profile {
    /** Unique identifier for the profile */
    id: string;
    /** Display name for the profile */
    name: string;
    /** Timestamp when profile was created */
    createdAt: number;
    /** Timestamp when profile was last updated */
    updatedAt: number;
    /** Array of windows in this profile */
    layout: WindowItem[];
}

/**
 * Message types for iframe communication
 */
export type IFrameMessageType =
    | 'SCROLL_UPDATE'
    | 'RESTORE_SCROLL'
    | 'PROXY_FRAME_READY';

/**
 * Scroll update message from iframe
 */
export interface ScrollUpdateMessage {
    type: 'SCROLL_UPDATE';
    windowId: string;
    scrollX: number;
    scrollY: number;
}

/**
 * Restore scroll message to iframe
 */
export interface RestoreScrollMessage {
    type: 'RESTORE_SCROLL';
    windowId: string;
    scrollX: number;
    scrollY: number;
}

/**
 * Frame ready message from iframe
 */
export interface ProxyFrameReadyMessage {
    type: 'PROXY_FRAME_READY';
}

/**
 * Union type for all iframe messages
 */
export type IFrameMessage =
    | ScrollUpdateMessage
    | RestoreScrollMessage
    | ProxyFrameReadyMessage;

/**
 * Window size configuration
 */
export interface WindowSize {
    w: number;
    h: number;
}

/**
 * Confirmation modal configuration
 */
export interface ConfirmationConfig {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
