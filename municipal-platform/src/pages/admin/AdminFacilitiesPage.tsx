import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Users, Clock, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils';

export function AdminFacilitiesPage() {
  const { facilities } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Community Facilities Management</h1>
          <p className="text-sm text-gray-500">Configure public auditoriums, community centers, parks, and booking policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(f => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase font-bold text-gray-400">{f.type}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.bookable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {f.bookable ? 'Citizen Booking Enabled' : 'Public Walk-in'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">{f.name}</h3>
            <p className="text-xs text-gray-500">{f.address}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{f.description}</p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-900">
                Fee: {f.fee ? formatCurrency(f.fee) : 'Free'}
              </span>
              <span className="text-gray-500">Capacity: {f.capacity || 'Open'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
