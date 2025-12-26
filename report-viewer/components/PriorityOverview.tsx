'use client';

import React from 'react';
import { PriorityItem } from '@/types/report';

interface PriorityOverviewProps {
  items: PriorityItem[];
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
  let bgColorDark = '#5a6268';
  let textColor = '#ffffff';
  
  if ((level.includes('low') && level.includes('medium')) || level === 'low–medium' || level === 'low-medium') {
    bgColor = '#5a8ab0'; // Blue for Low-Medium
    bgColorDark = '#4a7a9f';
    textColor = '#ffffff';
  } else if (level.includes('high') || level === 'high') {
    bgColor = '#dc3545'; // Red for High
    bgColorDark = '#c82333';
    textColor = '#ffffff';
  } else if (level.includes('medium') || level === 'medium') {
    bgColor = '#ffc107'; // Yellow for Medium
    bgColorDark = '#e0a800';
    textColor = '#856404';
  } else if (level.includes('low') || level === 'low') {
    bgColor = '#28a745'; // Green for Low
    bgColorDark = '#218838';
    textColor = '#ffffff';
  }
  
  return {
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColorDark} 100%)`,
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
  } as React.CSSProperties;
}

export default function PriorityOverview({ items }: PriorityOverviewProps) {
  return (
    <div className="section-spacing">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-4">
        Priority Overview
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Area</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Summary</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{item.area}</td>
                <td className="py-3 px-4">
                  <span className="risk-badge" style={getRiskBadgeStyle(item.riskLevel)}>
                    {item.riskLevel}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{item.summary}</td>
                <td className="py-3 px-4 text-gray-600">{item.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

