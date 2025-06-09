'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-gray-200 text-gray-900 px-6 py-24 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-100 rounded-full filter blur-2xl opacity-10"></div>
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
            width={220} 
            height={220} 
            priority
          />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6 tracking-wider uppercase">
          Innovation for what’s next.
        </h1>

        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-10 leading-relaxed">
          Montebay builds streamlined digital tools, audits, and apps — quietly and purposefully.
        </p>

        <Link href="/services" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg transition">
          Explore Our Services
        </Link>
      </div>
    </div>
  );
}


