export type IssueCategory = 'Pothole' | 'Broken Streetlight' | 'Garbage' | 'Water Leak' | 'Road Damage' | 'Other';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
export type DepartmentType = 'PWD' | 'Municipal Corporation' | 'Electricity Board' | 'Water Authority' | 'Sanitation Department';

export interface Issue {
  id: string;
  category: IssueCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  department: DepartmentType;
  urgencyScore: number; // 1-10
  estimatedFixTime: string;
  tags: string[];
  confidence: number; // 0.0 - 1.0
  image: string; // Base64 data URI
  location: string;
  notes: string;
  timestamp: number;
  upvotes: number;
  status: IssueStatus;
  upvotedByMe?: boolean;
  afterImage?: string; // Base64 data URI after resolution
  verificationResult?: {
    resolved: boolean;
    confidence: number; // 0-100
    reason: string;
  };
}

export interface ActivityLogItem {
  id: string;
  description: string;
  points: number;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  points: number;
  joinDate: string;
  actions: ActivityLogItem[];
  role?: 'citizen' | 'inspector';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

export type TabName = 'Home' | 'Report Issue' | 'Issues Feed' | 'Map View' | 'Dashboard' | 'Profile';
