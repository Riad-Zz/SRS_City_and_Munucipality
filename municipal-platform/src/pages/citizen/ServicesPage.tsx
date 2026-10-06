import { Link } from 'react-router-dom';
import { Baby, ScrollText, Briefcase, Building, FileSearch, Download, Trash2, CalendarDays, PhoneCall, ChevronRight } from 'lucide-react';

const SERVICES = [
  {
    category: 'Civil Registration & Certificates',
    items: [
      { icon: Baby, label: 'Birth Registration', desc: 'Apply online for birth registration certificate.', to: '/citizen/services/birth-registration', payment: false, type: 'Application' },
      { icon: ScrollText, label: 'Death Certificate', desc: 'Apply for an official death certificate online.', to: '/citizen/services/death-certificate', payment: false, type: 'Application' },
      { icon: FileSearch, label: 'Certificate Verification', desc: 'Verify the authenticity of any issued certificate.', to: '/citizen/services/verify-certificate', payment: false, type: 'Verification' },
      { icon: Download, label: 'Download Certificate', desc: 'Download previously issued certificates.', to: '/citizen/applications', payment: false, type: 'Download' },
    ],
  },
  {
    category: 'Business & Commercial Services',
    items: [
      { icon: Briefcase, label: 'New Trade License', desc: 'Apply for a new trade license for your business.', to: '/citizen/services/trade-license', payment: true, type: 'Application' },
      { icon: Briefcase, label: 'Trade License Renewal', desc: 'Renew an existing trade license.', to: '/citizen/services/trade-license-renewal', payment: true, type: 'Application' },
      { icon: Briefcase, label: 'Trade License Modification', desc: 'Request changes to an existing trade license.', to: '/citizen/services/trade-license-modification', payment: false, type: 'Request' },
    ],
  },
  {
    category: 'Property & Revenue',
    items: [
      { icon: Building, label: 'Property/Holding Registration', desc: 'Register a property or holding with the municipality.', to: '/citizen/services/property-registration', payment: false, type: 'Application' },
      { icon: Building, label: 'Property Tax', desc: 'View your tax assessment and pay property tax.', to: '/citizen/services/property-tax', payment: true, type: 'Payment' },
      { icon: ScrollText, label: 'Tax Clearance Certificate', desc: 'Request a tax clearance certificate for your property.', to: '/citizen/services/tax-clearance', payment: false, type: 'Application' },
    ],
  },
  {
    category: 'Waste Management',
    items: [
      { icon: Trash2, label: 'Waste Collection Schedule', desc: 'View waste collection schedules for your ward.', to: '/citizen/services/waste-schedule', payment: false, type: 'Information' },
      { icon: Trash2, label: 'Special Waste Collection Request', desc: 'Request a special waste collection service.', to: '/citizen/services/waste-request', payment: true, type: 'Request' },
    ],
  },
  {
    category: 'Community Facilities',
    items: [
      { icon: CalendarDays, label: 'Facility Booking', desc: 'Book auditoriums and other municipal facilities.', to: '/citizen/facilities', payment: true, type: 'Booking' },
      { icon: PhoneCall, label: 'Public Information', desc: 'Find information about parks, hospitals and public toilets.', to: '/citizen/facilities', payment: false, type: 'Information' },
    ],
  },
];

export function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Municipal Services</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">All services in one place. No need to know which department handles your request. Easily apply, track, and pay online.</p>
      </div>

      {SERVICES.map(section => (
        <section key={section.category}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{section.category}</h2>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.items.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                    <item.icon size={24} strokeWidth={1.5} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{item.label}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{item.type}</span>
                      {item.payment && <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200/50">Fee Required</span>}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-auto leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-blue-600 text-xs font-semibold group-hover:underline">
                  Access Service <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
