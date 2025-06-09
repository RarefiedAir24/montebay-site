'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const metadata = {
  title: 'Montebay | Innovation for what’s next',
  description: 'Montebay builds digital tools, audits, and apps — quietly and purposefully.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 text-gray-900 px-6 py-24 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-200 rounded-full filter blur-2xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Image 
            src="/logo.png" 
            alt="Montebay Logo" 
            width={140} 
            height={140} 
            priority
          />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-700 to-blue-500 bg-clip-text text-transparent mb-6">
          Innovation for what’s next.
        </h1>
        <p className="text-xl text-gray-700 max-w-xl mx-auto mb-8">
          Montebay builds streamlined digital tools, audits, and apps — quietly and purposefully.
        </p>

        <Link href="/services" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full shadow transition">
          Explore Our Services
        </Link>
      </div>
    </div>
  );
}
