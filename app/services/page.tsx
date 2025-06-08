// app/services/page.tsx

import { FaAws, FaMicrosoft, FaRocket } from 'react-icons/fa';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">What We Offer</h1>
        <p className="text-lg text-gray-700 mb-12">
          Montebay delivers quiet innovation through audits, tools, and focused product development.
        </p>

        <div className="space-y-10">
          {/* Silent AWS Security Audit */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl">
              <FaAws />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Silent AWS Security Audit</h2>
              <p className="text-gray-700">
                A confidential review of your IAM, S3, EC2, RDS, and Security Groups — with no meetings.
                You’ll receive a detailed PDF risk report and recommended actions. Fast, focused, and silent.
              </p>
            </div>
          </div>

          {/* PowerShell & Microsoft 365 Automation */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl">
              <FaMicrosoft />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">PowerShell & Microsoft 365 Automation</h2>
              <p className="text-gray-700">
                Offload admin busywork with curated, battle-tested PowerShell scripts.
                Designed for reliability in live environments — not just GitHub stars.
              </p>
            </div>
          </div>

          {/* App Projects & Innovation */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl">
              <FaRocket />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">App Projects & Innovation</h2>
              <p className="text-gray-700">
                Montebay explores tools like <strong>Wordflect</strong> — a Tetris-inspired word game — and
                other digital experiences that reflect our build-with-purpose approach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

