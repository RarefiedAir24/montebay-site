'use client';

import { Finding } from '@/types/report';
import FindingCard from './FindingCard';

interface FindingsSectionProps {
  findings: Finding[];
}

export default function FindingsSection({ findings }: FindingsSectionProps) {
  return (
    <div className="section-spacing">
      <h2 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-4">
        Findings
      </h2>
      <div>
        {findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </div>
  );
}

