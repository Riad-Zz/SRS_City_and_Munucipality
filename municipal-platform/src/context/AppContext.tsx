import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AppState, User, Report, Application, Payment, Notification, Booking, Notice, MapLocation, WasteRequest, SystemActivity, ReportStatus, ApplicationStatus, Language } from '../types';
import { MOCK_REPORTS, MOCK_APPLICATIONS, MOCK_PAYMENTS, MOCK_NOTIFICATIONS,
  MOCK_FACILITIES, MOCK_BOOKINGS, MOCK_EVENTS, MOCK_VOLUNTEERS, MOCK_SURVEYS,
  MOCK_NOTICES, MOCK_MAP_LOCATIONS, MOCK_WASTE_SCHEDULES, MOCK_WASTE_REQUESTS,
  MOCK_SYSTEM_ACTIVITIES, REPORT_TYPE_DEPARTMENT_MAP,
} from '../data/mockData';

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  submitReport: (report: Omit<Report, 'id' | 'trackingId' | 'status' | 'assignedDepartment' | 'submittedAt' | 'updatedAt' | 'timeline'>) => Report;
  updateReportStatus: (reportId: string, status: ReportStatus, note: string, updatedBy: string) => void;
  submitApplication: (app: Omit<Application, 'id' | 'appId' | 'status' | 'submittedAt' | 'updatedAt' | 'timeline'>) => Application;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, note: string, updatedBy: string) => void;
  makePayment: (referenceId: string, service: string, amount: number, method: string, citizenName: string) => Payment;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  createBooking: (booking: Omit<Booking, 'id' | 'bookingId' | 'status' | 'paymentStatus' | 'createdAt'>) => Booking;
  registerForEvent: (eventId: string, userId: string) => void;
  applyForVolunteer: (volId: string, userId: string) => void;
  respondToSurvey: (surveyId: string, userId: string) => void;
  createNotice: (notice: Omit<Notice, 'id' | 'publishedAt'>) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addMapLocation: (loc: Omit<MapLocation, 'id'>) => void;
  updateMapLocation: (id: string, updates: Partial<MapLocation>) => void;
  deleteMapLocation: (id: string) => void;
  submitWasteRequest: (req: Omit<WasteRequest, 'id' | 'requestId' | 'status' | 'submittedAt' | 'paymentStatus'>) => WasteRequest;
  addSystemActivity: (activity: Omit<SystemActivity, 'id' | 'timestamp'>) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let reportCounter = 5100;
let appCounter = 3200;
let payCounter = 9500;
let bookingCounter = 1300;
let wasteCounter = 1000;
let notifCounter = 100;

