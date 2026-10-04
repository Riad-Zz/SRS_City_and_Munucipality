import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/States';
import { FileText, Calendar, CreditCard } from 'lucide-react';
import { formatDate } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { PaymentFlow } from '../../components/payment/PaymentFlow';
import { useState } from 'react';

export function MyApplicationsPage() {
  const { applications, currentUser } = useApp();
  const [payingApp, setPayingApp] = useState<any>(null);
  const myApps = applications.filter(a => a.submittedBy === currentUser?.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{myApps.length} application{myApps.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/citizen/services" className="flex items-center gap-2 px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors">
          + New Application
        </Link>
      </div>

      {myApps.length === 0 ? (
        <EmptyState
          icon={<FileText size={28} />}
          title="No applications yet"
          description="Browse services to submit your first application."
          action={<Link to="/citizen/services" className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold">Browse Services</Link>}
        />
      ) : (
        <div className="space-y-3">
          {myApps.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{a.serviceName}</span>
                    <span className="font-mono text-xs text-gray-400">{a.appId}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar size={11} /> Submitted {formatDate(a.submittedAt)}</p>
                  {a.department && <p className="text-xs text-gray-400 mt-0.5">Department: {a.department}</p>}
                </div>
                <StatusBadge status={a.status} size="sm" />
              </div>

              {/* Payment required */}
              {a.paymentRequired && a.paymentStatus === 'Pending' && a.status === 'Approved' && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Payment Required</p>
                    <p className="text-xs text-amber-700">Pay BDT {a.paymentAmount?.toLocaleString()} to complete your application.</p>
                  </div>
                  <button
                    onClick={() => setPayingApp(a)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex-shrink-0"
                  >
                    <CreditCard size={12} /> Pay Now
                  </button>
                </div>
              )}

              {/* Completed payment */}
              {a.paymentStatus === 'Paid' && a.paymentTransactionId && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                  Payment completed · Txn: {a.paymentTransactionId}
                </div>
              )}

              {/* Additional info required */}
              {a.status === 'Additional Info Required' && (
                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-800">Action Required</p>
                  <p className="text-xs text-orange-700 mt-0.5">{a.timeline[a.timeline.length - 1]?.note}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Link to={`/citizen/applications/${a.id}`} className="text-xs text-[#1a4b8c] hover:underline">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!payingApp} onClose={() => setPayingApp(null)} title="Complete Payment">
        {payingApp && (
          <PaymentFlow
            service={payingApp.serviceName}
            referenceId={payingApp.appId}
            amount={payingApp.paymentAmount}
            applicantName={currentUser?.name}
            onSuccess={() => setTimeout(() => setPayingApp(null), 3000)}
            onCancel={() => setPayingApp(null)}
          />
        )}
      </Modal>
    </div>
  );
}
