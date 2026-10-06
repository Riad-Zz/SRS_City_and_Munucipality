import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Download } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';

export function AdminApplicationsPage() {
  const { applications } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = applications.filter(a => {
    const matchesSearch =
      a.appId.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (a.department && a.department.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Municipal Applications Registry</h1>
          <p className="text-sm text-gray-500">System-wide monitoring of all citizen service applications.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} /> Export Applications Log
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, service name, or unit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Submitted', 'Under Review', 'Additional Info Required', 'Approved', 'Rejected', 'Completed'].map(s => (
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
                <th className="py-3 px-4 text-left">App ID</th>
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Applicant</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Submitted Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1a4b8c] text-xs">{a.appId}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{a.serviceName}</td>
                  <td className="py-3 px-4 text-xs text-gray-700">
                    {a.details?.applicantName || a.details?.childName || a.submittedBy}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">{a.department || 'General'}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDate(a.submittedAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={a.status} size="sm" />
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
