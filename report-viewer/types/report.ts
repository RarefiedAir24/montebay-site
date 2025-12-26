export interface AuditReport {
  header: ReportHeader;
  executiveSummary: ExecutiveSummary;
  priorityOverview: PriorityItem[];
  findings: Finding[];
  recommendations: Recommendations;
  footer: Footer;
}

export interface ReportHeader {
  title: string;
  client: string;
  environment: string;
  deliveryMode: string;
  auditDate: string;
}

export interface ExecutiveSummary {
  overallAssessment: string;
  keyThemes: string[];
}

export interface PriorityItem {
  area: string;
  riskLevel: string;
  summary: string;
  priority: string;
}

export interface Finding {
  id: string;
  title: string;
  category: string;
  riskLevel: string;
  summary: string;
  observed: string;
  whyThisMatters: string;
  recommendation: string;
  estimatedEffort: string;
  businessImpact: string;
}

export interface Recommendations {
  next14Days: string[];
  next30Days: string[];
  next90Days: string[];
}

export interface Footer {
  scopeStatement: string;
  optionalNote?: string;
}

