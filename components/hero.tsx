import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-brand-dark-900 py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Text Content */}
                    <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                        <h1>
                            <span className="block text-base font-semibold text-brand-orange">
                                Streamline Your Workflow
                            </span>
                            <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                                <span className="block text-white">Manage Forms</span>
                                <span className="block text-brand-orange">With Confidence</span>
                            </span>
                        </h1>
                        <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                            Create, manage, and track your forms effortlessly. Built for teams who value simplicity and efficiency.
                            Get started in minutes with our intuitive dashboard.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center rounded-lg bg-brand-orange px-8 py-3 text-base font-medium text-white transition-colors hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                                    aria-label="Get started with Forms Dashboard"
                                >
                                    Get Started
                                    <svg
                                        className="ml-2 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </Link>
                                <a
                                    href="#features"
                                    className="flex items-center justify-center rounded-lg border border-gray-600 bg-transparent px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                                    aria-label="Learn more about features"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="mt-12 relative lg:col-span-6 lg:mt-0">
                        <div className="relative mx-auto w-full rounded-lg shadow-xl lg:max-w-md">
                            <Image
                                src="/images/dashboard-preview.jpg"
                                alt="Forms Dashboard Preview"
                                width={600}
                                height={400}
                                className="rounded-lg"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
                    <div
                        className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-brand-orange to-brand-red opacity-20"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
