'use client';

import Link from 'next/link';
import { Calendar, FileText } from 'lucide-react';
import { Form } from '@/lib/schemas/form';
import { useAuthStore } from '@/lib/store/auth';
import { useEffect, useState } from 'react';

const statusColors = {
    draft: 'bg-yellow-900/50 text-yellow-200 border-yellow-800',
    active: 'bg-green-900/50 text-green-200 border-green-800',
    archived: 'bg-gray-700/50 text-gray-300 border-gray-600',
};

function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export function FormCard({ form }: { form: Form }) {
    const [mounted, setMounted] = useState(false);
    const isAdmin = useAuthStore((state) => state.isAdmin());

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = (
        <>
            <div className="flex items-center justify-between mb-4">
                <span
                    className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${statusColors[form.status as keyof typeof statusColors]
                        }`}
                    aria-label={`Form status: ${form.status}`}
                >
                    {form.status}
                </span>
                <FileText className="w-5 h-5 text-gray-500 transition-colors group-hover:text-brand-orange" aria-hidden="true" />
            </div>

            <h3 className="mb-4 text-lg font-semibold text-white line-clamp-2">
                {form.title}
            </h3>

            {form.description && (
                <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                    {form.description}
                </p>
            )}

            <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span aria-label={`Number of fields: ${form.fieldsCount}`}>
                        {form.fieldsCount} fields
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span aria-label={`Last updated: ${formatDate(form.updatedAt)}`}>
                        {formatDate(form.updatedAt)}
                    </span>
                </div>
            </div>
        </>
    );

    const baseClasses =
        'group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-800/50 p-6 transition-all';

    if (!mounted) {
        return (
            <div
                className={`${baseClasses} cursor-not-allowed opacity-75`}
                role="article"
                aria-label={`Form: ${form.title}`}
            >
                {content}
            </div>
        );
    }

    if (isAdmin) {
        return (
            <Link
                href={`/forms/${form.id}`}
                className={`${baseClasses} hover:border-brand-orange hover:bg-gray-800 cursor-pointer`}
                aria-label={`Edit form: ${form.title}`}
            >
                {content}
                {/* Admin indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 transition-transform scale-x-0 bg-brand-orange group-hover:scale-x-100" aria-hidden="true" />
            </Link>
        );
    }

    // Read-only card for non-admin users
    return (
        <div
            className={`${baseClasses} cursor-not-allowed opacity-75`}
            role="article"
            aria-label={`Form: ${form.title} (view only)`}
        >
            {content}
        </div>
    );
}
