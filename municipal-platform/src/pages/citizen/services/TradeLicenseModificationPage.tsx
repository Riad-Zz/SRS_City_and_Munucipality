import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft, Search, Edit3 } from 'lucide-react';

export function TradeLicenseModificationPage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [licenseNo, setLicenseNo] = useState('');
  const [verified, setVerified] = useState(false);
  const [modType, setModType] = useState('Change of Business Address');
  const [details, setDetails] = useState('');
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNo.trim()) return;
    setVerified(true);
  };

  const handleModify = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitApplication({
      serviceType: 'trade-license-modification',
      serviceName: 'Trade License Modification',
      submittedBy: currentUser?.id || 'citizen-001',
      details: {
        existingLicenseNo: licenseNo,
        modificationCategory: modType,
        modificationDetails: details,
        businessName: 'Rahman General Store',
        ownerName: currentUser?.name || 'Ayesha Rahman',
      },
      documents: ['modification_affidavit.pdf', 'supporting_evidence.pdf'],
      paymentRequired: false,
      department: 'Revenue & Trade Licensing Unit',
    });
    setSubmittedApp(app);
  };

  if (submittedApp) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Modification Request Logged</h2>
          <p className="text-gray-500 text-sm mb-6">Your trade license amendment request has been submitted for official review.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">License Number</span><span className="font-mono font-medium">{licenseNo}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amendment Type</span><span className="font-medium text-gray-900">{modType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-blue-600 font-medium">Submitted</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors">Track Request</button>
            <button onClick={() => navigate('/citizen/services')} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">Back to Services</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Trade License Modification</h1>
          <p className="text-sm text-gray-500">Request formal changes to an existing trade license (FR-08).</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Step 1: Identify Trade License</h2>
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
            <button type="submit" className="px-5 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5">
              <Search size={15} /> Find
            </button>
          </div>
          <p className="text-xs text-gray-400">Quick fill: <button type="button" onClick={() => { setLicenseNo('TL-DNCC-2024-009812'); setVerified(true); }} className="text-[#1a4b8c] hover:underline">TL-DNCC-2024-009812</button></p>
        </form>

        {verified && (
          <form onSubmit={handleModify} className="mt-6 border-t border-gray-100 pt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type of Modification Requested</label>
              <select
                value={modType}
                onChange={e => setModType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              >
                <option value="Change of Business Address">Change of Business Address</option>
                <option value="Change of Trade Name">Change of Trade / Enterprise Name</option>
                <option value="Change of Business Nature / Category">Change of Business Sector / Line of Trade</option>
                <option value="Inclusion or Removal of Partner">Inclusion / Removal of Business Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Detailed Description of Changes & Justification *</label>
              <textarea
                rows={4}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="State the previous information and the new proposed changes..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                required
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-gray-700">Attach Supporting Documents (Rent Deed / Resolution)</p>
              <p className="text-xs text-gray-400 mt-1">PDF or image format, max 10MB</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 size={16} /> Submit Modification Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
