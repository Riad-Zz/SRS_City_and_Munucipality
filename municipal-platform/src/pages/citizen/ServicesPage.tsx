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
        <h1 className="text-xl font-bold text-gray-900">Municipal Services</h1>
        <p className="text-sm text-gray-500 mt-1">All services in one place. No need to know which department handles your request.</p>
      </div>

      {SERVICES.map(section => (
        <section key={section.category}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.items.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a4b8c]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1a4b8c]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a4b8c] transition-colors">
                    <item.icon size={18} className="text-[#1a4b8c] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{item.type}</span>
                      {item.payment && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">Fee Required</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[#1a4b8c] text-xs font-semibold">
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
