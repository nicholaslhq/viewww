import { Layout, Plus, Sparkles, Undo2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface TopBarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    activeProfileName?: string;
    onAddWindow: () => void;
}

export function TopBar({ isSidebarOpen, setIsSidebarOpen, activeProfileName, onAddWindow }: TopBarProps) {
    const smartSortLayout = useStore((state) => state.smartSortLayout);
    const undoSmartSort = useStore((state) => state.undoSmartSort);
    const isUndoAvailable = useStore((state) => state.isUndoAvailable);
    const profiles = useStore((state) => state.profiles);
    const activeProfileId = useStore((state) => state.activeProfileId);

    // Get active profile's window count
    const activeProfile = profiles.find(p => p.id === activeProfileId);
    const hasWindows = (activeProfile?.layout.length ?? 0) > 0;

    return (
        <div className="h-14 flex items-center justify-between px-4 md:px-6 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors"
                >
                    <Layout size={20} />
                </button>

                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Active View</span>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {activeProfileName || 'No Profile Selected'}
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isUndoAvailable ? (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={undoSmartSort}
                        className="
                            flex items-center gap-2 px-3 py-2 
                            text-orange-600 dark:text-orange-400 
                            bg-orange-50 dark:bg-orange-900/20
                            hover:bg-orange-100 dark:hover:bg-orange-900/40
                            rounded-xl text-sm font-medium transition-colors
                        "
                        title="Undo Sort"
                    >
                        <Undo2 size={18} />
                        <span className="hidden md:inline">Undo</span>
                    </motion.button>
                ) : hasWindows ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={smartSortLayout}
                        className="
                            flex items-center gap-2 px-3 py-2 
                            text-indigo-600 dark:text-indigo-400 
                            bg-indigo-50 dark:bg-indigo-900/20
                            hover:bg-indigo-100 dark:hover:bg-indigo-900/40
                            rounded-xl text-sm font-medium transition-colors
                        "
                        title="Smart Sort"
                    >
                        <Sparkles size={18} />
                        <span className="hidden md:inline">Smart Sort</span>
                    </motion.button>
                ) : null}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddWindow}
                    className="
          flex items-center gap-2 px-4 py-2 
          bg-blue-600 hover:bg-blue-500 text-white 
          rounded-xl shadow-lg shadow-blue-600/20 
          text-sm font-medium transition-colors
        "
                >
                    <Plus size={16} />
                    <span className="hidden md:inline">Add Window</span>
                </motion.button>
            </div>
        </div>
    );
}
