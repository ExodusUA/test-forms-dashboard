'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
];

const sortOptions = [
    { value: 'updatedAt-desc', label: 'Last Updated' },
    { value: 'updatedAt-asc', label: 'Oldest Updated' },
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
];

export function FormsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentStatus = searchParams.get('status') || 'all';
    const currentSort = searchParams.get('sort') || 'updatedAt-desc';

    const handleFilterChange = (type: 'status' | 'sort', value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (type === 'status') {
            if (value === 'all') {
                params.delete('status');
            } else {
                params.set('status', value);
            }
        } else {
            params.set('sort', value);
        }

        router.push(`/forms?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <label htmlFor="status-filter" className="sr-only">
                    Filter by status
                </label>
                <select
                    id="status-filter"
                    value={currentStatus}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 pr-8 text-sm text-white transition-colors focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
                    aria-label="Filter forms by status"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="sr-only">
                    Sort forms
                </label>
                <select
                    id="sort-select"
                    value={currentSort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 pr-8 text-sm text-white transition-colors focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
                    aria-label="Sort forms"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
