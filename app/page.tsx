import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Forms Dashboard - Manage Your Forms Efficiently',
  description: 'Create, manage, and track your forms effortlessly. Built for teams who value simplicity and efficiency.',
  openGraph: {
    title: 'Forms Dashboard - Manage Your Forms Efficiently',
    description: 'Create, manage, and track your forms effortlessly. Built for teams who value simplicity and efficiency.',
    type: 'website',
    url: 'https://forms-dashboard.vercel.app',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Forms Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forms Dashboard - Manage Your Forms Efficiently',
    description: 'Create, manage, and track your forms effortlessly. Built for teams who value simplicity and efficiency.',
    images: ['/images/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
