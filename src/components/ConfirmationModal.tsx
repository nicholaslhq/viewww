import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-300">{message}</p>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800 bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded transition-colors shadow-lg shadow-red-900/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
