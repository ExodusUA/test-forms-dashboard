import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EditFormForm } from '@/components/forms/edit-form-form';
import { getFormById } from '@/lib/forms/forms-service';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force dynamic rendering to always get fresh data from in-memory store
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const form = await getFormById(id);
        return {
            title: `Edit ${form.title} - Forms Dashboard`,
            description: form.description || 'Edit form details',
        };
    } catch {
        return {
            title: 'Form Not Found - Forms Dashboard',
        };
    }
}

export default async function EditFormPage({ params }: Props) {
    const { id } = await params;

    let form;
    try {
        form = await getFormById(id);
    } catch {
        notFound();
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <Link
                        href="/forms"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Forms
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Form</h1>
                    <p className="mt-2 text-gray-400">
                        Update the form details below
                    </p>
                </div>
                <EditFormForm form={form} />
            </div>
        </div>
    );
}
