'use client';

import { ExecutiveSummary as SummaryType } from '@/types/report';

interface ExecutiveSummaryProps {
  summary: SummaryType;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="section-spacing executive-summary-bg">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-6">
        Executive Summary
      </h2>
      <p className="mb-8 text-gray-700 leading-relaxed text-lg">
        {summary.overallAssessment}
      </p>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--montebay-navy)]">Key Themes</h3>
        <ul className="space-y-3">
          {summary.keyThemes.map((theme, index) => (
            <li key={index} className="flex items-start group">
              <span className="mr-4 text-[var(--montebay-blue)] text-xl font-bold mt-0.5 group-hover:scale-110 transition-transform">•</span>
              <span className="text-gray-700 text-base leading-relaxed flex-1">{theme}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

