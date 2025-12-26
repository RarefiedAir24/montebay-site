'use client';

import { useState } from 'react';
import { Finding } from '@/types/report';

interface FindingCardProps {
  finding: Finding;
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
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[var(--montebay-navy)]">
              {finding.title}
            </h3>
            <span className="text-sm text-gray-500">{finding.category}</span>
            <span className="risk-badge">{finding.riskLevel}</span>
          </div>
          <p className="text-gray-700">{finding.summary}</p>
        </div>
        <div className="ml-4 text-gray-400">
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
            
            <div className="pt-3 border-t border-gray-100 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Risk Level:</span> {finding.riskLevel}
                </div>
                <div>
                  <span className="font-medium">Estimated Effort:</span> {finding.estimatedEffort}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> {finding.category}
                </div>
                <div>
                  <span className="font-medium">Business Impact:</span> {finding.businessImpact}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

