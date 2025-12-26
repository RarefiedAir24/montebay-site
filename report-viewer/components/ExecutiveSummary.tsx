'use client';

import { ExecutiveSummary as SummaryType } from '@/types/report';

interface ExecutiveSummaryProps {
  summary: SummaryType;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="section-spacing executive-summary-bg">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-4">
        Executive Summary
      </h2>
      <p className="mb-6 text-gray-700 leading-relaxed">
        {summary.overallAssessment}
      </p>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Themes</h3>
        <ul className="space-y-2">
          {summary.keyThemes.map((theme, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-3 text-gray-400">•</span>
              <span className="text-gray-700">{theme}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

