import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Download } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDateTime } from '../../utils';

export function AdminReportsPage() {
  const { reports } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = reports.filter(r => {
    const matchesSearch =
      r.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.assignedDepartment.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Municipal Reports Registry</h1>
          <p className="text-sm text-gray-500">Cross-departmental monitoring of all citizen problem reports.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} /> Export Report Summary
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by Tracking ID, problem, ward, or unit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Submitted', 'Received', 'Assigned', 'In Progress', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s ? 'bg-[#1a4b8c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Tracking ID</th>
                <th className="py-3 px-4 text-left">Problem Type</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Assigned Department</th>
                <th className="py-3 px-4 text-left">Submitted</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1a4b8c] text-xs">{r.trackingId}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{r.type}</td>
                  <td className="py-3 px-4 text-xs text-gray-600 flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" /> {r.location}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-700">{r.assignedDepartment}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDateTime(r.submittedAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
