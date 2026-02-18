import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-brand-orange/10">
                        <LayoutDashboard className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
                    <p className="mb-2 text-lg text-gray-400">
                        Coming Soon
                    </p>
                    <p className="text-sm text-gray-500">
                        In the meantime, you can view your forms
                    </p>
                </div>

                <Link
                    href="/forms"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-brand-orange hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    View Forms
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
