import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, Shield, Building2, ArrowRight } from 'lucide-react';

export function StaffProfilePage() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
          {currentUser.avatar || currentUser.name.substring(0, 2)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Staff Officer ID: {currentUser.id}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 w-fit mx-auto sm:mx-0">
              Municipal Staff
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs text-gray-600">
            <p className="flex items-center gap-2"><Building2 size={13} className="text-gray-400" /> Unit: {currentUser.department || 'Roads & Infrastructure'}</p>
            <p className="flex items-center gap-2"><Mail size={13} className="text-gray-400" /> {currentUser.email}</p>
            <p className="flex items-center gap-2"><Phone size={13} className="text-gray-400" /> {currentUser.phone}</p>
            <p className="flex items-center gap-2"><Shield size={13} className="text-gray-400" /> NID: {currentUser.nid}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Switch Role / Session</h2>
        <p className="text-xs text-gray-500 mb-4">Select another user or return to the landing persona selection.</p>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          Switch Role <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
