// Types for the entire application

export type UserRole = 'citizen' | 'staff' | 'admin';
export type Language = 'en' | 'bn';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  address: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export type ReportStatus = 'Submitted' | 'Received' | 'Assigned' | 'In Progress' | 'Resolved';
export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Additional Info Required' | 'Approved' | 'Rejected' | 'Completed';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface TimelineEntry {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Report {
  id: string;
  trackingId: string;
  type: string;
  location: string;
  coordinates: [number, number];
  description: string;
  evidence: string[];
  status: ReportStatus;
  assignedDepartment: string;
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface Application {
  id: string;
  appId: string;
  serviceType: string;
  serviceName: string;
  status: ApplicationStatus;
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
  details: Record<string, string>;
  documents: string[];
  timeline: TimelineEntry[];
  paymentRequired: boolean;
  paymentAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentTransactionId?: string;
  department?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  referenceId: string;
  service: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  paidAt: string;
  citizenName: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'report' | 'application' | 'payment' | 'booking' | 'notice' | 'general';
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'park' | 'toilet' | 'hospital' | 'auditorium' | 'market';
  address: string;
  coordinates: [number, number];
  description: string;
  openingHours?: string;
  contact?: string;
  bookable: boolean;
  fee?: number;
  capacity?: number;
  image?: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  facilityId: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  purpose: string;
  citizenName: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  registrationOpen: boolean;
  maxAttendees: number;
  registeredCount: number;
  registeredBy: string[];
  organizer: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  organization: string;
  date: string;
  location: string;
  description: string;
  requiredVolunteers: number;
  appliedCount: number;
  appliedBy: string[];
  skills: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  deadline: string;
  respondedBy: string[];
  active: boolean;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'radio' | 'checkbox' | 'text' | 'rating';
  options?: string[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'General' | 'Tax' | 'Licensing' | 'Public Safety' | 'Events' | 'Infrastructure' | 'Emergency';
  summary: string;
  content: string;
  publishedAt: string;
  publishedBy: string;
  important: boolean;
  active: boolean;
}

export interface MapLocation {
  id: string;
  name: string;
  category: 'park' | 'toilet' | 'hospital' | 'market' | 'infrastructure' | 'auditorium' | 'waste';
  address: string;
  coordinates: [number, number];
  description?: string;
  openingHours?: string;
  contact?: string;
}

export interface WasteSchedule {
  ward: string;
  day: string;
  time: string;
  area: string;
}

export interface WasteRequest {
  id: string;
  requestId: string;
  address: string;
  preferredDate: string;
  wasteType: string;
  description: string;
  status: 'Submitted' | 'Scheduled' | 'Completed';
  citizenName: string;
  submittedAt: string;
  fee: number;
  paymentStatus: PaymentStatus;
  transactionId?: string;
}

export interface SystemActivity {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  module: string;
}

export interface AppState {
  currentUser: User | null;
  language: Language;
  reports: Report[];
  applications: Application[];
  payments: Payment[];
  notifications: Notification[];
  facilities: Facility[];
  bookings: Booking[];
  events: Event[];
  volunteers: VolunteerOpportunity[];
  surveys: Survey[];
  notices: Notice[];
  mapLocations: MapLocation[];
  wasteSchedules: WasteSchedule[];
  wasteRequests: WasteRequest[];
  systemActivities: SystemActivity[];
}
