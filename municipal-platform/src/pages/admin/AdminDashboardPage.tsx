import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Users, AlertTriangle, FileText, CreditCard, Activity,
  Megaphone, MapPin, Building2, CheckCircle2, TrendingUp, ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function AdminDashboardPage() {
  const { reports, applications, payments, notices, mapLocations, systemActivities, currentUser } = useApp();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const resolutionRate = reports.length > 0 ? Math.round((resolvedReports / reports.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-[#311659] to-[#0f3060] rounded-2xl p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-purple-100 mb-4 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Platform Operational
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Municipal System Overview</h1>
            <p className="text-purple-100/90 text-sm max-w-lg leading-relaxed flex items-center gap-2">
              <Building2 size={16} /> Dhaka North City Corporation
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 opacity-20 relative">
              <Activity size={128} className="absolute inset-0" strokeWidth={1} />
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -mb-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl"></div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={14} /> Via Central Payment
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Reports</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{reports.length}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Resolution Rate: <strong className="text-emerald-600">{resolutionRate}%</strong>
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Applications</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{applications.length}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Across municipal departments
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Infrastructure</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{mapLocations.length}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Active GIS location pins
            </p>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link to="/admin/users" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Users size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Manage Users</span>
        </Link>
        <Link to="/admin/services" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Services</span>
        </Link>
        <Link to="/admin/notices" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Megaphone size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Notices (FR-46)</span>
        </Link>
        <Link to="/admin/map" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <MapPin size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Map GIS (FR-30)</span>
        </Link>
        <Link to="/admin/events" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <Building2 size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Events & Surveys</span>
        </Link>
        <Link to="/admin/activity" className="p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all text-center group">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-gray-700 group-hover:text-white transition-colors">
            <Activity size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-800">Audit Log</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Reports Monitoring */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Cross-Department Reports</h2>
            <Link to="/admin/reports" className="text-xs text-[#1a4b8c] hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {reports.slice(0, 5).map(r => (
              <div key={r.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1a4b8c]">{r.trackingId}</span>
                    <span className="font-semibold text-gray-900">{r.type}</span>
                  </div>
                  <p className="text-gray-500 mt-0.5">{r.assignedDepartment} · {r.location}</p>
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Stream */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Platform Activity</h2>
            <Link to="/admin/activity" className="text-xs text-[#1a4b8c] hover:underline">Audit Trail</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {systemActivities.slice(0, 5).map(act => (
              <div key={act.id} className="p-3.5 text-xs flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{act.action}</p>
                  <p className="text-gray-500 mt-0.5">
                    By {act.performedBy} ({act.role}) · Module: {act.module}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {formatDateTime(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
