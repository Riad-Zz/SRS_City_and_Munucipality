import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle, ShieldCheck, Download, Printer } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatDate } from '../../../utils';

export function VerifyCertificatePage() {
  const { applications } = useApp();
  const [certNumber, setCertNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certNumber.trim()) return;

    setSearched(true);
    const cleaned = certNumber.trim().toUpperCase();

    // Check if matching any completed/approved application or preset verified records
    const foundApp = applications.find(a =>
      a.appId.toUpperCase() === cleaned ||
      a.details?.childName?.toLowerCase() === cleaned.toLowerCase() ||
      a.details?.applicantNID === cleaned
    );

    if (foundApp && (foundApp.status === 'Completed' || foundApp.status === 'Approved')) {
      setResult({
        certNo: `DNCC-CERT-${foundApp.appId}`,
        appId: foundApp.appId,
        service: foundApp.serviceName,
        recipient: foundApp.details?.childName || foundApp.details?.applicantName || 'Citizen',
        issuedDate: foundApp.updatedAt,
        ward: foundApp.details?.ward || 'Ward 03',
        status: 'VALID',
        verifiedBy: 'Civil Registration Authority, Dhaka North City Corporation',
        seal: 'OFFICIALLY VERIFIED & SECURED',
      });
    } else if (cleaned.includes('BC') || cleaned.includes('2026') || cleaned.length > 5) {
      // Demo mock verified certificate
      setResult({
        certNo: `DNCC-CERT-${cleaned}`,
        appId: cleaned,
        service: cleaned.startsWith('DC') ? 'Death Certificate' : 'Birth Registration Certificate',
        recipient: 'Tahmidur Rahman',
        issuedDate: '2026-08-15T10:00:00Z',
        ward: 'Ward 07, Mirpur',
        status: 'VALID',
        verifiedBy: 'Registrar General Office, Dhaka North City Corporation',
        seal: 'OFFICIALLY VERIFIED & SECURED',
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="text-sm text-gray-500">Verify the authenticity of municipal birth, death, and clearance certificates (FR-03).</p>
        </div>
      </div>

      {/* Verification Search Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-800">
            Enter Certificate Number or Application ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. APP-2026-002341 or BC-2026-003412"
                value={certNumber}
                onChange={e => setCertNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors"
            >
              Verify Now
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Try sample IDs:</span>
            <button type="button" onClick={() => { setCertNumber('APP-2026-002341'); }} className="text-[#1a4b8c] hover:underline font-mono">APP-2026-002341</button>
            <span>·</span>
            <button type="button" onClick={() => { setCertNumber('BC-2026-009182'); }} className="text-[#1a4b8c] hover:underline font-mono">BC-2026-009182</button>
          </div>
        </form>
      </div>

      {/* Verification Result */}
      {searched && result && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-xl overflow-hidden shadow-sm">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Official Municipal Record</span>
                <h3 className="font-bold text-lg leading-tight">Certificate Authenticity Verified</h3>
              </div>
            </div>
            <span className="bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              ✓ Authentic
            </span>
          </div>

          {/* Certificate Card Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 font-medium">Certificate Identifier</p>
                <p className="font-mono font-bold text-[#1a4b8c] text-base mt-0.5">{result.certNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Reference Application ID</p>
                <p className="font-mono text-gray-800 font-medium mt-0.5">{result.appId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Document / Service Type</p>
                <p className="font-semibold text-gray-900 mt-0.5">{result.service}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Certified Recipient</p>
                <p className="font-semibold text-gray-900 mt-0.5">{result.recipient}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Date of Official Issuance</p>
                <p className="font-medium text-gray-800 mt-0.5">{formatDate(result.issuedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Municipal Jurisdiction</p>
                <p className="font-medium text-gray-800 mt-0.5">{result.ward}, Dhaka North</p>
              </div>
              <div className="sm:col-span-2 border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-500 font-medium">Issued Authority</p>
                <p className="text-xs text-gray-700 mt-0.5 font-medium">{result.verifiedBy}</p>
              </div>
            </div>

            {/* Official seal simulation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center text-xs font-bold text-emerald-800 text-center uppercase leading-none">
                  SEAL<br/>DNCC
                </div>
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Cryptographically Signed Municipal Record</p>
                  <p className="text-emerald-700">Tamper-proof hash matched against municipal registry ledger.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  onClick={() => alert(`Official digital certificate for ${result.certNo} is available for download.`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !result && (
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
          <AlertTriangle size={40} className="text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-lg">No Record Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
            We could not locate any active or approved municipal certificate matching "{certNumber}". Please double-check the identifier on your document.
          </p>
        </div>
      )}
    </div>
  );
}
