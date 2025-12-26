'use client';

import { useState } from 'react';
import { Finding } from '@/types/report';

interface FindingCardProps {
  finding: Finding;
}

function getRiskClass(riskLevel: string): string {
  const level = riskLevel.toLowerCase().trim();
  // Handle "Low–Medium" (en-dash) and "Low-Medium" (hyphen)
  if (level.includes('low') && level.includes('medium')) return 'low-medium';
  if (level.includes('high')) return 'high';
  if (level.includes('medium')) return 'medium';
  if (level.includes('low')) return 'low';
  return 'medium'; // default fallback
}

export default function FindingCard({ finding }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="finding-card">
      <div
        className="finding-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[var(--montebay-navy)] mb-2 leading-tight">
                {finding.title}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                  {finding.category}
                </span>
                <span className={`risk-badge risk-badge-${getRiskClass(finding.riskLevel)}`}>
                  {finding.riskLevel}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 text-[var(--montebay-blue)] text-2xl font-light w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 transition-all duration-200 hover:bg-blue-100 cursor-pointer">
              {isExpanded ? '−' : '+'}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-base">{finding.summary}</p>
        </div>
      </div>
      
      {isExpanded && (
        <div className="finding-card-content">
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Observed</h4>
              <p className="text-gray-700 leading-relaxed">{finding.observed}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Why This Matters</h4>
              <p className="text-gray-700 leading-relaxed">{finding.whyThisMatters}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Recommendation</h4>
              <p className="text-gray-700 leading-relaxed">{finding.recommendation}</p>
            </div>
            
            <div className="pt-4 mt-4 border-t-2 border-gray-200 bg-white rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 min-w-[110px]">Risk Level:</span>
                  <span className={`risk-badge risk-badge-${getRiskClass(finding.riskLevel)}`}>
                    {finding.riskLevel}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Estimated Effort:</span>
                  <span className="ml-2 text-gray-600">{finding.estimatedEffort}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{finding.category}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Business Impact:</span>
                  <span className="ml-2 text-gray-600">{finding.businessImpact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

