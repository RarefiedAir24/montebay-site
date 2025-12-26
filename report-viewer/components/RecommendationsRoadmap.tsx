'use client';

import { Recommendations } from '@/types/report';

interface RecommendationsRoadmapProps {
  recommendations: Recommendations;
}

export default function RecommendationsRoadmap({ recommendations }: RecommendationsRoadmapProps) {
  return (
    <div className="section-spacing">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-4">
        Recommendations Roadmap
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Next 14 Days</h3>
          <ul className="space-y-2">
            {recommendations.next14Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-2 text-gray-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Next 30 Days</h3>
          <ul className="space-y-2">
            {recommendations.next30Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-2 text-gray-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Next 90 Days</h3>
          <ul className="space-y-2">
            {recommendations.next90Days.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-2 text-gray-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

