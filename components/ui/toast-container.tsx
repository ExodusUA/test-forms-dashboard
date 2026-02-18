'use client';

import { useToastStore } from '@/lib/store/toast';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
    };

    const styles = {
        success: 'bg-green-900/90 border-green-800 text-green-200',
        error: 'bg-red-900/90 border-red-800 text-red-200',
        info: 'bg-blue-900/90 border-blue-800 text-blue-200',
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md" role="region" aria-label="Notifications">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${styles[toast.type]}`}
                        role="alert"
                        aria-live="polite"
                    >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 rounded p-1 transition-colors hover:bg-white/10"
                            aria-label="Close notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
