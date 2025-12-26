'use client';

import { useState } from 'react';
import { Finding } from '@/types/report';

interface FindingCardProps {
  finding: Finding;
}

function getRiskClass(riskLevel: string): string {
  const level = riskLevel.toLowerCase();
  if (level.includes('high')) return 'high';
  if (level.includes('medium')) return 'medium';
  if (level.includes('low')) return 'low-medium';
  return 'low';
}

export default function FindingCard({ finding }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="finding-card">
      <div
        className="finding-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-[var(--montebay-navy)]">
              {finding.title}
            </h3>
            <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">{finding.category}</span>
            <span className={`risk-badge risk-badge-${getRiskClass(finding.riskLevel)}`}>
              {finding.riskLevel}
            </span>
          </div>
          <p className="text-gray-700">{finding.summary}</p>
        </div>
        <div className="ml-4 text-[var(--montebay-blue)] text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 transition-all duration-200 hover:bg-blue-100">
          {isExpanded ? '−' : '+'}
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

