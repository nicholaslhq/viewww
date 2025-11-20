import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { WindowItem, Profile } from '../types';
import { calculateDefaultWindowSize } from '../utils/responsive';
import { findNextAvailablePosition } from '../utils/layout';
import { STORAGE_KEYS, GRID_CONFIG } from '../constants';

/**
 * Application state interface
 */
interface AppState {
    // State
    profiles: Profile[];
    activeProfileId: string | null;
    theme: 'light' | 'dark' | 'system';

    // Profile Actions
    addProfile: (name: string) => void;
    removeProfile: (id: string) => void;
    setActiveProfile: (id: string) => void;
    updateProfileLayout: (profileId: string, layout: WindowItem[]) => void;
    updateProfileName: (id: string, name: string) => void;
    duplicateProfile: (id: string) => void;

    // Window Actions
    addWindow: (url: string, w?: number, h?: number) => void;
    removeWindow: (windowId: string) => void;
    updateWindow: (windowId: string, updates: Partial<WindowItem>, profileId?: string) => void;

    // Theme Actions
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * Global application store using Zustand
 */
export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // ==================== State ====================
            profiles: [],
            activeProfileId: null,
            theme: 'system',

            // ==================== Profile Actions ====================

            /**
             * Creates a new profile and sets it as active
             * @param name - Name for the new profile
             */
            addProfile: (name) => {
                const newProfile: Profile = {
                    id: uuidv4(),
                    name,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    layout: [],
                };
                set((state) => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: newProfile.id,
                }));
            },

            /**
             * Removes a profile by ID
             * If the removed profile is active, switches to the first available profile
             * @param id - Profile ID to remove
             */
            removeProfile: (id) => {
                set((state) => {
                    const newProfiles = state.profiles.filter((p) => p.id !== id);
                    return {
                        profiles: newProfiles,
                        activeProfileId:
                            state.activeProfileId === id
                                ? (newProfiles[0]?.id || null)
                                : state.activeProfileId,
                    };
                });
            },

            /**
             * Sets the active profile
             * @param id - Profile ID to activate
             */
            setActiveProfile: (id) => set({ activeProfileId: id }),

            /**
             * Updates the layout of a specific profile
             * @param profileId - Profile ID to update
             * @param layout - New layout configuration
             */
            updateProfileLayout: (profileId, layout) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === profileId
                            ? { ...p, layout, updatedAt: Date.now() }
                            : p
                    ),
                }));
            },

            /**
             * Updates a profile's name
             * @param id - Profile ID to update
             * @param name - New profile name
             */
            updateProfileName: (id, name) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === id
                            ? { ...p, name, updatedAt: Date.now() }
                            : p
                    ),
                }));
            },

            /**
             * Duplicates an existing profile with all its windows
             * @param id - Profile ID to duplicate
             */
            duplicateProfile: (id) => {
                const { profiles } = get();
                const profileToDuplicate = profiles.find((p) => p.id === id);
                if (!profileToDuplicate) return;

                const newProfileId = uuidv4();
                const newProfile: Profile = {
                    ...profileToDuplicate,
                    id: newProfileId,
                    name: `Copy of ${profileToDuplicate.name}`,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    // Deep copy layout to avoid reference issues
                    layout: profileToDuplicate.layout.map(w => ({
                        ...w,
                        id: uuidv4(),
                        profileId: newProfileId,
                    })),
                };

                set((state) => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: newProfile.id,
                }));
            },

            // ==================== Window Actions ====================

            /**
             * Adds a new window to the active profile
             * Window size is calculated based on screen width if not provided
             * @param url - URL to display in the window
             * @param w - Optional custom width
             * @param h - Optional custom height
             */
            addWindow: (url, w?, h?) => {
                const { activeProfileId, profiles } = get();
                if (!activeProfileId) return;

                const activeProfile = profiles.find((p) => p.id === activeProfileId);
                if (!activeProfile) return;

                // Calculate responsive defaults using utility function
                const { w: defaultW, h: defaultH } = calculateDefaultWindowSize(
                    typeof window !== 'undefined' ? window.innerWidth : 1200,
                    w,
                    h
                );

                // Find the first available position
                // We use the 'lg' breakpoint column count (12) as the default grid width
                // This ensures consistent positioning logic
                const { x, y } = findNextAvailablePosition(
                    activeProfile.layout,
                    defaultW,
                    defaultH,
                    GRID_CONFIG.cols.lg
                );

                const newWindow: WindowItem = {
                    id: uuidv4(),
                    url,
                    title: 'New Window',
                    x,
                    y,
                    w: defaultW,
                    h: defaultH,
                    profileId: activeProfileId,
                };

                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === activeProfileId
                            ? { ...p, layout: [...p.layout, newWindow], updatedAt: Date.now() }
                            : p
                    ),
                }));
            },

            /**
             * Removes a window from the active profile
             * @param windowId - Window ID to remove
             */
            removeWindow: (windowId) => {
                const { activeProfileId } = get();
                if (!activeProfileId) return;

                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === activeProfileId
                            ? {
                                ...p,
                                layout: p.layout.filter((w) => w.id !== windowId),
                                updatedAt: Date.now()
                            }
                            : p
                    ),
                }));
            },

            /**
             * Updates properties of a specific window
             * @param windowId - Window ID to update
             * @param updates - Partial window properties to update
             * @param profileId - Optional profile ID (defaults to active profile)
             */
            updateWindow: (windowId, updates, profileId?) => {
                const { activeProfileId } = get();
                // Use provided profileId or fall back to activeProfileId
                const targetProfileId = profileId || activeProfileId;
                if (!targetProfileId) return;

                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === targetProfileId
                            ? {
                                ...p,
                                layout: p.layout.map((w) =>
                                    w.id === windowId ? { ...w, ...updates } : w
                                ),
                                updatedAt: Date.now(),
                            }
                            : p
                    ),
                }));
            },

            // ==================== Theme Actions ====================

            /**
             * Sets the application theme
             * @param theme - Theme mode
             */
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: STORAGE_KEYS.viewwwStorage,
        }
    )
);
