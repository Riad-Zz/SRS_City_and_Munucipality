import { useApp } from '../../context/AppContext';
import { Shield, Download } from 'lucide-react';
import { formatDateTime } from '../../utils';

export function AdminActivityPage() {
  const { systemActivities } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Activity & Audit Log</h1>
          <p className="text-sm text-gray-500">Immutable audit log of all administrative, staff, and citizen actions (SRS Section 6.1).</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} /> Export Audit Log
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {systemActivities.map(act => (
            <div key={act.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{act.action}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    act.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    act.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {act.role}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Module: {act.module}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Triggered by: <strong className="text-gray-700">{act.performedBy}</strong>
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDateTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
