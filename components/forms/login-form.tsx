'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ErrorMessage } from '@/components/ui/error-message';

const roles = [
    { value: 'individual', label: 'Individual' },
    { value: 'admin', label: 'Admin' },
] as const;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            role: 'individual',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setApiError(result.error || 'Login failed. Please try again.');
                return;
            }

            login(result.user, result.token);

            router.push('/dashboard');
        } catch {
            setApiError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mt-8 space-y-6">
            <ErrorMessage message={apiError} />

            <FormField
                fieldType="input"
                type="email"
                label="Email"
                error={errors.email?.message}
                disabled={isLoading}
                inputProps={{
                    id: 'email',
                    placeholder: 'you@example.com',
                    ...register('email')
                }}
            />

            <FormField
                fieldType="select"
                label="Role"
                error={errors.role?.message}
                disabled={isLoading}
                options={roles}
                selectProps={{
                    id: 'role',
                    ...register('role')
                }}
            />

            <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}
