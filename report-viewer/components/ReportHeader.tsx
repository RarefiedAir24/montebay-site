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
    <div className="section-spacing border-b-2 border-gray-300 pb-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[var(--montebay-navy)] mb-3 tracking-tight">
            {header.title}
          </h1>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Client:</span>
              <span>{header.client}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Environment:</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">{header.environment}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Delivery Mode:</span>
              <span>{header.deliveryMode}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Audit Date:</span>
              <span>{header.auditDate}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 no-print">
          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 text-sm font-medium bg-white border-2 border-[var(--montebay-blue)] text-[var(--montebay-blue)] rounded-lg hover:bg-[var(--montebay-blue)] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-sm font-medium bg-[var(--montebay-blue)] text-white rounded-lg hover:bg-[#4a7a9f] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

