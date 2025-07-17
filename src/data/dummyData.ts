// Dummy data for OFSTED Prep App

export interface AuditItem {
  id: string;
  category: string;
  item: string;
  status: 'complete' | 'incomplete' | 'in-progress' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  assignedTo?: string;
  evidence?: string[];
  comments?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'compliant' | 'warning' | 'overdue';
  dbsCheck: {
    status: 'valid' | 'expiring' | 'expired';
    expiryDate: string;
  };
  training: {
    safeguarding: { status: 'complete' | 'expired' | 'pending'; date: string };
    firstAid: { status: 'complete' | 'expired' | 'pending'; date: string };
    medication: { status: 'complete' | 'expired' | 'pending'; date: string };
  };
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'current' | 'review-needed' | 'expired';
  assignedStaff: string[];
  acknowledgements: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  date: string;
  category: string;
  urgent: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'complete' | 'in-progress' | 'scheduled';
  category: string;
}

// Dummy audit checklist data
export const auditChecklistData: AuditItem[] = [
  {
    id: '1',
    category: 'Safeguarding',
    item: 'Child Protection Policy Review',
    status: 'complete',
    priority: 'high',
    dueDate: '2024-12-31',
    assignedTo: 'Sarah Johnson',
    evidence: ['policy-doc.pdf', 'training-records.xlsx'],
    comments: 'Policy updated and all staff trained'
  },
  {
    id: '2',
    category: 'Safeguarding',
    item: 'Safer Recruitment Checks',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-12-15',
    assignedTo: 'Mark Thompson',
    comments: 'Awaiting 2 DBS checks'
  },
  {
    id: '3',
    category: 'Behavior Management',
    item: 'Physical Intervention Training',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-11-30',
    assignedTo: 'Lisa Chen'
  },
  {
    id: '4',
    category: 'Staff Recruitment',
    item: 'Reference Verification Process',
    status: 'complete',
    priority: 'medium',
    assignedTo: 'HR Team'
  },
  {
    id: '5',
    category: 'Health and Safety',
    item: 'Fire Safety Risk Assessment',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-12-20',
    assignedTo: 'David Wilson'
  },
  {
    id: '6',
    category: 'Leadership and Management',
    item: 'Quality Assurance Framework',
    status: 'incomplete',
    priority: 'medium',
    dueDate: '2025-01-15',
    assignedTo: 'Management Team'
  }
];

// Dummy staff data
export const staffData: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Home Manager',
    email: 'sarah.johnson@example.com',
    status: 'compliant',
    dbsCheck: {
      status: 'valid',
      expiryDate: '2025-06-15'
    },
    training: {
      safeguarding: { status: 'complete', date: '2024-03-15' },
      firstAid: { status: 'complete', date: '2024-02-20' },
      medication: { status: 'complete', date: '2024-01-10' }
    }
  },
  {
    id: '2',
    name: 'Mark Thompson',
    role: 'Deputy Manager',
    email: 'mark.thompson@example.com',
    status: 'warning',
    dbsCheck: {
      status: 'expiring',
      expiryDate: '2024-12-20'
    },
    training: {
      safeguarding: { status: 'complete', date: '2024-03-15' },
      firstAid: { status: 'expired', date: '2023-11-30' },
      medication: { status: 'complete', date: '2024-01-10' }
    }
  },
  {
    id: '3',
    name: 'Lisa Chen',
    role: 'Care Worker',
    email: 'lisa.chen@example.com',
    status: 'overdue',
    dbsCheck: {
      status: 'valid',
      expiryDate: '2025-08-10'
    },
    training: {
      safeguarding: { status: 'expired', date: '2023-03-15' },
      firstAid: { status: 'complete', date: '2024-05-20' },
      medication: { status: 'pending', date: '' }
    }
  }
];

// Dummy policies data
export const policiesData: Policy[] = [
  {
    id: '1',
    title: 'Safeguarding and Child Protection Policy',
    category: 'Safeguarding & Protection',
    version: '2.1',
    lastUpdated: '2024-09-15',
    status: 'current',
    assignedStaff: ['1', '2', '3'],
    acknowledgements: 2
  },
  {
    id: '2',
    title: 'Behavior Management & Physical Intervention Policy',
    category: 'Daily Living & Care',
    version: '1.8',
    lastUpdated: '2024-08-10',
    status: 'review-needed',
    assignedStaff: ['1', '2', '3'],
    acknowledgements: 1
  },
  {
    id: '3',
    title: 'Safer Recruitment Policy',
    category: 'Staffing & HR',
    version: '3.0',
    lastUpdated: '2024-10-01',
    status: 'current',
    assignedStaff: ['1', '2'],
    acknowledgements: 2
  }
];

// Dummy alerts data
export const alertsData: Alert[] = [
  {
    id: '1',
    type: 'danger',
    title: 'DBS Check Expiring Soon',
    description: 'Mark Thompson\'s DBS check expires on 20/12/2024',
    date: '2024-11-15',
    category: 'Staff Compliance',
    urgent: true
  },
  {
    id: '2',
    type: 'warning',
    title: 'Training Overdue',
    description: 'Lisa Chen - Safeguarding training expired on 15/03/2024',
    date: '2024-11-14',
    category: 'Training',
    urgent: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Policy Review Due',
    description: 'Behavior Management Policy requires annual review',
    date: '2024-11-13',
    category: 'Policies',
    urgent: false
  }
];

// Dummy reports data
export const reportsData: Report[] = [
  {
    id: '1',
    title: 'Staff Training Compliance',
    type: 'Compliance Report',
    date: '2024-04-20',
    status: 'complete',
    category: 'Training'
  },
  {
    id: '2',
    title: 'Audit Checklist Review',
    type: 'Audit Report',
    date: '2024-04-15',
    status: 'complete',
    category: 'Audit'
  },
  {
    id: '3',
    title: 'Safeguarding Audit',
    type: 'Safeguarding Report',
    date: '2024-04-10',
    status: 'complete',
    category: 'Safeguarding'
  }
];