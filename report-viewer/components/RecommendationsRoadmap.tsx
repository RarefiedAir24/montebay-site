'use client';

import { Recommendations } from '@/types/report';

interface RecommendationsRoadmapProps {
  recommendations: Recommendations;
}

export default function RecommendationsRoadmap({ recommendations }: RecommendationsRoadmapProps) {
  return (
    <div className="section-spacing">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-6">
        Recommendations Roadmap
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-lg border border-red-100">
          <h3 className="font-bold text-red-800 mb-4 text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Next 14 Days
          </h3>
          <ul className="space-y-3">
            {recommendations.next14Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 text-red-500 font-bold">→</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-lg border border-yellow-100">
          <h3 className="font-bold text-yellow-800 mb-4 text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Next 30 Days
          </h3>
          <ul className="space-y-3">
            {recommendations.next30Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 text-yellow-600 font-bold">→</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Next 90 Days
          </h3>
          <ul className="space-y-3">
            {recommendations.next90Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 text-blue-600 font-bold">→</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

