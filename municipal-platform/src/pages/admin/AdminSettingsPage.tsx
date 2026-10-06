import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Database, Globe, ArrowRight, UserCheck } from 'lucide-react';

export function AdminSettingsPage() {
  const { logout, language, setLanguage } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform System Settings</h1>
        <p className="text-sm text-gray-500">Global system parameters, localization, and administrator session controls.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Globe size={16} className="text-[#1a4b8c]" />
            Platform Language & Localization
          </h2>
          <p className="text-xs text-gray-500 mb-3">Default display language for citizen portal and receipts.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                language === 'en' ? 'border-[#1a4b8c] bg-[#1a4b8c]/5 text-[#1a4b8c]' : 'border-gray-200 text-gray-600'
              }`}
            >
              English (Default)
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                language === 'bn' ? 'border-[#1a4b8c] bg-[#1a4b8c]/5 text-[#1a4b8c]' : 'border-gray-200 text-gray-600'
              }`}
            >
              বাংলা (Bengali)
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Database size={16} className="text-emerald-600" />
            Central Engine Status
          </h2>
          <p className="text-xs text-gray-500 mb-3">Shared core services status.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <span>Central Payment Gateway:</span>
              <span className="font-bold text-emerald-600">Connected (Active)</span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <span>Central Notification Dispatcher:</span>
              <span className="font-bold text-emerald-600">Connected (Active)</span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <span>Unified Routing Engine:</span>
              <span className="font-bold text-emerald-600">Deterministic Routing (Active)</span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <span>GIS City Map Layers:</span>
              <span className="font-bold text-emerald-600">OpenStreetMap Synced</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <UserCheck size={16} className="text-purple-600" />
            Role & Session Management
          </h2>
          <p className="text-xs text-gray-500 mb-4">Switch role or test other user roles.</p>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Switch to Another Role / Persona <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
