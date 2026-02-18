import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateFormForm } from '@/components/forms/create-form-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Form - Forms Dashboard',
    description: 'Create a new form for your organization',
};

export default function NewFormPage() {
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
                    <h1 className="text-3xl font-bold">Create New Form</h1>
                    <p className="mt-2 text-gray-400">
                        Fill in the details below to create a new form
                    </p>
                </div>
                <CreateFormForm />
            </div>
        </div>
    );
}
