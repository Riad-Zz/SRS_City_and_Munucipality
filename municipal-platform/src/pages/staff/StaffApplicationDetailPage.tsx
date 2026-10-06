import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, FileText, Download, UserCheck } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { formatDateTime, formatCurrency } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import type { ApplicationStatus } from '../../types';

export function StaffApplicationDetailPage() {
  const { id } = useParams();
  const { applications, updateApplicationStatus, currentUser } = useApp();
  const app = applications.find(a => a.id === id);

  const [decisionModal, setDecisionModal] = useState<ApplicationStatus | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  if (!app) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Application not found.</p>
        <Link to="/staff/applications" className="text-[#1a4b8c] text-sm hover:underline mt-2 inline-block">
          ← Back to applications
        </Link>
      </div>
    );
  }

  const handleDecisionConfirm = () => {
    if (!decisionModal) return;
    updateApplicationStatus(
      app.appId,
      decisionModal,
      decisionNote || `Application marked as ${decisionModal} by ${currentUser?.name || 'Municipal Officer'}.`,
      currentUser?.name || 'Department Officer'
    );
    setDecisionModal(null);
    setDecisionNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link to="/staff/applications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{app.serviceName}</h1>
          <p className="text-sm font-mono text-gray-400">{app.appId}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={app.status} />
        </div>
      </div>

      {/* Decision Processing Panel (SRS Section 6.2 - Figure 7 Workflow) */}
      <div className="bg-white border-2 border-[#1a4b8c]/20 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
          <UserCheck size={18} className="text-[#1a4b8c]" />
          Officer Decision & Workflow Action
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Updating status automatically notifies the citizen via the Central Notification System and updates the service record.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setDecisionModal('Approved'); setDecisionNote('All statutory documents verified and approved.'); }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 size={15} /> Approve Application
          </button>
          <button
            onClick={() => { setDecisionModal('Additional Info Required'); setDecisionNote('Please provide clear copies of identification and deed.'); }}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <AlertCircle size={15} /> Request Additional Info
          </button>
          <button
            onClick={() => { setDecisionModal('Under Review'); setDecisionNote('Application is undergoing departmental review and verification.'); }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText size={15} /> Mark Under Review
          </button>
          <button
            onClick={() => { setDecisionModal('Rejected'); setDecisionNote('Application does not meet municipal statutory criteria.'); }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <XCircle size={15} /> Reject Application
          </button>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Application Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div><p className="text-xs text-gray-500 font-medium">Application ID</p><p className="font-mono font-bold text-[#1a4b8c] mt-0.5">{app.appId}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Service Category</p><p className="font-semibold text-gray-900 mt-0.5">{app.serviceName}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Submission Timestamp</p><p className="font-medium text-gray-800 mt-0.5">{formatDateTime(app.submittedAt)}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Department Unit</p><p className="font-medium text-gray-800 mt-0.5">{app.department || 'General'}</p></div>
        </div>

        {/* Submitted Data Entries */}
        {Object.keys(app.details).length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Citizen Submitted Fields
            </h3>
            <div className="space-y-2">
              {Object.entries(app.details).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-gray-900 font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Documents */}
        {app.documents.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Attached Supporting Documents
            </h3>
            <div className="space-y-2">
              {app.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#1a4b8c]" /> {doc}
                  </span>
                  <button
                    onClick={() => alert(`Reviewing document: ${doc}`)}
                    className="text-[#1a4b8c] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Download size={12} /> Inspect File
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment info if applicable */}
        {app.paymentRequired && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Statutory Fee & Payment Status
            </h3>
            <div className="p-3 bg-blue-50/50 rounded-lg flex items-center justify-between text-xs">
              <span>Required Fee: <strong>{formatCurrency(app.paymentAmount || 0)}</strong></span>
              <span className={`font-bold ${app.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {app.paymentStatus === 'Paid' ? `Paid (${app.paymentTransactionId || 'TXN'})` : 'Payment Pending'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Status History & Audit Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Official Action Log & Timeline</h2>
        <StatusTimeline timeline={app.timeline} />
      </div>

      {/* Decision Modal */}
      <Modal open={decisionModal !== null} onClose={() => setDecisionModal(null)} title={`Confirm Action: ${decisionModal}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to change the status of <strong>{app.appId}</strong> to <span className="font-bold text-[#1a4b8c]">{decisionModal}</span>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Officer Notes / Instructions to Citizen *
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={e => setDecisionNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              placeholder="Provide remarks or requirements..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDecisionModal(null)}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDecisionConfirm}
              className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060]"
            >
              Confirm & Dispatch Notification
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
