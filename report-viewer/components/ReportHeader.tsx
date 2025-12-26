'use client';

import { ReportHeader as HeaderType } from '@/types/report';

interface ReportHeaderProps {
  header: HeaderType;
}

export default function ReportHeader({ header }: ReportHeaderProps) {
  const handleExportPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section-spacing border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--montebay-navy)] mb-2">
            {header.title}
          </h1>
          <div className="space-y-1 text-gray-600">
            <p><strong>Client:</strong> {header.client}</p>
            <p><strong>Environment:</strong> {header.environment}</p>
            <p><strong>Delivery Mode:</strong> {header.deliveryMode}</p>
            <p><strong>Audit Date:</strong> {header.auditDate}</p>
          </div>
        </div>
        <div className="flex gap-3 no-print">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

