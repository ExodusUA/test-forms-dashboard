'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useEffect, useState } from 'react';

export function NewFormButton() {
    const [mounted, setMounted] = useState(false);
    const isAdmin = useAuthStore((state) => state.isAdmin());

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href="/forms/new"
            className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Create new form"
        >
            <Plus className="h-5 w-5" aria-hidden="true" />
            New Form
        </Link>
    );
}
