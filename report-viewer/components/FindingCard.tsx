'use client';

import React, { useState } from 'react';
import { Finding } from '@/types/report';

interface FindingCardProps {
  finding: Finding;
}

function getRiskClass(riskLevel: string): string {
  const level = riskLevel.toLowerCase().trim();
  // Handle "Low–Medium" (en-dash), "Low-Medium" (hyphen), and variations
  if ((level.includes('low') && level.includes('medium')) || level === 'low–medium' || level === 'low-medium') {
    return 'low-medium';
  }
  if (level.includes('high') || level === 'high') {
    return 'high';
  }
  if (level.includes('medium') || level === 'medium') {
    return 'medium';
  }
  if (level.includes('low') || level === 'low') {
    return 'low';
  }
  return 'medium'; // default fallback
}

function getRiskBadgeStyle(riskLevel: string): React.CSSProperties {
  const level = riskLevel.toLowerCase().trim();
  let bgColor = '#6c757d';
  let textColor = '#ffffff';
  
  if ((level.includes('low') && level.includes('medium')) || level === 'low–medium' || level === 'low-medium') {
    bgColor = '#5a8ab0'; // Blue for Low-Medium
    textColor = '#ffffff';
  } else if (level.includes('high') || level === 'high') {
    bgColor = '#dc3545'; // Red for High
    textColor = '#ffffff';
  } else if (level.includes('medium') || level === 'medium') {
    bgColor = '#ffc107'; // Yellow for Medium
    textColor = '#856404';
  } else if (level.includes('low') || level === 'low') {
    bgColor = '#28a745'; // Green for Low
    textColor = '#ffffff';
  }
  
  return {
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
    color: textColor,
    border: `1px solid ${bgColor}4d`,
    display: 'inline-block',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap' as const,
  };
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
                <span className="risk-badge" style={getRiskBadgeStyle(finding.riskLevel)}>
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
                  <span className="risk-badge" style={getRiskBadgeStyle(finding.riskLevel)}>
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

