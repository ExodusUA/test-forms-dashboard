'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData, type Form } from '@/lib/schemas/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ErrorMessage } from '@/components/ui/error-message';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
] as const;

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Update failed');
                addToast(result.error || 'Could not save changes', 'error');
                return;
            }

            addToast('Changes saved', 'success');
            router.push('/forms');
            router.refresh();
        } catch {
            const message = 'Failed to update form';
            setApiError(message);
            addToast(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        if (!confirm('Delete this form? This cannot be undone.')) {
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
                setApiError(result.error || 'Could not delete form');
                addToast('Deletion failed', 'error');
                return;
            }

            addToast('Form deleted', 'success');
            router.push('/forms');
            router.refresh();
        } catch {
            const msg = 'Something went wrong';
            setApiError(msg);
            addToast(msg, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ErrorMessage message={apiError} />

                <FormField
                    fieldType="input"
                    label="Title"
                    required
                    error={errors.title?.message}
                    disabled={isLoading || isDeleting}
                    inputProps={{
                        id: 'title',
                        placeholder: 'e.g. Customer Feedback Form',
                        ...register('title')
                    }}
                />

                <FormField
                    fieldType="textarea"
                    label="Description"
                    error={errors.description?.message}
                    disabled={isLoading || isDeleting}
                    textareaProps={{
                        id: 'description',
                        rows: 5,
                        ...register('description')
                    }}
                />

                <div>
                    <FormField
                        fieldType="input"
                        type="number"
                        label="Number of fields"
                        required
                        error={errors.fieldsCount?.message}
                        disabled={isLoading || isDeleting}
                        inputProps={{
                            id: 'fieldsCount',
                            min: 0,
                            max: 50,
                            ...register('fieldsCount', { valueAsNumber: true })
                        }}
                    />
                    <p className="mt-1 text-xs text-gray-400">Between 0 and 50</p>
                </div>

                <FormField
                    fieldType="select"
                    label="Status"
                    required
                    error={errors.status?.message}
                    disabled={isLoading || isDeleting}
                    options={statusOptions}
                    selectProps={{
                        id: 'status',
                        ...register('status')
                    }}
                />

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
