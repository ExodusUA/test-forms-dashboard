import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditFormLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/forms"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
                        aria-label="Back to forms"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back to Forms
                    </Link>
                    <div className="h-9 w-48 animate-pulse rounded bg-gray-800 mb-2" />
                    <div className="h-5 w-64 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-5 w-32 animate-pulse rounded bg-gray-800" />
                            <div className="h-10 w-full animate-pulse rounded-md bg-gray-800" />
                        </div>
                    ))}
                    <div className="flex items-center gap-4 pt-4">
                        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-800" />
                        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-800" />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-orange" aria-label="Loading form details" />
                </div>
            </div>
        </div>
    );
}
