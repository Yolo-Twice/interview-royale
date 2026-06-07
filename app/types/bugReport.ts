export interface BugReport {
  title: string;
  category: string;
  severity: string;
  description: string;
  stepsToReproduce?: string;
  screenshot?: File | null;
  metadata: {
    browser: string;
    userAgent: string;
    currentUrl: string;
    screenResolution: string;
    timestamp: string;
    userId?: string;
    interviewSessionId?: string;
  };
}
