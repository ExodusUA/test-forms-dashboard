import Link from 'next/link';
import { FileX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <FileX className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Form Not Found</h1>
                <p className="text-gray-400 mb-6">
                    The form you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/forms"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange-dark"
                >
                    Back to Forms
                </Link>
            </div>
        </div>
    );
}
