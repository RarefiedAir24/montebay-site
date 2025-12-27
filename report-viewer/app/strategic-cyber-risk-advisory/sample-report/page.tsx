'use client';

import { Suspense } from 'react';
import ReportHeader from '@/components/ReportHeader';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import PriorityOverview from '@/components/PriorityOverview';
import FindingsSection from '@/components/FindingsSection';
import RecommendationsRoadmap from '@/components/RecommendationsRoadmap';
import ReportFooter from '@/components/ReportFooter';
import { AuditReport } from '@/types/report';
import sampleReport from '@/data/cyber-risk-advisory-sample.json';

function SampleReportContent() {
  const report = sampleReport as AuditReport;

  return (
    <div className="min-h-screen bg-white">
      {/* Sample Report Banner */}
      <div className="bg-[var(--montebay-light-bg)] border-b border-gray-200 py-3">
        <div className="report-container">
          <p className="text-sm text-gray-600 text-center">
            <strong>Sample Report</strong> — This is a representative example of the structure, tone, and depth of a Strategic Cyber Risk Advisory report. All reports are custom-written and tailored to each organization.
          </p>
        </div>
      </div>
      
      <div className="report-container">
        <ReportHeader header={report.header} variant="cyber-advisory" />
        <ExecutiveSummary summary={report.executiveSummary} />
        <PriorityOverview items={report.priorityOverview} />
        <FindingsSection findings={report.findings} />
        <RecommendationsRoadmap recommendations={report.recommendations} />
        <ReportFooter footer={report.footer} variant="cyber-advisory" />
      </div>
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading sample report...</div>
      </div>
    }>
      <SampleReportContent />
    </Suspense>
  );
}

