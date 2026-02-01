import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Delete Item",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    type = "danger" // "danger" or "warning"
}) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
                {/* Header */}
                <div className="flex items-start gap-4 p-6 pb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                            type === 'danger' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 m-0 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 m-0">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-2">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                            type === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-yellow-600 hover:bg-yellow-700'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
