'use client';

import { Footer } from '@/types/report';

interface ReportFooterProps {
  footer: Footer;
  variant?: 'aws-audit' | 'cyber-advisory';
}

export default function ReportFooter({ footer, variant = 'aws-audit' }: ReportFooterProps) {
  const isCyberAdvisory = variant === 'cyber-advisory';
  
  // Check if optionalNote contains a CTA link
  const hasCTALink = footer.optionalNote && footer.optionalNote.includes('Request a Strategic Cyber Risk Advisory');
  
  return (
    <div className="section-spacing border-t border-gray-200 pt-6">
      <p className="text-gray-600 mb-4 leading-relaxed">
        {footer.scopeStatement}
      </p>
      {footer.optionalNote && (
        <div className="text-gray-600 text-sm mb-4">
          {hasCTALink ? (
            <p className="mb-3 italic">
              Interested in a private advisory tailored to your organization?
            </p>
          ) : (
            <p className="italic mb-3">
              {footer.optionalNote}
            </p>
          )}
          {hasCTALink && (
            <a
              href="https://www.montebay.io/#strategic-cyber-risk-advisory-form"
              className="inline-block px-5 py-2.5 text-sm font-medium bg-[var(--montebay-blue)] text-white rounded-lg hover:bg-[#4a7a9f] transition-all duration-200 shadow-sm hover:shadow-md no-print"
            >
              Request a Strategic Cyber Risk Advisory
            </a>
          )}
        </div>
      )}
      <div className="mt-6 no-print">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}

