import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FileText, AlertTriangle, CheckCircle2, Clock, Users, Building2,
  Calendar, ArrowRight, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, formatDateTime } from '../../utils';

export function StaffDashboardPage() {
  const { currentUser, applications, reports, notifications } = useApp();

  const userDept = currentUser?.department || 'Roads & Infrastructure Unit';

  // Filter departmental records
  const deptReports = reports.filter(r => !currentUser?.department || r.assignedDepartment === currentUser.department || currentUser?.role === 'staff');
  const deptApps = applications.filter(a => !currentUser?.department || a.department === currentUser.department || currentUser?.role === 'staff');

  const pendingReports = deptReports.filter(r => r.status !== 'Resolved');
  const pendingApps = deptApps.filter(a => !['Approved', 'Rejected', 'Completed'].includes(a.status));
  const inProgressReports = deptReports.filter(r => r.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Officer Welcome Header */}
      <div className="bg-gradient-to-r from-[#1a4b8c] to-[#0f3060] rounded-xl p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
              Departmental Operations Console
            </span>
            <h1 className="text-2xl font-bold mt-0.5">Welcome, {currentUser?.name}</h1>
            <p className="text-white/80 text-sm mt-1">
              {userDept} · Dhaka North City Corporation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
              Active Officer Session
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase">Pending Requests</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingApps.length}</p>
          <Link to="/staff/applications" className="text-xs text-[#1a4b8c] hover:underline mt-2 inline-flex items-center gap-1 font-medium">
            Review Applications <ArrowRight size={12} />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase">Active Problem Reports</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingReports.length}</p>
          <Link to="/staff/reports" className="text-xs text-[#1a4b8c] hover:underline mt-2 inline-flex items-center gap-1 font-medium">
            View Field Reports <ArrowRight size={12} />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase">Work In Progress</span>
            <Building2 size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{inProgressReports.length}</p>
          <p className="text-xs text-gray-500 mt-2">Active site deployments</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase">Resolved This Month</span>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {deptReports.filter(r => r.status === 'Resolved').length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Citizens notified automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Reports Queue */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Assigned Problem Reports</h2>
              <p className="text-xs text-gray-400">Routed automatically from Unified Report (FR-23, FR-26)</p>
            </div>
            <Link to="/staff/reports" className="text-xs text-[#1a4b8c] hover:underline font-medium">
              View all ({deptReports.length})
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {deptReports.slice(0, 5).map(r => (
              <Link
                key={r.id}
                to={`/staff/reports/${r.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-[#1a4b8c] transition-colors">{r.type}</span>
                    <span className="text-xs text-gray-400 font-mono">({r.trackingId})</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{r.location}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Logged: {formatDateTime(r.submittedAt)}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                  <StatusBadge status={r.status} size="sm" />
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Assigned Service Applications Queue */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Service Applications to Process</h2>
              <p className="text-xs text-gray-400">Review documents and approve / reject / request info</p>
            </div>
            <Link to="/staff/applications" className="text-xs text-[#1a4b8c] hover:underline font-medium">
              View all ({deptApps.length})
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {deptApps.slice(0, 5).map(a => (
              <Link
                key={a.id}
                to={`/staff/applications/${a.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-[#1a4b8c] transition-colors">{a.serviceName}</span>
                    <span className="text-xs text-gray-400 font-mono">({a.appId})</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Applicant: {a.details?.applicantName || a.details?.childName || a.submittedBy}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Submitted: {formatDate(a.submittedAt)}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                  <StatusBadge status={a.status} size="sm" />
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
