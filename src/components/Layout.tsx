import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-zinc-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
