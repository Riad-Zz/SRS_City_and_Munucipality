import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, ArrowRight, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';

export function StaffApplicationsPage() {
  const { applications, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const filtered = applications.filter(app => {
    const matchesSearch =
      app.appId.toLowerCase().includes(search.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (app.details?.applicantName && app.details.applicantName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesDept = deptFilter === 'All' || app.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const statuses = ['All', 'Submitted', 'Under Review', 'Additional Info Required', 'Approved', 'Rejected', 'Completed'];
  const depts = ['All', 'Civil Registration Unit', 'Revenue & Trade Licensing Unit', 'Revenue & Property Tax Assessment Unit', 'Waste Management Unit'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Assigned Applications</h1>
          <p className="text-sm text-gray-500">Review and process citizen municipal service applications.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Application ID, service, or applicant name..."
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
            {depts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Units' : d}</option>)}
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

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">App ID</th>
                <th className="py-3 px-4 text-left">Service Name</th>
                <th className="py-3 px-4 text-left">Applicant</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1a4b8c] text-xs">
                    {app.appId}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {app.serviceName}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {app.details?.applicantName || app.details?.childName || app.submittedBy}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {app.department || 'General Administration'}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {formatDate(app.submittedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/staff/applications/${app.id}`}
                      className="px-3 py-1.5 bg-[#1a4b8c]/10 text-[#1a4b8c] hover:bg-[#1a4b8c] hover:text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      Process <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No applications matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
