'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData } from '@/lib/schemas/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ErrorMessage } from '@/components/ui/error-message';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
] as const;

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Something went wrong');
                return;
            }

            addToast('Form created!', 'success');
            router.push('/forms');
            router.refresh();
        } catch {
            setApiError('Could not create form. Please try again.');
            addToast('Failed to create form', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ErrorMessage message={apiError} />

            <FormField
                fieldType="input"
                label="Form Title"
                required
                error={errors.title?.message}
                disabled={isLoading}
                inputProps={{
                    id: 'title',
                    placeholder: 'Contact form, Survey, etc.',
                    ...register('title')
                }}
            />

            <FormField
                fieldType="textarea"
                label="Description"
                error={errors.description?.message}
                disabled={isLoading}
                textareaProps={{
                    id: 'description',
                    rows: 3,
                    placeholder: 'What is this form for?',
                    ...register('description')
                }}
            />

            <FormField
                fieldType="input"
                type="number"
                label="Fields"
                required
                error={errors.fieldsCount?.message}
                disabled={isLoading}
                inputProps={{
                    id: 'fieldsCount',
                    placeholder: '5',
                    min: 0,
                    max: 50,
                    ...register('fieldsCount', { valueAsNumber: true })
                }}
            />

            <FormField
                fieldType="select"
                label="Status"
                required
                error={errors.status?.message}
                disabled={isLoading}
                options={statusOptions}
                selectProps={{
                    id: 'status',
                    ...register('status')
                }}
            />

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => router.push('/forms')}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Creating...' : 'Create Form'}
                </Button>
            </div>
        </form>
    );
}
