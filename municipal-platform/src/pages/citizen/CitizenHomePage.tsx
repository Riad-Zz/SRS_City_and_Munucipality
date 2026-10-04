import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Baby, ScrollText, Briefcase, Building, Trash2, CalendarDays, MapPin,
  AlertTriangle, FileText, CreditCard, Bell, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, formatDateTime } from '../../utils';

const QUICK_SERVICES = [
  { icon: Baby, label: 'Birth Registration', to: '/citizen/services/birth-registration', color: 'bg-blue-50 text-blue-600' },
  { icon: ScrollText, label: 'Death Certificate', to: '/citizen/services/death-certificate', color: 'bg-purple-50 text-purple-600' },
  { icon: Briefcase, label: 'Trade License', to: '/citizen/services/trade-license', color: 'bg-amber-50 text-amber-600' },
  { icon: Building, label: 'Property Tax', to: '/citizen/services/property-tax', color: 'bg-green-50 text-green-600' },
  { icon: ScrollText, label: 'Tax Clearance', to: '/citizen/services/tax-clearance', color: 'bg-teal-50 text-teal-600' },
  { icon: Trash2, label: 'Waste Collection', to: '/citizen/services/waste', color: 'bg-orange-50 text-orange-600' },
  { icon: Building, label: 'Facility Booking', to: '/citizen/facilities', color: 'bg-indigo-50 text-indigo-600' },
  { icon: AlertTriangle, label: 'Report Problem', to: '/citizen/report', color: 'bg-red-50 text-red-600' },
];

export function CitizenHomePage() {
  const { currentUser, reports, applications, payments, notifications, notices, events } = useApp();

  const myReports = reports.filter(r => r.submittedBy === currentUser?.id).slice(0, 3);
  const myApps = applications.filter(a => a.submittedBy === currentUser?.id).slice(0, 3);
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).slice(0, 4);
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 2);
  const latestNotices = notices.filter(n => n.active).slice(0, 3);

  const activeApps = applications.filter(a => a.submittedBy === currentUser?.id && !['Completed', 'Rejected'].includes(a.status)).length;
  const activeReports = reports.filter(r => r.submittedBy === currentUser?.id && r.status !== 'Resolved').length;
  const pendingPayments = applications.filter(a => a.submittedBy === currentUser?.id && a.paymentRequired && a.paymentStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#1a4b8c] rounded-xl p-6 text-white">
        <h1 className="text-xl font-bold mb-1">Good {getGreeting()}, {currentUser?.name.split(' ')[0]}</h1>
        <p className="text-white/70 text-sm">Welcome to the Dhaka North City Corporation digital services platform.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/citizen/report" className="bg-white text-[#1a4b8c] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <AlertTriangle size={15} /> Report a Problem
          </Link>
          <Link to="/citizen/services" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <FileText size={15} /> Apply for Service
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Active Applications" value={activeApps} icon={FileText} color="blue" link="/citizen/applications" />
        <StatCard label="Active Reports" value={activeReports} icon={AlertTriangle} color="amber" link="/citizen/reports" />
        <StatCard label="Pending Payments" value={pendingPayments} icon={CreditCard} color="red" link="/citizen/payments" />
      </div>

      {/* Quick Services */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Quick Services</h2>
          <Link to="/citizen/services" className="text-sm text-[#1a4b8c] hover:underline flex items-center gap-1">All Services <ChevronRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {QUICK_SERVICES.map(s => (
            <Link key={s.to} to={s.to} className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#1a4b8c]/30 hover:shadow-sm transition-all text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-700 leading-tight">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Reports</h2>
            <Link to="/citizen/reports" className="text-xs text-[#1a4b8c] hover:underline">View all</Link>
          </div>
          {myReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No reports submitted yet.</p>
              <Link to="/citizen/report" className="text-xs text-[#1a4b8c] hover:underline mt-1 inline-block">Report a Problem</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myReports.map(r => (
                <Link key={r.id} to={`/citizen/reports/${r.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.trackingId} · {r.location.substring(0, 30)}...</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Applications */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Applications</h2>
            <Link to="/citizen/applications" className="text-xs text-[#1a4b8c] hover:underline">View all</Link>
          </div>
          {myApps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No applications submitted yet.</p>
              <Link to="/citizen/services" className="text-xs text-[#1a4b8c] hover:underline mt-1 inline-block">Browse Services</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myApps.map(a => (
                <Link key={a.id} to={`/citizen/applications/${a.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.serviceName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.appId} · {formatDate(a.submittedAt)}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <StatusBadge status={a.status} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Unread Notifications</h2>
            <Link to="/citizen/notifications" className="text-xs text-[#1a4b8c] hover:underline">View all</Link>
          </div>
          {myNotifs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No unread notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myNotifs.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-4">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.type === 'report' ? 'bg-amber-500' :
                    n.type === 'payment' ? 'bg-green-500' :
                    n.type === 'booking' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Notices */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Latest Notices</h2>
            <Link to="/citizen/notices" className="text-xs text-[#1a4b8c] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {latestNotices.map(n => (
              <Link key={n.id} to={`/citizen/notices/${n.id}`} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                {n.important && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.category} · {formatDate(n.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/citizen/events" className="text-sm text-[#1a4b8c] hover:underline flex items-center gap-1">All Events <ChevronRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingEvents.map(e => (
              <div key={e.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8c] text-white rounded-lg p-2 flex-shrink-0">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={11} /> {formatDate(e.date)} at {e.time}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} /> {e.location}</p>
                  </div>
                </div>
                <Link to="/citizen/events" className="mt-3 block w-full text-center text-xs font-semibold text-[#1a4b8c] py-1.5 border border-[#1a4b8c]/30 rounded-lg hover:bg-[#1a4b8c]/5 transition-colors">
                  Register
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, link }: { label: string; value: number; icon: any; color: string; link: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <Link to={link} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colors[color as keyof typeof colors]}`}>
        <Icon size={16} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </Link>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
