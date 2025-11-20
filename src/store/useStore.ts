import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface WindowItem {
    id: string;
    url: string;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
    scrollX?: number;
    scrollY?: number;
    profileId?: string; // Track which profile this window belongs to
}

export interface Profile {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    layout: WindowItem[];
}

interface AppState {
    profiles: Profile[];
    activeProfileId: string | null;

    // Actions
    addProfile: (name: string) => void;
    removeProfile: (id: string) => void;
    setActiveProfile: (id: string) => void;
    updateProfileLayout: (profileId: string, layout: WindowItem[]) => void;

    addWindow: (url: string, w?: number, h?: number) => void;
    removeWindow: (windowId: string) => void;
    updateWindow: (windowId: string, updates: Partial<WindowItem>, profileId?: string) => void;

    updateProfileName: (id: string, name: string) => void;
    duplicateProfile: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            profiles: [],
            activeProfileId: null,

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

            removeProfile: (id) => {
                set((state) => {
                    const newProfiles = state.profiles.filter((p) => p.id !== id);
                    return {
                        profiles: newProfiles,
                        activeProfileId: state.activeProfileId === id ? (newProfiles[0]?.id || null) : state.activeProfileId,
                    };
                });
            },

            setActiveProfile: (id) => set({ activeProfileId: id }),

            updateProfileLayout: (profileId, layout) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === profileId ? { ...p, layout, updatedAt: Date.now() } : p
                    ),
                }));
            },

            addWindow: (url, w?, h?) => {
                const { activeProfileId } = get();
                if (!activeProfileId) return;

                // Calculate responsive defaults based on screen width
                let defaultW = w;
                let defaultH = h;

                if (defaultW === undefined || defaultH === undefined) {
                    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

                    // Determine default width and height based on breakpoints
                    if (screenWidth < 480) {
                        // Mobile: full width, tall
                        defaultW = defaultW ?? 2;
                        defaultH = defaultH ?? 8;
                    } else if (screenWidth < 768) {
                        // Small tablets: full width, tall
                        defaultW = defaultW ?? 4;
                        defaultH = defaultH ?? 8;
                    } else if (screenWidth < 996) {
                        // Tablets: half width, tall
                        defaultW = defaultW ?? 3;
                        defaultH = defaultH ?? 10;
                    } else {
                        // Desktop: narrower and taller for better content viewing
                        defaultW = defaultW ?? 4;
                        defaultH = defaultH ?? 10;
                    }
                }

                const newWindow: WindowItem = {
                    id: uuidv4(),
                    url,
                    title: 'New Window',
                    x: 0,
                    y: Infinity, // Puts it at the bottom
                    w: defaultW,
                    h: defaultH,
                    profileId: activeProfileId, // Track which profile owns this window
                };

                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === activeProfileId
                            ? { ...p, layout: [...p.layout, newWindow], updatedAt: Date.now() }
                            : p
                    ),
                }));
            },

            removeWindow: (windowId) => {
                const { activeProfileId } = get();
                if (!activeProfileId) return;

                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === activeProfileId
                            ? { ...p, layout: p.layout.filter((w) => w.id !== windowId), updatedAt: Date.now() }
                            : p
                    ),
                }));
            },

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
                                layout: p.layout.map((w) => (w.id === windowId ? { ...w, ...updates } : w)),
                                updatedAt: Date.now(),
                            }
                            : p
                    ),
                }));
            },

            updateProfileName: (id, name) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === id ? { ...p, name, updatedAt: Date.now() } : p
                    ),
                }));
            },

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
                        profileId: newProfileId  // Use the new profile's ID, not a random UUID
                    })),
                };

                set((state) => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: newProfile.id,
                }));
            },
        }),
        {
            name: 'viewww-storage',
        }
    )
);
