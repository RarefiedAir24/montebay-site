'use client';

import { PriorityItem } from '@/types/report';

interface PriorityOverviewProps {
  items: PriorityItem[];
}

function getRiskClass(riskLevel: string): string {
  const level = riskLevel.toLowerCase().trim();
  if (level.includes('high')) return 'high';
  if (level === 'medium' || level.includes('medium')) return 'medium';
  if (level.includes('low-medium') || level.includes('low–medium') || level.includes('low - medium')) return 'low-medium';
  if (level.includes('low')) return 'low';
  return 'medium'; // default fallback
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
                  <span className={`risk-badge risk-badge-${getRiskClass(item.riskLevel)}`}>
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

