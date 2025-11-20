import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const tabs = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'system', icon: Monitor, label: 'System' },
    ] as const;

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-full relative border border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => {
                    const isActive = theme === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setTheme(tab.id)}
                            className={`
                relative z-10 flex-1 flex items-center justify-center py-1.5 
                text-sm font-medium transition-colors duration-200
                ${isActive
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }
              `}
                            title={tab.label}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="theme-active-indicator"
                                    className="absolute inset-0 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon size={14} />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
