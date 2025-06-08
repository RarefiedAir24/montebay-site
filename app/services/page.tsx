export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">What We Offer</h1>
        <p className="text-lg text-gray-700 mb-10">
          Montebay delivers quiet innovation through audits, tools, and focused product development.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🔍 Silent AWS Security Audit</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              A confidential review of your IAM, S3, EC2, RDS, and Security Groups — with no meetings.
              You’ll receive a detailed PDF risk report and recommended actions. Fast, focused, and silent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🛠 PowerShell & Microsoft 365 Automation</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Offload admin busywork with curated, battle-tested PowerShell scripts. Designed for
              reliability in live environments — not just GitHub stars.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🚀 App Projects & Innovation</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Montebay explores tools like <strong>Wordflect</strong> — a Tetris-inspired word game —
              and other digital experiences that reflect our build-with-purpose approach.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


