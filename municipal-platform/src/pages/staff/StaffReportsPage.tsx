import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDateTime } from '../../utils';

export function StaffReportsPage() {
  const { reports } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const filtered = reports.filter(r => {
    const matchesSearch =
      r.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDept = deptFilter === 'All' || r.assignedDepartment === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const statuses = ['All', 'Submitted', 'Received', 'Assigned', 'In Progress', 'Resolved'];
  const depts = [
    'All',
    'Roads & Infrastructure Unit',
    'Electrical Unit',
    'Waste Management Unit',
    'Drainage & Water Supply Unit',
    'Health & Sanitation Unit',
    'Parks & Recreation Unit',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Unified Problem Reports</h1>
          <p className="text-sm text-gray-500">
            Field reports automatically routed to municipal departments (FR-23, FR-26).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Tracking ID, problem type, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
            />
          </div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
          >
            {depts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Municipal Units' : d}</option>)}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-colors ${
                statusFilter === s
                  ? 'bg-[#1a4b8c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid/Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {filtered.map(report => (
            <div key={report.id} className="p-4 sm:p-5 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-xs text-[#1a4b8c] bg-blue-50 px-2 py-0.5 rounded">
                    {report.trackingId}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm">{report.type}</h3>
                  <StatusBadge status={report.status} size="sm" />
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">{report.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin size={12} className="text-gray-400" /> {report.location}
                  </span>
                  <span>Routed to: <strong className="text-gray-700">{report.assignedDepartment}</strong></span>
                  <span>Logged: {formatDateTime(report.submittedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <Link
                  to={`/staff/reports/${report.id}`}
                  className="px-4 py-2 bg-[#1a4b8c] text-white hover:bg-[#0f3060] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  Manage Status <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              No reports matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
