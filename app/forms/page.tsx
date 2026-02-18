import { FileText } from 'lucide-react';
import { getAllForms, type FormStatus } from '@/lib/forms/forms-service';
import { NewFormButton } from '@/components/forms/new-form-button';
import { FormCard } from '@/components/forms/form-card';
import { AccessDeniedHandler } from '@/components/access-denied-handler';
import { FormsFilters } from '@/components/forms/forms-filters';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{
    status?: FormStatus;
    sort?: string;
}>;

interface FormsPageProps {
    searchParams: SearchParams;
}

export default async function FormsPage({ searchParams }: FormsPageProps) {
    const params = await searchParams;
    const status = params.status || 'all';
    const sort = params.sort || 'updatedAt-desc';

    // Parse sort parameter
    const [sortBy, sortOrder] = sort.split('-') as [
        'updatedAt' | 'createdAt' | 'title',
        'asc' | 'desc',
    ];

    const forms = await getAllForms({
        status,
        sortBy,
        sortOrder,
    });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
            <AccessDeniedHandler />
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Forms</h1>
                        <p className="mt-2 text-gray-400">
                            Manage and track all your forms
                        </p>
                    </div>
                    <NewFormButton />
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <FormsFilters />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {forms.map((form) => (
                        <FormCard key={form.id} form={form} />
                    ))}
                </div>


                {forms.length === 0 && (
                    <div className="py-12 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" aria-hidden="true" />
                        <p className="mb-4 text-gray-400">No forms found</p>
                        <p className="text-sm text-gray-500">
                            Try adjusting your filters or create a new form
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}