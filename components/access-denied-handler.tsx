'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToastStore } from '@/lib/store/toast';

export function AccessDeniedHandler() {
    const searchParams = useSearchParams();
    const addToast = useToastStore((state) => state.addToast);

    useEffect(() => {
        const error = searchParams.get('error');

        if (error === 'admin_required') {
            addToast('You do not have permission to access this page', 'error');

            // Clean URL (remove query params)
            window.history.replaceState({}, '', '/forms');
        }
    }, [searchParams, addToast]);

    return null;
}
