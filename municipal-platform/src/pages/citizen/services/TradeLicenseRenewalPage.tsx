import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft, Search, RefreshCw, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { Modal } from '../../../components/ui/Modal';
import { PaymentFlow } from '../../../components/payment/PaymentFlow';

export function TradeLicenseRenewalPage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [licenseNo, setLicenseNo] = useState('');
  const [verified, setVerified] = useState(false);
  const [renewalYear, setRenewalYear] = useState('2026-2027');
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

  const renewalFee = 2500;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNo.trim()) return;
    setVerified(true);
  };

  const handleRenew = () => {
    const app = submitApplication({
      serviceType: 'trade-license-renewal',
      serviceName: 'Trade License Renewal',
      submittedBy: currentUser?.id || 'citizen-001',
      details: {
        existingLicenseNo: licenseNo,
        businessName: 'Rahman General Store',
        ownerName: currentUser?.name || 'Ayesha Rahman',
        ward: 'Ward 03',
        renewalFiscalYear: renewalYear,
        statutoryFee: `BDT ${renewalFee}`,
      },
      documents: ['previous_trade_license.pdf', 'challan_copy.pdf'],
      paymentRequired: true,
      paymentAmount: renewalFee,
      paymentStatus: 'Pending',
      department: 'Revenue & Trade Licensing Unit',
    });
    setSubmittedApp(app);
  };

  if (submittedApp) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Renewal Request Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your trade license renewal has been registered for administrative issuance.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">License Number</span><span className="font-mono font-medium">{licenseNo}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Fiscal Period</span><span className="font-medium">{renewalYear}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Annual Renewal Fee</span><span className="font-bold text-gray-900">{formatCurrency(renewalFee)}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPayment(true)}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard size={16} /> Pay Renewal Fee Now
            </button>
            <button
              onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)}
              className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors"
            >
              Track Application
            </button>
          </div>
        </div>

        <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Trade License Renewal Fee">
          <PaymentFlow
            service="Trade License Renewal"
            referenceId={submittedApp.appId}
            amount={renewalFee}
            applicantName={currentUser?.name}
            onSuccess={() => setTimeout(() => setShowPayment(false), 2500)}
            onCancel={() => setShowPayment(false)}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Trade License Renewal</h1>
          <p className="text-sm text-gray-500">Quick online renewal for existing licensed establishments (FR-07).</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Step 1: Verify Existing License</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Trade License No (e.g. TL-DNCC-2024-009812)"
              value={licenseNo}
              onChange={e => { setLicenseNo(e.target.value); setVerified(false); }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5"
            >
              <Search size={15} /> Find License
            </button>
          </div>
          <p className="text-xs text-gray-400">Sample for testing: <button type="button" onClick={() => { setLicenseNo('TL-DNCC-2024-009812'); setVerified(true); }} className="text-[#1a4b8c] hover:underline">TL-DNCC-2024-009812</button></p>
        </form>

        {verified && (
          <div className="mt-6 border-t border-gray-100 pt-5 space-y-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
                <CheckCircle2 size={16} /> License Record Verified
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-gray-500">Enterprise:</span> Rahman General Store</div>
                <div><span className="text-gray-500">Owner:</span> Ayesha Rahman</div>
                <div><span className="text-gray-500">Ward:</span> Ward 03, Mirpur</div>
                <div><span className="text-gray-500">Last Valid Year:</span> 2025-2026</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Renewal Fiscal Year Period</label>
              <select
                value={renewalYear}
                onChange={e => setRenewalYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              >
                <option value="2026-2027">2026 - 2027 (1 Year)</option>
                <option value="2026-2028">2026 - 2028 (2 Years)</option>
                <option value="2026-2031">2026 - 2031 (5 Years Extended)</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Standard Renewal Fee:</span>
              <span className="font-bold text-[#1a4b8c]">{formatCurrency(renewalFee)}</span>
            </div>

            <button
              onClick={handleRenew}
              className="w-full py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Submit Renewal Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
