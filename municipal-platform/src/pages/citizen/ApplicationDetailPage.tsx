import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { ArrowLeft, CreditCard, Download } from 'lucide-react';
import { formatDate } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { PaymentFlow } from '../../components/payment/PaymentFlow';

export function ApplicationDetailPage() {
  const { id } = useParams();
  const { applications, currentUser } = useApp();
  const [paying, setPaying] = useState(false);
  const app = applications.find(a => a.id === id);

  if (!app) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Application not found.</p>
      <Link to="/citizen/applications" className="text-[#1a4b8c] text-sm hover:underline">← Back</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/citizen/applications" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{app.serviceName}</h1>
          <p className="text-sm font-mono text-gray-400">{app.appId}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={app.status} /></div>
      </div>

      {/* Application details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Application Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-gray-500">Application ID</p><p className="font-mono font-medium mt-0.5">{app.appId}</p></div>
          <div><p className="text-xs text-gray-500">Service</p><p className="font-medium mt-0.5">{app.serviceName}</p></div>
          <div><p className="text-xs text-gray-500">Submitted</p><p className="font-medium mt-0.5">{formatDate(app.submittedAt)}</p></div>
          <div><p className="text-xs text-gray-500">Last Updated</p><p className="font-medium mt-0.5">{formatDate(app.updatedAt)}</p></div>
          {app.department && <div><p className="text-xs text-gray-500">Department</p><p className="font-medium mt-0.5">{app.department}</p></div>}
        </div>

        {Object.keys(app.details).length > 0 && (
          <>
            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Submitted Information</p>
              <div className="space-y-2">
                {Object.entries(app.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-900 font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {app.documents.length > 0 && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents</p>
            <div className="space-y-1">
              {app.documents.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#1a4b8c] hover:underline cursor-pointer">
                  <Download size={12} /> {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment section */}
      {app.paymentRequired && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Payment</h2>
          {app.paymentStatus === 'Paid' ? (
            <div className="bg-green-50 rounded-lg p-3 space-y-1">
              <p className="text-sm font-semibold text-green-800">Payment Completed</p>
              <p className="text-xs text-green-700">Amount: BDT {app.paymentAmount?.toLocaleString()}</p>
              <p className="text-xs text-green-700">Transaction: {app.paymentTransactionId}</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-amber-800">Payment Required</p>
                <p className="text-xs text-amber-700">Amount: BDT {app.paymentAmount?.toLocaleString()}</p>
              </div>
              {app.status === 'Approved' && (
                <button onClick={() => setPaying(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors flex-shrink-0">
                  <CreditCard size={14} /> Pay Now
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Certificate download */}
      {(app.status === 'Completed' || app.status === 'Approved') && !app.paymentRequired && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Certificate</h2>
          <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-green-800">Certificate ready for download</p>
            <button onClick={() => alert('Certificate download will be available in the production system.')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Application Timeline</h2>
        <StatusTimeline timeline={app.timeline} />
      </div>

      <Modal open={paying} onClose={() => setPaying(false)} title="Make Payment">
        <PaymentFlow
          service={app.serviceName}
          referenceId={app.appId}
          amount={app.paymentAmount || 0}
          applicantName={currentUser?.name}
          onSuccess={() => setTimeout(() => setPaying(false), 3000)}
          onCancel={() => setPaying(false)}
        />
      </Modal>
    </div>
  );
}
