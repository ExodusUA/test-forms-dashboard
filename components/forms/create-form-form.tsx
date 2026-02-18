'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData } from '@/lib/schemas/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';
import { Button } from '@/components/ui/button';

export function CreateFormForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const router = useRouter();
    const addToast = useToastStore((state) => state.addToast);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            fieldsCount: 0,
            status: 'draft',
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch('/api/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Failed to create form');
                return;
            }

            addToast('Form created successfully!', 'success');

            await router.push('/forms');
            router.refresh(); // Refresh server component data
        } catch {
            setApiError('Network error. Please try again.');
            addToast('Network error. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {apiError && (
                <div className="p-3 border border-red-800 rounded-md bg-red-900/50">
                    <p className="text-sm text-red-200">{apiError}</p>
                </div>
            )}

            <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-200">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className={`block w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    placeholder="e.g. Customer Feedback Form"
                    disabled={isLoading}
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-200">
                    Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className={`block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    placeholder="Describe the purpose of this form..."
                    disabled={isLoading}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="fieldsCount" className="block mb-2 text-sm font-medium text-gray-200">
                    Number of Fields <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="fieldsCount"
                    {...register('fieldsCount', { valueAsNumber: true })}
                    className={`block w-full rounded-md border ${errors.fieldsCount ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    placeholder="0"
                    min="0"
                    max="50"
                    disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">Must be between 0 and 50</p>
                {errors.fieldsCount && (
                    <p className="mt-1 text-sm text-red-400">{errors.fieldsCount.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-200">
                    Status <span className="text-red-500">*</span>
                </label>
                <select
                    id="status"
                    {...register('status')}
                    className={`block w-full rounded-md border ${errors.status ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    disabled={isLoading}
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>
                {errors.status && (
                    <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Creating...' : 'Create Form'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => router.push('/forms')}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
