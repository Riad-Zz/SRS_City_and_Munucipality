import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft, Download, ShieldCheck, Printer } from 'lucide-react';

export function TaxClearancePage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [holdingNo, setHoldingNo] = useState('DNCC-HLD-2024-004128');
  const [purpose, setPurpose] = useState('Bank Loan / Title Transfer Verification');
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitApplication({
      serviceType: 'tax-clearance',
      serviceName: 'Tax Clearance Certificate',
      submittedBy: currentUser?.id || 'citizen-001',
      details: {
        holdingNumber: holdingNo,
        purposeOfClearance: purpose,
        applicantName: currentUser?.name || 'Ayesha Rahman',
        ward: 'Ward 03',
        fiscalYear: '2026-2027',
      },
      documents: ['recent_tax_receipt.pdf', 'holding_deed.pdf'],
      paymentRequired: false,
      department: 'Revenue & Property Tax Assessment Unit',
    });
    setSubmittedApp(app);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tax Clearance Certificate</h1>
          <p className="text-sm text-gray-500">Request and download official proof of municipal tax settlement (FR-15, FR-16).</p>
        </div>
      </div>

      {/* Available approved certificate for download (FR-16) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Issued Certificate Ready</span>
              <h3 className="font-bold text-gray-900 text-base mt-0.5">DNCC Tax Clearance Certificate 2026</h3>
              <p className="text-xs text-gray-600 mt-1">
                Holding: DNCC-HLD-2024-004128 · Issued for Ayesha Rahman · Valid through June 2027
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Printer size={13} /> Print
            </button>
            <button
              onClick={() => alert('Tax clearance certificate downloaded in printable PDF format.')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <Download size={13} /> Download Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Request new clearance form (FR-15) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Request New Tax Clearance Certificate</h2>
        {submittedApp ? (
          <div className="text-center py-6">
            <CheckCircle2 size={44} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Application Submitted!</h3>
            <p className="text-sm text-gray-500 mt-1">Application ID: <span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></p>
            <p className="text-xs text-gray-400 mt-2">Municipal Revenue staff will verify that no tax dues are pending and approve issuance.</p>
            <button onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)} className="mt-4 px-5 py-2.5 bg-[#1a4b8c] text-white text-sm font-semibold rounded-lg hover:bg-[#0f3060]">
              Track Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Holding Number *</label>
              <input
                type="text"
                value={holdingNo}
                onChange={e => setHoldingNo(e.target.value)}
                placeholder="e.g. DNCC-HLD-2024-004128"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Certificate *</label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              >
                <option value="Bank Loan / Title Transfer Verification">Bank Loan / Mortgage Application</option>
                <option value="Property Sale & Ownership Mutation">Property Sale & Ownership Transfer (Sub-Registry)</option>
                <option value="Utility Connection (Electricity / Gas / WASA)">Utility Connection NOC</option>
                <option value="RAJUK Building Plan Approval">Building Plan Approval Submission</option>
                <option value="General Legal Clearance">General Municipal Clearance</option>
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-gray-700">Attach Paid Tax Challan / Receipt</p>
              <p className="text-xs text-gray-400 mt-1">Automatic verification via Central Payment records is enabled.</p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors"
            >
              Submit Clearance Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
