import { Loader2 } from 'lucide-react';

export default function FormsLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="h-9 w-32 animate-pulse rounded bg-gray-800" />
                        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-gray-800" />
                    </div>
                    <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-800" />
                </div>

                {/* Filters skeleton */}
                <div className="mb-6 flex gap-4">
                    <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-800" />
                    <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-800" />
                </div>

                {/* Cards skeleton */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-lg border border-gray-800 bg-gray-800/50 p-6"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-700" />
                                <div className="h-5 w-5 animate-pulse rounded bg-gray-700" />
                            </div>
                            <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-700" />
                            <div className="mb-4 space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-700" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading indicator */}
                <div className="mt-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-orange" aria-label="Loading forms" />
                </div>
            </div>
        </div>
    );
}
