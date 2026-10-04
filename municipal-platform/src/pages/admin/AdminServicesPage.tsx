import { useState } from 'react';
import { Wrench, CheckCircle2, DollarSign, Clock, Building, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils';

interface MunicipalServiceConfig {
  id: string;
  name: string;
  category: string;
  department: string;
  slaDays: number;
  fee: number;
  active: boolean;
}

const INITIAL_SERVICES: MunicipalServiceConfig[] = [
  { id: 'srv-01', name: 'Birth Registration', category: 'Civil Registration', department: 'Civil Registration Unit', slaDays: 7, fee: 0, active: true },
  { id: 'srv-02', name: 'Death Certificate', category: 'Civil Registration', department: 'Civil Registration Unit', slaDays: 5, fee: 0, active: true },
  { id: 'srv-03', name: 'New Trade License', category: 'Business & Commercial', department: 'Revenue & Trade Licensing Unit', slaDays: 3, fee: 5000, active: true },
  { id: 'srv-04', name: 'Trade License Renewal', category: 'Business & Commercial', department: 'Revenue & Trade Licensing Unit', slaDays: 1, fee: 2500, active: true },
  { id: 'srv-05', name: 'Property / Holding Registration', category: 'Property & Revenue', department: 'Property Tax Assessment Unit', slaDays: 14, fee: 0, active: true },
  { id: 'srv-06', name: 'Tax Clearance Certificate', category: 'Property & Revenue', department: 'Property Tax Assessment Unit', slaDays: 2, fee: 0, active: true },
  { id: 'srv-07', name: 'Special Waste Collection', category: 'Waste Management', department: 'Waste Management Unit', slaDays: 2, fee: 1500, active: true },
  { id: 'srv-08', name: 'Public Auditorium Booking', category: 'Community Facilities', department: 'General Administration', slaDays: 1, fee: 25000, active: true },
];

export function AdminServicesPage() {
  const [services, setServices] = useState<MunicipalServiceConfig[]>(INITIAL_SERVICES);

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Municipal Services Configuration</h1>
          <p className="text-sm text-gray-500">Configure public service catalogs, statutory fee schedules, and SLA commitments.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Service Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Processing Unit</th>
                <th className="py-3 px-4 text-left">Standard SLA</th>
                <th className="py-3 px-4 text-left">Statutory Fee</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    {s.category}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    {s.department}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-700 font-medium">
                    {s.slaDays} working days
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-gray-900">
                    {s.fee > 0 ? formatCurrency(s.fee) : 'Free Service'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        s.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {s.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
