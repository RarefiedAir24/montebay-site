'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportHeader from '@/components/ReportHeader';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import PriorityOverview from '@/components/PriorityOverview';
import FindingsSection from '@/components/FindingsSection';
import RecommendationsRoadmap from '@/components/RecommendationsRoadmap';
import ReportFooter from '@/components/ReportFooter';
import { AuditReport } from '@/types/report';
import sampleReport from '@/data/sample-report.json';

function ReportViewerContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Simple token-based authentication
    const urlToken = searchParams.get('token');
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('audit_token') : null;
    const authToken = urlToken || storedToken;

    if (authToken) {
      // In production, validate token against backend
      // For now, any token grants access
      setIsAuthenticated(true);
      if (urlToken && typeof window !== 'undefined') {
        localStorage.setItem('audit_token', urlToken);
      }
      setToken(authToken);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      // In production, fetch report data based on token
      // For now, use sample data
      setReport(sampleReport as AuditReport);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-[var(--montebay-navy)] mb-4">
            Silent AWS Audit Report
          </h1>
          <p className="text-gray-600 mb-6">
            Enter your access token to view the report.
          </p>
          <input
            type="text"
            placeholder="Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && token && typeof window !== 'undefined') {
                setIsAuthenticated(true);
                localStorage.setItem('audit_token', token);
              }
            }}
          />
          <button
            onClick={() => {
              if (token && typeof window !== 'undefined') {
                setIsAuthenticated(true);
                localStorage.setItem('audit_token', token);
              }
            }}
            className="w-full px-4 py-2 bg-[var(--montebay-navy)] text-white rounded hover:bg-opacity-90 transition-colors"
          >
            View Report
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="report-container">
        <ReportHeader header={report.header} />
        <ExecutiveSummary summary={report.executiveSummary} />
        <PriorityOverview items={report.priorityOverview} />
        <FindingsSection findings={report.findings} />
        <RecommendationsRoadmap recommendations={report.recommendations} />
        <ReportFooter footer={report.footer} />
      </div>
    </div>
  );
}

export default function ReportViewer() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ReportViewerContent />
    </Suspense>
  );
}
