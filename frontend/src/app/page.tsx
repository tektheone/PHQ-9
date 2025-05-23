'use client';

import Screener from '@/components/Screener';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center dark:text-white">
          Blueprint Diagnostic Screener
        </h1>
        <Screener />
      </div>
    </main>
  );
}
