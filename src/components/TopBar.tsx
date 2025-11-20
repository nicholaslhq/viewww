import { Layout, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopBarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    activeProfileName?: string;
    onAddWindow: () => void;
}

export function TopBar({ isSidebarOpen, setIsSidebarOpen, activeProfileName, onAddWindow }: TopBarProps) {
    return (
        <div className="h-16 flex items-center justify-between px-4 md:px-6 z-30">
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
    );
}
