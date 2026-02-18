'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData, type Form } from '@/lib/schemas/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';
import { Button } from '@/components/ui/button';

interface EditFormFormProps {
    form: Form;
}

export function EditFormForm({ form }: EditFormFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const router = useRouter();
    const addToast = useToastStore((state) => state.addToast);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: form.title,
            description: form.description || '',
            fieldsCount: form.fieldsCount,
            status: form.status,
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch(`/api/forms/${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Failed to update form');
                return;
            }

            addToast('Form updated successfully!', 'success');

            await router.push('/forms');
            router.refresh();
        } catch {
            setApiError('Network error. Please try again.');
            addToast('Network error. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        setApiError(null);

        try {
            const response = await fetch(`/api/forms/${form.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Failed to delete form');
                return;
            }

            addToast('Form deleted successfully!', 'success');

            // Navigate first, then refresh will happen automatically
            await router.push('/forms');
            router.refresh();
        } catch {
            setApiError('Network error. Please try again.');
            addToast('Network error. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
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
                        disabled={isLoading || isDeleting}
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
                        disabled={isLoading || isDeleting}
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
                        disabled={isLoading || isDeleting}
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
                        disabled={isLoading || isDeleting}
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="danger"
                            size="md"
                            onClick={onDelete}
                            isLoading={isDeleting}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? 'Deleting...' : 'Delete Form'}
                        </Button>

                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => router.push('/forms')}
                                disabled={isLoading || isDeleting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isLoading}
                                disabled={isDeleting}
                                className="w-full sm:w-auto"
                            >
                                <Save className="w-4 h-4" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
