import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor,
    Plus,
    Pencil,
    Copy,
    Trash2,
    ChevronLeft
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onEditProfile: (id: string, name: string) => void;
    onDeleteProfile: (id: string) => void;
}

export function Sidebar({ isOpen, setIsOpen, onEditProfile, onDeleteProfile }: SidebarProps) {
    const {
        profiles,
        activeProfileId,
        setActiveProfile,
        addProfile,
        duplicateProfile
    } = useStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleStartEdit = (e: React.MouseEvent, profile: { id: string, name: string }) => {
        e.stopPropagation();
        setEditingId(profile.id);
        setEditName(profile.name);
    };

    const handleSaveEdit = () => {
        if (editingId && editName.trim()) {
            onEditProfile(editingId, editName.trim());
        }
        setEditingId(null);
        setEditName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveEdit();
        if (e.key === 'Escape') setEditingId(null);
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.div
                className={`
          fixed md:relative z-50 h-full
          bg-white/80 dark:bg-gray-950/80 backdrop-blur-md
          border-r border-gray-200 dark:border-gray-800
          flex flex-col overflow-hidden
        `}
                initial={false}
                animate={{
                    width: isOpen ? 280 : 0,
                    x: isOpen ? 0 : 0 // On mobile we might want to slide out, but for now keeping it simple
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex flex-col h-full overflow-hidden w-[280px]">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                            <Monitor className="w-6 h-6" />
                            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Viewww</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    {/* Profiles List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profiles</span>
                            <button
                                onClick={() => addProfile(`Profile ${profiles.length + 1}`)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="New Profile"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {profiles.map(profile => (
                            <div
                                key={profile.id}
                                onClick={() => setActiveProfile(profile.id)}
                                className={`
                  group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all
                  ${activeProfileId === profile.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400'
                                    }
                `}
                            >
                                {editingId === profile.id ? (
                                    <input
                                        autoFocus
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyDown={handleKeyDown}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 bg-transparent border border-blue-500 rounded px-1 py-0.5 text-sm outline-none min-w-0"
                                    />
                                ) : (
                                    <>
                                        <span className="truncate text-sm font-medium flex-1">{profile.name}</span>

                                        {/* Profile Actions */}
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                            <button
                                                onClick={(e) => handleStartEdit(e, profile)}
                                                className="p-1 hover:text-blue-500 transition-colors"
                                                title="Rename"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    duplicateProfile(profile.id);
                                                }}
                                                className="p-1 hover:text-green-500 transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy size={12} />
                                            </button>
                                            {profiles.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteProfile(profile.id);
                                                    }}
                                                    className="p-1 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <ThemeToggle />
                    </div>
                </div>
            </motion.div>
        </>
    );
}
