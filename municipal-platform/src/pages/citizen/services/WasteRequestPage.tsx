import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft, Trash2, CreditCard, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils';
import { Modal } from '../../../components/ui/Modal';
import { PaymentFlow } from '../../../components/payment/PaymentFlow';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export function WasteRequestPage() {
  const navigate = useNavigate();
  const { submitWasteRequest, currentUser, wasteRequests } = useApp();
  const [address, setAddress] = useState('House 12, Road 5, Ward 03, Mirpur Section 10');
  const [wasteType, setWasteType] = useState('Construction & Renovation Debris');
  const [preferredDate, setPreferredDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [submittedReq, setSubmittedReq] = useState<any>(null);
  const [paying, setPaying] = useState(false);

  const feeMap: Record<string, number> = {
    'Construction & Renovation Debris': 2500,
    'Bulk Household Furniture & Appliances': 1500,
    'Garden Pruning & Tree Branches': 800,
    'Commercial Event Waste Clean-up': 3000,
    'Electronic Waste (Bulk e-Waste)': 500,
  };

  const currentFee = feeMap[wasteType] || 1500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = submitWasteRequest({
      address,
      wasteType,
      preferredDate,
      description,
      fee: currentFee,
      citizenName: currentUser?.name || 'Ayesha Rahman',
    });
    setSubmittedReq(req);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Special Waste Collection Request</h1>
          <p className="text-sm text-gray-500">Book municipal vehicle for bulk, demolition, or special waste pickup (FR-32, FR-33, FR-34).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Submit Collection Request</h2>
          {submittedReq ? (
            <div className="text-center py-6">
              <CheckCircle2 size={44} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg">Request Logged Successfully!</h3>
              <p className="text-sm text-gray-500 mt-1">Request Reference ID: <span className="font-mono font-bold text-[#1a4b8c]">{submittedReq.requestId}</span></p>

              <div className="my-5 bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Waste Type:</span><span className="font-medium text-gray-800">{submittedReq.wasteType}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Scheduled Date:</span><span className="font-medium text-gray-800">{formatDate(submittedReq.preferredDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Statutory Service Fee:</span><span className="font-bold text-gray-900">{formatCurrency(submittedReq.fee)}</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setPaying(true)}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <CreditCard size={15} /> Pay Fee ({formatCurrency(submittedReq.fee)})
                </button>
                <button
                  onClick={() => setSubmittedReq(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  New Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Special Waste *</label>
                <select
                  value={wasteType}
                  onChange={e => setWasteType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                >
                  {Object.keys(feeMap).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pickup Date *</label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity & Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. 5 bags of rubble from room remodeling, placed beside gate..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                />
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-lg flex items-center justify-between text-xs text-blue-900">
                <span>Vehicle & Labor Dispatch Fee:</span>
                <span className="font-bold text-sm text-[#1a4b8c]">{formatCurrency(currentFee)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors"
              >
                Book Special Collection
              </button>
            </form>
          )}
        </div>

        {/* Existing Requests Tracking (FR-34) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 text-sm">Your Active Requests</h3>
          {wasteRequests.length === 0 ? (
            <p className="text-xs text-gray-400">No active special waste requests.</p>
          ) : (
            <div className="space-y-3">
              {wasteRequests.map(r => (
                <div key={r.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1a4b8c]">{r.requestId}</span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <p className="font-medium text-gray-800">{r.wasteType}</p>
                  <p className="text-gray-500">Date: {formatDate(r.preferredDate)}</p>
                  <div className="pt-1 flex items-center justify-between border-t border-gray-200">
                    <span className="text-gray-600 font-semibold">{formatCurrency(r.fee)}</span>
                    <span className={`font-semibold ${r.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {r.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Central Payment Modal */}
      <Modal open={paying} onClose={() => setPaying(false)} title="Special Waste Collection Fee">
        {submittedReq && (
          <PaymentFlow
            service={`Special Waste Collection (${submittedReq.wasteType})`}
            referenceId={submittedReq.requestId}
            amount={submittedReq.fee}
            applicantName={currentUser?.name}
            onSuccess={() => setTimeout(() => setPaying(false), 2500)}
            onCancel={() => setPaying(false)}
          />
        )}
      </Modal>
    </div>
  );
}
