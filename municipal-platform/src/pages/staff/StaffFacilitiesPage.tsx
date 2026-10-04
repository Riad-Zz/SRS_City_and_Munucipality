import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function StaffFacilitiesPage() {
  const { facilities, bookings } = useApp();
  const [selectedFacility, setSelectedFacility] = useState<string>('All');

  const filteredBookings = selectedFacility === 'All'
    ? bookings
    : bookings.filter(b => b.facilityId === selectedFacility);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Community Facilities & Bookings</h1>
        <p className="text-sm text-gray-500">Monitor municipal halls, auditoriums, and citizen booking schedules.</p>
      </div>

      {/* Facilities Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facilities.map(f => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-gray-400">{f.type}</span>
            <h3 className="font-semibold text-gray-900 text-sm mt-0.5">{f.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{f.address}</p>
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Fee: {f.fee ? formatCurrency(f.fee) : 'Free'}</span>
              <span className={f.bookable ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                {f.bookable ? 'Bookable' : 'Public Access'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Citizen Booking Schedule</h2>
          <select
            value={selectedFacility}
            onChange={e => setSelectedFacility(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="All">All Facilities</option>
            {facilities.filter(f => f.bookable).map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Booking ID</th>
                <th className="py-3 px-4 text-left">Facility</th>
                <th className="py-3 px-4 text-left">Citizen</th>
                <th className="py-3 px-4 text-left">Date & Slot</th>
                <th className="py-3 px-4 text-left">Purpose</th>
                <th className="py-3 px-4 text-left">Fee Status</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-xs text-[#1a4b8c]">{b.bookingId}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{b.facilityName}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{b.citizenName}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    <p className="font-medium text-gray-800">{b.date}</p>
                    <p className="text-gray-400">{b.timeSlot}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">{b.purpose}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className={b.paymentStatus === 'Paid' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                      {b.amount > 0 ? `${formatCurrency(b.amount)} (${b.paymentStatus})` : 'Free'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    No bookings found for the selected facility.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
