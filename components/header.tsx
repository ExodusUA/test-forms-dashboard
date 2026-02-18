'use client'

import { useAuthStore } from '@/lib/store/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        setMobileMenuOpen(false);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                console.error('Logout failed:', result.error || 'Unknown error');
                return;
            }

            logout();
            router.push('/login');
        } catch (error) {
            console.error('Network error during logout:', error);
        }
    }

    return (
        <header className="bg-gray-900 border-b border-gray-800">
            <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" aria-label="Main navigation">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2" aria-label="Forms Dashboard Home">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-orange">
                                <span className="text-lg font-bold text-white" aria-hidden="true">F</span>
                            </div>
                            <span className="hidden text-xl font-semibold text-white sm:inline">Forms Dashboard</span>
                            <span className="text-xl font-semibold text-white sm:hidden">Forms</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="items-center hidden space-x-4 md:flex">
                        {!mounted ? (
                            // Placeholder during hydration
                            <div className="w-20 h-10 bg-gray-800 rounded-lg animate-pulse" />
                        ) : isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none"
                                    aria-label="Go to dashboard"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 focus:outline-none"
                                    aria-label="Log out from your account"
                                >
                                    <LogOut className="w-4 h-4" aria-hidden="true" />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-brand-orange hover:bg-brand-orange-dark focus:outline-none"
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        {mounted && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="w-6 h-6" aria-hidden="true" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mounted && mobileMenuOpen && (
                    <div className="py-4 border-t border-gray-800 md:hidden">
                        <div className="flex flex-col space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-center text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none active:bg-gray-500"
                                        aria-label="Go to dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 focus:outline-none active:bg-gray-500"
                                        aria-label="Log out from your account"
                                    >
                                        <LogOut className="w-4 h-4" aria-hidden="true" />
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-sm font-medium text-center text-white transition-colors rounded-lg bg-brand-orange hover:bg-brand-orange-dark focus:outline-none active:opacity-90"
                                    aria-label="Sign in to your account"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