function generateId(prefix: string, counter: number) {
  return `${prefix}-2026-${String(counter).padStart(6, '0')}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    language: 'en',
    reports: MOCK_REPORTS,
    applications: MOCK_APPLICATIONS,
    payments: MOCK_PAYMENTS,
    notifications: MOCK_NOTIFICATIONS,
    facilities: MOCK_FACILITIES,
    bookings: MOCK_BOOKINGS,
    events: MOCK_EVENTS,
    volunteers: MOCK_VOLUNTEERS,
    surveys: MOCK_SURVEYS,
    notices: MOCK_NOTICES,
    mapLocations: MOCK_MAP_LOCATIONS,
    wasteSchedules: MOCK_WASTE_SCHEDULES,
    wasteRequests: MOCK_WASTE_REQUESTS,
    systemActivities: MOCK_SYSTEM_ACTIVITIES,
  });

  const login = useCallback((user: User) => {
    setState(s => ({ ...s, currentUser: user }));
  }, []);

  const logout = useCallback(() => {
    setState(s => ({ ...s, currentUser: null }));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setState(s => ({ ...s, language: lang }));
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const n: Notification = {
      ...notif,
      id: `notif-${++notifCounter}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setState(s => ({ ...s, notifications: [n, ...s.notifications] }));
  }, []);

  const submitReport = useCallback((reportData: Omit<Report, 'id' | 'trackingId' | 'status' | 'assignedDepartment' | 'submittedAt' | 'updatedAt' | 'timeline'>) => {
    const department = REPORT_TYPE_DEPARTMENT_MAP[reportData.type] || 'General Services Unit';
    const now = new Date().toISOString();
    reportCounter++;
    const trackingId = generateId('RPT', reportCounter);
    const report: Report = {
      ...reportData,
      id: `rpt-new-${reportCounter}`,
      trackingId,
      status: 'Submitted',
      assignedDepartment: department,
      submittedAt: now,
      updatedAt: now,
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Report submitted by citizen.' },
      ],
    };
    setState(s => ({ ...s, reports: [report, ...s.reports] }));
    // Auto-receive notification
    setTimeout(() => {
      setState(s => {
        const received = { ...report, status: 'Received' as ReportStatus, updatedAt: new Date().toISOString(), timeline: [...report.timeline, { status: 'Received', timestamp: new Date().toISOString(), note: 'Report received and logged in the system.' }] };
        return { ...s, reports: s.reports.map(r => r.id === report.id ? received : r) };
      });
    }, 1500);
    return report;
  }, []);

  const updateReportStatus = useCallback((reportId: string, status: ReportStatus, note: string, updatedBy: string) => {
    const now = new Date().toISOString();
    setState(s => {
      const reports = s.reports.map(r => {
        if (r.id !== reportId) return r;
        const updated: Report = {
          ...r,
          status,
          updatedAt: now,
          timeline: [...r.timeline, { status, timestamp: now, note, updatedBy }],
        };
        return updated;
      });
      const report = reports.find(r => r.id === reportId);
      // Add notification for report owner
      if (report) {
        const notif: Notification = {
          id: `notif-${++notifCounter}`,
          userId: report.submittedBy,
          title: 'Report Status Updated',
          message: `Your report ${report.trackingId} (${report.type}) is now ${status}. ${note}`,
          type: 'report',
          read: false,
          createdAt: now,
          relatedId: report.trackingId,
        };
        return { ...s, reports, notifications: [notif, ...s.notifications] };
      }
      return { ...s, reports };
    });
  }, []);

  const submitApplication = useCallback((appData: Omit<Application, 'id' | 'appId' | 'status' | 'submittedAt' | 'updatedAt' | 'timeline'>) => {
    const now = new Date().toISOString();
    appCounter++;
    const appId = generateId('APP', appCounter);
    const app: Application = {
      ...appData,
      id: `app-new-${appCounter}`,
      appId,
      status: 'Submitted',
      submittedAt: now,
      updatedAt: now,
      timeline: [{ status: 'Submitted', timestamp: now, note: 'Application submitted successfully.' }],
    };
    setState(s => ({ ...s, applications: [app, ...s.applications] }));
    return app;
  }, []);

  const updateApplicationStatus = useCallback((appId: string, status: ApplicationStatus, note: string, updatedBy: string) => {
    const now = new Date().toISOString();
    setState(s => {
      const applications = s.applications.map(a => {
        if (a.appId !== appId) return a;
        return { ...a, status, updatedAt: now, timeline: [...a.timeline, { status, timestamp: now, note, updatedBy }] };
      });
      const app = applications.find(a => a.appId === appId);
      const notifications = [...s.notifications];
      if (app) {
        notifications.unshift({
          id: `notif-${++notifCounter}`,
          userId: app.submittedBy,
          title: 'Application Status Updated',
          message: `Your ${app.serviceName} application ${app.appId} is now: ${status}. ${note}`,
          type: 'application',
          read: false,
          createdAt: now,
          relatedId: app.appId,
        });
      }
      return { ...s, applications, notifications };
    });
  }, []);

  const makePayment = useCallback((referenceId: string, service: string, amount: number, method: string, citizenName: string) => {
    const now = new Date().toISOString();
    payCounter++;
    const transactionId = generateId('TXN', payCounter);
    const payment: Payment = {
      id: `pay-new-${payCounter}`,
      transactionId,
      referenceId,
      service,
      amount,
      status: 'Paid',
      method,
      paidAt: now,
      citizenName,
    };
    setState(s => {
      const notifications: Notification[] = [{
        id: `notif-${++notifCounter}`,
        userId: s.currentUser?.id || 'citizen-001',
        title: 'Payment Successful',
        message: `Your payment of BDT ${amount.toLocaleString()} for ${service} (${transactionId}) was successful.`,
        type: 'payment',
        read: false,
        createdAt: now,
        relatedId: transactionId,
      }, ...s.notifications];
      // Update related application payment status
      const applications = s.applications.map(a => {
        if (a.appId === referenceId || a.appId === referenceId) {
          return { ...a, paymentStatus: 'Paid' as const, paymentTransactionId: transactionId };
        }
        return a;
      });
      return { ...s, payments: [payment, ...s.payments], notifications, applications };
    });
    return payment;
  }, []);

  const markNotificationRead = useCallback((notifId: string) => {
    setState(s => ({ ...s, notifications: s.notifications.map(n => n.id === notifId ? { ...n, read: true } : n) }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) }));
  }, []);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'bookingId' | 'status' | 'paymentStatus' | 'createdAt'>) => {
    const now = new Date().toISOString();
    bookingCounter++;
    const bookingId = generateId('BKG', bookingCounter);
    const booking: Booking = {
      ...bookingData,
      id: `bkg-new-${bookingCounter}`,
      bookingId,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      createdAt: now,
    };
    setState(s => {
      const notifications: Notification[] = [{
        id: `notif-${++notifCounter}`,
        userId: s.currentUser?.id || 'citizen-001',
        title: 'Booking Confirmed',
        message: `Your booking at ${bookingData.facilityName} has been confirmed. Booking ID: ${bookingId}. Date: ${bookingData.date}.`,
        type: 'booking',
        read: false,
        createdAt: now,
        relatedId: bookingId,
      }, ...s.notifications];
      return { ...s, bookings: [booking, ...s.bookings], notifications };
    });
    return booking;
  }, []);

  const registerForEvent = useCallback((eventId: string, userId: string) => {
    setState(s => ({
      ...s,
      events: s.events.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1, registeredBy: [...e.registeredBy, userId] } : e),
    }));
  }, []);

  const applyForVolunteer = useCallback((volId: string, userId: string) => {
    setState(s => ({
      ...s,
      volunteers: s.volunteers.map(v => v.id === volId ? { ...v, appliedCount: v.appliedCount + 1, appliedBy: [...v.appliedBy, userId] } : v),
    }));
  }, []);

  const respondToSurvey = useCallback((surveyId: string, userId: string) => {
    setState(s => ({
      ...s,
      surveys: s.surveys.map(sv => sv.id === surveyId ? { ...sv, respondedBy: [...sv.respondedBy, userId] } : sv),
    }));
  }, []);

  const createNotice = useCallback((notice: Omit<Notice, 'id' | 'publishedAt'>) => {
    const n: Notice = { ...notice, id: `ntc-new-${Date.now()}`, publishedAt: new Date().toISOString() };
    setState(s => ({ ...s, notices: [n, ...s.notices] }));
  }, []);

  const updateNotice = useCallback((id: string, updates: Partial<Notice>) => {
    setState(s => ({ ...s, notices: s.notices.map(n => n.id === id ? { ...n, ...updates } : n) }));
  }, []);

  const deleteNotice = useCallback((id: string) => {
    setState(s => ({ ...s, notices: s.notices.filter(n => n.id !== id) }));
  }, []);

  const addMapLocation = useCallback((loc: Omit<MapLocation, 'id'>) => {
    const l: MapLocation = { ...loc, id: `ml-new-${Date.now()}` };
    setState(s => ({ ...s, mapLocations: [...s.mapLocations, l] }));
  }, []);

  const updateMapLocation = useCallback((id: string, updates: Partial<MapLocation>) => {
    setState(s => ({ ...s, mapLocations: s.mapLocations.map(l => l.id === id ? { ...l, ...updates } : l) }));
  }, []);

  const deleteMapLocation = useCallback((id: string) => {
    setState(s => ({ ...s, mapLocations: s.mapLocations.filter(l => l.id !== id) }));
  }, []);

  const submitWasteRequest = useCallback((reqData: Omit<WasteRequest, 'id' | 'requestId' | 'status' | 'submittedAt' | 'paymentStatus'>) => {
    const now = new Date().toISOString();
    wasteCounter++;
    const requestId = generateId('WRQ', wasteCounter);
    const req: WasteRequest = {
      ...reqData,
      id: `wrq-new-${wasteCounter}`,
      requestId,
      status: 'Submitted',
      submittedAt: now,
      paymentStatus: 'Pending',
    };
    setState(s => ({ ...s, wasteRequests: [req, ...s.wasteRequests] }));
    return req;
  }, []);

  const addSystemActivity = useCallback((activity: Omit<SystemActivity, 'id' | 'timestamp'>) => {
    const a: SystemActivity = { ...activity, id: `act-new-${Date.now()}`, timestamp: new Date().toISOString() };
    setState(s => ({ ...s, systemActivities: [a, ...s.systemActivities] }));
  }, []);

  const unreadCount = state.notifications.filter(n => !n.read && (!state.currentUser || n.userId === state.currentUser.id)).length;

  const value: AppContextType = {
    ...state,
    login,
    logout,
    setLanguage,
    submitReport,
    updateReportStatus,
    submitApplication,
    updateApplicationStatus,
    makePayment,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    createBooking,
    registerForEvent,
    applyForVolunteer,
    respondToSurvey,
    createNotice,
    updateNotice,
    deleteNotice,
    addMapLocation,
    updateMapLocation,
    deleteMapLocation,
    submitWasteRequest,
    addSystemActivity,
    unreadCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
