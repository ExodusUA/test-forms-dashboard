'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
            {apiError && (
                <div className="p-3 border border-red-800 rounded-md bg-red-900/50">
                    <p className="text-sm text-red-200">{apiError}</p>
                </div>
            )}

            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-200">
                    Role
                </label>
                <select
                    id="role"
                    {...register('role')}
                    className={`block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`}
                    disabled={isLoading}
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
                {errors.role && (
                    <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
                )}
            </div>

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
