import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, AlertTriangle, CreditCard, MapPin,
  Building2, Calendar, Megaphone, Bell, User, Home, Wrench,
  Users, Settings, Activity, ClipboardList, BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const CITIZEN_NAV: NavItem[] = [
  { to: '/citizen', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/citizen/services', icon: Wrench, label: 'Services' },
  { to: '/citizen/report', icon: AlertTriangle, label: 'Reports' },
  { to: '/citizen/map', icon: MapPin, label: 'Map' },
  { to: '/citizen/payments', icon: CreditCard, label: 'Payments' },
  { to: '/citizen/facilities', icon: Building2, label: 'Bookings' },
  { to: '/citizen/events', icon: Calendar, label: 'Events' },
  { to: '/citizen/notices', icon: Megaphone, label: 'Notices' },
  { to: '/citizen/notifications', icon: Bell, label: 'Notifications' },
  { to: '/citizen/profile', icon: User, label: 'Profile' },
];

const STAFF_NAV: NavItem[] = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/applications', icon: FileText, label: 'Applications' },
  { to: '/staff/reports', icon: AlertTriangle, label: 'Reports' },
  { to: '/staff/facilities', icon: ClipboardList, label: 'Requests' },
  { to: '/staff/events', icon: Calendar, label: 'Department Work' },
  { to: '/staff/notifications', icon: Bell, label: 'Notifications' },
  { to: '/staff/profile', icon: User, label: 'Profile' },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/services', icon: Wrench, label: 'Services' },
  { to: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
  { to: '/admin/applications', icon: CreditCard, label: 'Payments' },
  { to: '/admin/map', icon: MapPin, label: 'Map' },
  { to: '/admin/notices', icon: Megaphone, label: 'Notices' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/activity', icon: Activity, label: 'System Activity' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { currentUser, unreadCount } = useApp();
  if (!currentUser) return null;

  const navItems = currentUser.role === 'citizen' ? CITIZEN_NAV : currentUser.role === 'staff' ? STAFF_NAV : ADMIN_NAV;

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 w-60 bg-white border-r border-gray-200 z-30 overflow-y-auto transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Role badge */}
        <div className="px-4 pt-4 pb-2">
          <div className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${
            currentUser.role === 'admin' ? 'bg-purple-50 text-purple-700' :
            currentUser.role === 'staff' ? 'bg-blue-50 text-blue-700' :
            'bg-green-50 text-green-700'
          }`}>
            {currentUser.role === 'staff' ? 'Municipal Staff' : currentUser.role === 'admin' ? 'Administrator' : 'Citizen Portal'}
          </div>
          {currentUser.department && (
            <p className="text-xs text-gray-500 mt-1.5 px-2 leading-tight">{currentUser.department}</p>
          )}
        </div>

        {/* Nav */}
        <nav className="py-2 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${currentUser.role}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                  isActive
                    ? 'bg-[#1a4b8c] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
