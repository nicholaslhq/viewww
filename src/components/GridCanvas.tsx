import React, { useEffect, useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { useStore } from '../store/useStore';
import { WindowFrame } from './WindowFrame';
import { windowsToGridLayout, mergeGridLayoutToWindows, ensureProfileId } from '../utils/layout';
import { GRID_CONFIG } from '../constants';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const GridCanvas: React.FC = React.memo(() => {
    const { activeProfileId, profiles, updateProfileLayout } = useStore();
    const [mounted, setMounted] = useState(false);

    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    const layout = activeProfile?.layout || [];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fix existing windows that don't have profileId set
    useEffect(() => {
        if (!activeProfileId || !activeProfile) return;

        const needsUpdate = activeProfile.layout.some(w => !w.profileId);
        if (needsUpdate) {
            const updatedLayout = ensureProfileId(activeProfile.layout, activeProfileId);
            updateProfileLayout(activeProfileId, updatedLayout);
        }
    }, [activeProfileId, activeProfile, updateProfileLayout]);

    // Transform WindowItem[] to react-grid-layout's Layout[]
    const gridLayout = windowsToGridLayout(layout);

    const handleLayoutChange = useCallback((currentLayout: Layout[]) => {
        if (!activeProfileId) return;

        // Merge grid layout changes back to WindowItem format
        const newLayout = mergeGridLayoutToWindows(currentLayout, layout, activeProfileId);
        updateProfileLayout(activeProfileId, newLayout);
    }, [activeProfileId, layout, updateProfileLayout]);

    if (!mounted) return null;

    return (
        <div className="w-full h-full overflow-auto bg-transparent p-4">
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: gridLayout }}
                breakpoints={GRID_CONFIG.breakpoints}
                cols={GRID_CONFIG.cols}
                rowHeight={GRID_CONFIG.rowHeight}
                draggableHandle=".drag-handle"
                onLayoutChange={handleLayoutChange}
                margin={GRID_CONFIG.margin}
                compactType={null}
            >
                {layout.map((window) => (
                    <div key={window.id}>
                        <WindowFrame window={window} className="h-full w-full" />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
});

GridCanvas.displayName = 'GridCanvas';

