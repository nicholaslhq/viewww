import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Loader2 } from 'lucide-react';
import { normalizeUrl } from '../utils/url';

interface AddWindowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (url: string) => void;
}

export function AddWindowModal({ isOpen, onClose, onAdd }: AddWindowModalProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setUrl('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);

        // Simulate a brief check or processing delay if needed, 
        // or just add immediately. For now, just adding.
        const normalized = normalizeUrl(url);
        onAdd(normalized);

        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 pointer-events-auto overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Add New Window
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="relative mb-6">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="
                        w-full pl-10 pr-4 py-3 
                        bg-gray-50 dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700 
                        rounded-xl text-gray-900 dark:text-white 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition-all
                      "
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!url.trim() || isLoading}
                                            className="
                        px-4 py-2 text-sm font-medium text-white 
                        bg-blue-600 hover:bg-blue-500 
                        rounded-xl shadow-lg shadow-blue-600/20 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2 transition-all
                      "
                                        >
                                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                                            Add Window
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
