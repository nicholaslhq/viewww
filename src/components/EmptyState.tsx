import { motion } from 'framer-motion';
import { Plus, LayoutGrid } from 'lucide-react';

interface EmptyStateProps {
    onAddWindow: () => void;
}

export function EmptyState({ onAddWindow }: EmptyStateProps) {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <LayoutGrid className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Start your view
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    This profile is empty. Add your first window to start monitoring your favorite content.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddWindow}
                    className="
            inline-flex items-center gap-2 px-6 py-3 
            bg-blue-600 hover:bg-blue-500 text-white 
            rounded-xl shadow-xl shadow-blue-600/20 
            font-medium transition-colors
          "
                >
                    <Plus size={20} />
                    Add First Window
                </motion.button>
            </motion.div>
        </div>
    );
}
