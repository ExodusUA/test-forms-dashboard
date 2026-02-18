import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Forms Dashboard. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
