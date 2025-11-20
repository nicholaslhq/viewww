import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { useStore } from '../store/useStore';
import { WindowFrame } from './WindowFrame';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const GridCanvas: React.FC = () => {
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
            const updatedLayout = activeProfile.layout.map(w => ({
                ...w,
                profileId: w.profileId || activeProfileId
            }));
            updateProfileLayout(activeProfileId, updatedLayout);
        }
    }, [activeProfileId, activeProfile, updateProfileLayout]);

    // Transform our WindowItem[] to react-grid-layout's Layout[]
    const gridLayout = layout.map((item) => ({
        i: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
    }));

    const handleLayoutChange = (currentLayout: Layout[]) => {
        if (!activeProfileId) return;

        // Map back to our WindowItem format
        // We need to preserve other properties like url and title
        const newLayout = currentLayout.map((l) => {
            const original = layout.find((w) => w.id === l.i);
            if (!original) return null;
            return {
                ...original,
                x: l.x,
                y: l.y,
                w: l.w,
                h: l.h,
                // Ensure profileId is always set (fix for existing windows)
                profileId: original.profileId || activeProfileId,
            };
        }).filter(Boolean) as any[];

        updateProfileLayout(activeProfileId, newLayout);
    };

    if (!mounted) return null;

    return (
        <div className="w-full h-full overflow-auto bg-gray-950 p-4">
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: gridLayout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}
                draggableHandle=".drag-handle"
                onLayoutChange={handleLayoutChange}
                margin={[10, 10]}
            >
                {layout.map((window) => (
                    <div key={window.id}>
                        <WindowFrame window={window} className="h-full w-full" />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};
