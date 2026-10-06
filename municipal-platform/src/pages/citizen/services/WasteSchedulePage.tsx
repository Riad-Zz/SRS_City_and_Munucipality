import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

export function WasteSchedulePage() {
  const { wasteSchedules } = useApp();
  const [selectedWard, setSelectedWard] = useState('All');

  const wards = ['All', ...Array.from(new Set(wasteSchedules.map(w => w.ward)))];

  const filtered = selectedWard === 'All'
    ? wasteSchedules
    : wasteSchedules.filter(w => w.ward === selectedWard);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Waste Collection Schedules</h1>
          <p className="text-sm text-gray-500">Official ward-wise residential and commercial collection timings (FR-31).</p>
        </div>
      </div>

      {/* Important SRS notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <p className="font-semibold">Notice regarding garbage problems or missed bins:</p>
          <p className="mt-0.5">
            Do not use this schedule page for complaints. All waste-related problems (overflowing bins, uncollected waste, illegal dumping) must be reported through the{' '}
            <Link to="/citizen/report" className="font-bold underline text-amber-900">Unified Report System</Link>.
          </p>
        </div>
      </div>

      {/* Ward filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {wards.map(ward => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
              selectedWard === ward
                ? 'bg-[#1a4b8c] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a4b8c]/40'
            }`}
          >
            {ward}
          </button>
        ))}
      </div>

      {/* Schedules List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-[#1a4b8c]/30 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-[#1a4b8c] rounded-md">
                {item.ward}
              </span>
              <span className="text-xs text-gray-500 font-medium">Daily Operations</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mt-2 flex items-center gap-1.5">
              <MapPin size={15} className="text-gray-400" /> {item.area}
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <Calendar size={13} className="text-gray-400" /> <strong>Days:</strong> {item.day}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={13} className="text-gray-400" /> <strong>Timings:</strong> {item.time}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                ✓ Compactor Van Assigned
              </span>
              <Link to="/citizen/services/waste-request" className="text-[#1a4b8c] font-semibold hover:underline">
                Book Special Collection →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
