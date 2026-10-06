import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime, formatCurrency } from '../../utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Download, Search } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { PaymentFlow } from '../../components/payment/PaymentFlow';

export function PaymentsPage() {
  const { payments, currentUser, applications } = useApp();
  const [search, setSearch] = useState('');
  const [newPayment, setNewPayment] = useState(false);

  const myPayments = payments.filter(p => p.citizenName === currentUser?.name || payments.length > 0);
  const filtered = myPayments.filter(p =>
    p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    p.service.toLowerCase().includes(search.toLowerCase()) ||
    p.referenceId.toLowerCase().includes(search.toLowerCase())
  );

  const pendingPayApps = applications.filter(a =>
    a.submittedBy === currentUser?.id && a.paymentRequired && a.paymentStatus === 'Pending' && a.status === 'Approved'
  );

  const total = myPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Total paid: {formatCurrency(total)}</p>
      </div>

      {/* Pending payments */}
      {pendingPayApps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">Pending Payments ({pendingPayApps.length})</p>
          {pendingPayApps.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-t border-amber-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.serviceName}</p>
                <p className="text-xs text-gray-500">{a.appId} · {formatCurrency(a.paymentAmount || 0)}</p>
              </div>
              <button
                onClick={() => setNewPayment(true)}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by transaction ID, service or reference..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{p.transactionId}</td>
                  <td className="px-4 py-3 text-gray-900">{p.service}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.referenceId}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.method}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(p.paidAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => window.print()} className="flex items-center gap-1 text-xs text-[#1a4b8c] hover:underline">
                      <Download size={12} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No payment records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo payment */}
      <Modal open={newPayment} onClose={() => setNewPayment(false)} title="Make Payment">
        <PaymentFlow
          service={pendingPayApps[0]?.serviceName || 'Municipal Service'}
          referenceId={pendingPayApps[0]?.appId || 'REF-001'}
          amount={pendingPayApps[0]?.paymentAmount || 1000}
          applicantName={currentUser?.name}
          onSuccess={() => setTimeout(() => setNewPayment(false), 3000)}
          onCancel={() => setNewPayment(false)}
        />
      </Modal>
    </div>
  );
}
