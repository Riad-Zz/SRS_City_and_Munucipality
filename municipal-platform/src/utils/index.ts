import type { ReportStatus, ApplicationStatus, PaymentStatus } from '../types';

// Format date to readable string
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number): string {
  return `BDT ${amount.toLocaleString('en-BD')}`;
}

export function getStatusColor(status: ReportStatus | ApplicationStatus | PaymentStatus | string): string {
  switch (status) {
    case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Received': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'Assigned': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
    case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
    case 'Under Review': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Additional Info Required': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
    case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
    case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
    case 'Confirmed': return 'bg-green-50 text-green-700 border-green-200';
    case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
    case 'Scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getStatusDotColor(status: string): string {
  switch (status) {
    case 'Submitted': return 'bg-blue-500';
    case 'Received': return 'bg-cyan-500';
    case 'Assigned': return 'bg-purple-500';
    case 'In Progress': return 'bg-amber-500';
    case 'Resolved': case 'Completed': case 'Approved': case 'Paid': case 'Confirmed': return 'bg-green-500';
    case 'Rejected': case 'Failed': case 'Cancelled': return 'bg-red-500';
    case 'Under Review': return 'bg-indigo-500';
    case 'Additional Info Required': return 'bg-orange-500';
    default: return 'bg-gray-400';
  }
}

export const REPORT_TYPES = [
  'Road Damage',
  'Pothole',
  'Broken Streetlight',
  'Drainage Problem',
  'Waterlogging',
  'Garbage',
  'Illegal Dumping',
  'Public Toilet Problem',
  'Park/Playground Problem',
  'Market Problem',
  'Water Supply Problem',
  'Other',
];

export const REPORT_STATUS_STEPS: ReportStatus[] = ['Submitted', 'Received', 'Assigned', 'In Progress', 'Resolved'];
