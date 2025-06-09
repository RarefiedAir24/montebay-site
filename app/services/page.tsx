import { FaAws, FaWindows, FaRocket } from 'react-icons/fa';

export const metadata = {
  title: 'Services | Montebay',
  description: 'Explore audits, automation, and product innovation from Montebay.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-gray-100 text-gray-900 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-sky-700 to-blue-500 bg-clip-text text-transparent drop-shadow mb-4">
            What We Offer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Montebay delivers quiet innovation through audits, tools, and focused product development.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2">
          {/* AWS Audit */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-8 flex gap-6 border border-blue-100 hover:border-blue-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl shadow-sm">
              <FaAws />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Silent AWS Security Audit</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                A confidential review of your IAM, S3, EC2, RDS, and Security Groups — with no meetings. 
                You’ll receive a detailed PDF risk report and recommended actions. Fast, focused, and silent.
              </p>
            </div>
          </div>

          {/* PowerShell + M365 */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-8 flex gap-6 border border-green-100 hover:border-green-300">
            <div className="bg-green-100 text-green-600 p-4 rounded-full text-3xl shadow-sm">
              <FaWindows />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">PowerShell & Microsoft 365 Automation</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Offload admin busywork with curated, battle-tested PowerShell scripts. Designed for reliability in live environments — not just GitHub stars.
              </p>
            </div>
          </div>

          {/* App Projects */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-8 flex gap-6 border border-purple-100 hover:border-purple-300 md:col-span-2">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-full text-3xl shadow-sm">
              <FaRocket />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">App Projects & Innovation</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Montebay explores tools like <strong>Wordflect</strong> — a Tetris-inspired word game — and other digital experiences that reflect our build-with-purpose approach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

