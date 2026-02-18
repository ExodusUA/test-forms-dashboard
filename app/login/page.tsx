import LoginForm from '@/components/forms/login-form';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Forms Dashboard',
    description: 'Sign in to your Forms Dashboard account',
};

export default function LoginPage() {
    return (
        <section className='h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900 text-white'>
            <div className='w-full max-w-md justify-center'>
                <h1 className='text-2xl font-bold text-center'>Login</h1>
                <p className='text-sm text-center text-gray-400'>Please enter your credentials to continue</p>
                <LoginForm />
            </div>
        </section>
    )
}
