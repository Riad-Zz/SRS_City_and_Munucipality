import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, Shield, CreditCard, FileText, AlertTriangle, ArrowRight } from 'lucide-react';

export function ProfilePage() {
  const { currentUser, applications, reports, payments, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const myApps = applications.filter(a => a.submittedBy === currentUser.id);
  const myReports = reports.filter(r => r.submittedBy === currentUser.id);
  const myPayments = payments.filter(p => p.citizenName === currentUser.name || payments.length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a4b8c] to-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
          {currentUser.avatar || currentUser.name.substring(0, 2)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Citizen ID: {currentUser.id}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 w-fit mx-auto sm:mx-0">
              Verified Citizen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs text-gray-600">
            <p className="flex items-center gap-2"><Mail size={13} className="text-gray-400" /> {currentUser.email}</p>
            <p className="flex items-center gap-2"><Phone size={13} className="text-gray-400" /> {currentUser.phone}</p>
            <p className="flex items-center gap-2"><Shield size={13} className="text-gray-400" /> NID: {currentUser.nid}</p>
            <p className="flex items-center gap-2"><MapPin size={13} className="text-gray-400" /> {currentUser.address}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/citizen/applications" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#1a4b8c]/30 transition-all">
          <p className="text-2xl font-bold text-[#1a4b8c]">{myApps.length}</p>
          <p className="text-xs text-gray-500 mt-1">Applications</p>
        </Link>
        <Link to="/citizen/reports" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#1a4b8c]/30 transition-all">
          <p className="text-2xl font-bold text-amber-600">{myReports.length}</p>
          <p className="text-xs text-gray-500 mt-1">Reports Filed</p>
        </Link>
        <Link to="/citizen/payments" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#1a4b8c]/30 transition-all">
          <p className="text-2xl font-bold text-green-600">{myPayments.length}</p>
          <p className="text-xs text-gray-500 mt-1">Payments Made</p>
        </Link>
      </div>

      {/* Switch Persona / Logout */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Prototype Role Switcher</h2>
        <p className="text-xs text-gray-500 mb-4">Switch instantly between Citizen, Municipal Staff, and Administrator portals.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Switch Role / Select User <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
