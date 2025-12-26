'use client';

import { Footer } from '@/types/report';

interface ReportFooterProps {
  footer: Footer;
}

export default function ReportFooter({ footer }: ReportFooterProps) {
  return (
    <div className="section-spacing border-t border-gray-200 pt-6">
      <p className="text-gray-600 mb-4 leading-relaxed">
        {footer.scopeStatement}
      </p>
      {footer.optionalNote && (
        <p className="text-gray-600 italic">
          {footer.optionalNote}
        </p>
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

