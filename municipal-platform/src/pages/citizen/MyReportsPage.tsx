import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/States';
import { AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { formatDateTime } from '../../utils';

export function MyReportsPage() {
  const { reports, currentUser } = useApp();
  const myReports = reports.filter(r => r.submittedBy === currentUser?.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">{myReports.length} report{myReports.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/citizen/report" className="flex items-center gap-2 px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors">
          <AlertTriangle size={15} /> New Report
        </Link>
      </div>

      {myReports.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle size={28} />}
          title="No active reports"
          description="You haven't submitted any municipal problem reports yet."
          action={<Link to="/citizen/report" className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold">Report a Problem</Link>}
        />
      ) : (
        <div className="space-y-3">
          {myReports.map(r => (
            <Link key={r.id} to={`/citizen/reports/${r.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a4b8c]/30 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{r.type}</span>
                    <span className="font-mono text-xs text-gray-400">{r.trackingId}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={11} /> {r.location}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={11} /> Submitted {formatDateTime(r.submittedAt)}</p>
                  {r.updatedAt !== r.submittedAt && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">Last updated {formatDateTime(r.updatedAt)}</p>
                  )}
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
