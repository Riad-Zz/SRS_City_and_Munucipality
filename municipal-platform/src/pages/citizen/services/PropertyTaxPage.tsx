import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Search, CreditCard, Download, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { Modal } from '../../../components/ui/Modal';
import { PaymentFlow } from '../../../components/payment/PaymentFlow';

export function PropertyTaxPage() {
  const navigate = useNavigate();
  const { payments } = useApp();
  const [holdingNo, setHoldingNo] = useState('DNCC-HLD-2024-004128');
  const [searched, setSearched] = useState(true);
  const [paying, setPaying] = useState(false);
  const [taxRecord, setTaxRecord] = useState({
    holdingNo: 'DNCC-HLD-2024-004128',
    owner: 'Ayesha Rahman',
    propertyAddress: 'House 12, Road 5, Ward 03, Mirpur Section 10',
    propertyType: 'Residential (4-Storey)',
    annualValuation: 240000,
    generalTaxRate: 16800, // 7%
    conservancyRate: 4800,  // 2%
    lightingRate: 2400,     // 1%
    arrear: 0,
    rebate: 1200, // 5% early rebate
    netPayable: 22800,
    status: 'Unpaid',
    fiscalYear: '2026-2027 (Quarter 1-4)',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holdingNo.trim()) return;
    setSearched(true);
    // If user typed custom holding
    setTaxRecord(prev => ({
      ...prev,
      holdingNo: holdingNo.toUpperCase(),
    }));
  };

  const hasPaid = payments.some(p => p.referenceId === taxRecord.holdingNo && p.status === 'Paid');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Property Tax Assessment & Payment</h1>
          <p className="text-sm text-gray-500">View holding assessment breakdown and settle municipal taxes (FR-13, FR-14).</p>
        </div>
      </div>

      {/* Holding search */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Holding Number (e.g. DNCC-HLD-2024-004128)"
              value={holdingNo}
              onChange={e => setHoldingNo(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors"
          >
            Check Assessment
          </button>
        </form>
      </div>

      {searched && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm space-y-6">
          {/* Header banner */}
          <div className="bg-gray-50 border-b border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">Assessed Holding</span>
              <h2 className="text-lg font-bold font-mono text-[#1a4b8c]">{taxRecord.holdingNo}</h2>
              <p className="text-xs text-gray-600 mt-0.5">{taxRecord.propertyAddress}</p>
            </div>
            <div className="flex items-center gap-2">
              {hasPaid ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold border border-green-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Paid & Cleared
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  Payment Due
                </span>
              )}
            </div>
          </div>

          <div className="px-6 space-y-5">
            {/* Holding overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <div><p className="text-xs text-gray-500">Title Owner</p><p className="font-semibold text-gray-900 mt-0.5">{taxRecord.owner}</p></div>
              <div><p className="text-xs text-gray-500">Property Type</p><p className="font-semibold text-gray-900 mt-0.5">{taxRecord.propertyType}</p></div>
              <div><p className="text-xs text-gray-500">Annual Valuation</p><p className="font-semibold text-gray-900 mt-0.5">{formatCurrency(taxRecord.annualValuation)}</p></div>
              <div><p className="text-xs text-gray-500">Fiscal Period</p><p className="font-semibold text-gray-900 mt-0.5">{taxRecord.fiscalYear}</p></div>
            </div>

            {/* Assessment Breakdown Table */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Statutory Assessment Breakdown</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-4 text-left">Tax Component</th>
                      <th className="py-2.5 px-4 text-center">Standard Rate</th>
                      <th className="py-2.5 px-4 text-right">Assessed Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">General Municipal Tax (7%)</td>
                      <td className="py-2.5 px-4 text-center text-gray-500 text-xs">7.00%</td>
                      <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(taxRecord.generalTaxRate)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">Conservancy Rate (Cleanliness & Waste)</td>
                      <td className="py-2.5 px-4 text-center text-gray-500 text-xs">2.00%</td>
                      <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(taxRecord.conservancyRate)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">Street Lighting Rate</td>
                      <td className="py-2.5 px-4 text-center text-gray-500 text-xs">1.00%</td>
                      <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(taxRecord.lightingRate)}</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="py-2.5 px-4 text-emerald-800 font-medium">Early Payment Rebate (5% on 4-Quarter Settlement)</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 text-xs">-5.00%</td>
                      <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">- {formatCurrency(taxRecord.rebate)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-gray-900 text-right">Net Annual Payable Tax:</td>
                      <td className="py-3 px-4 text-right text-lg text-[#1a4b8c] font-bold">{formatCurrency(taxRecord.netPayable)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/citizen/services/tax-clearance"
                className="text-xs text-[#1a4b8c] hover:underline flex items-center gap-1"
              >
                Need Proof of Tax Settlement? Request Tax Clearance Certificate →
              </Link>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={15} /> Print Assessment
                </button>
                {hasPaid ? (
                  <button
                    onClick={() => navigate('/citizen/payments')}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> View Payment Receipt
                  </button>
                ) : (
                  <button
                    onClick={() => setPaying(true)}
                    className="px-6 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} /> Pay Property Tax ({formatCurrency(taxRecord.netPayable)})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Central Payment Modal */}
      <Modal open={paying} onClose={() => setPaying(false)} title="Municipal Property Tax Payment">
        <PaymentFlow
          service={`Property Tax (${taxRecord.fiscalYear})`}
          referenceId={taxRecord.holdingNo}
          amount={taxRecord.netPayable}
          applicantName={taxRecord.owner}
          onSuccess={() => {
            setTaxRecord(t => ({ ...t, status: 'Paid' }));
            setTimeout(() => setPaying(false), 2500);
          }}
          onCancel={() => setPaying(false)}
        />
      </Modal>
    </div>
  );
}
