import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Clock, Building2, ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, formatDateTime } from '../../utils';

export function StaffDashboardPage() {
  const { currentUser, applications, reports } = useApp();

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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f3060] to-[#1a4b8c] rounded-2xl p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-blue-100 mb-4 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Staff Operations
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back, {currentUser?.name}</h1>
            <p className="text-blue-100/90 text-sm max-w-lg leading-relaxed flex items-center gap-2">
              <Building2 size={16} /> {userDept}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{pendingApps.length + pendingReports.length}</div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Total Pending</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{inProgressReports.length}</div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">In Progress</div>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -mb-10 w-40 h-40 rounded-full bg-[#2563eb]/20 blur-2xl"></div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/staff/applications" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Pending Apps</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{pendingApps.length}</p>
            <p className="text-xs text-[#1a4b8c] mt-2 font-medium flex items-center gap-1 group-hover:underline">
              Review Now <ArrowRight size={14} />
            </p>
          </div>
        </Link>

        <Link to="/staff/reports" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Active Reports</span>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{pendingReports.length}</p>
            <p className="text-xs text-[#1a4b8c] mt-2 font-medium flex items-center gap-1 group-hover:underline">
              View Issues <ArrowRight size={14} />
            </p>
          </div>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">In Progress</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{inProgressReports.length}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Active field deployments
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Resolved</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{deptReports.filter(r => r.status === 'Resolved').length}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Successfully completed
            </p>
          </div>
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
