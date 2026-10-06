import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils';
import { Bell, CheckCheck } from 'lucide-react';
import { EmptyState } from '../../components/ui/States';

const TYPE_COLORS: Record<string, string> = {
  report: 'bg-amber-100 text-amber-600',
  application: 'bg-blue-100 text-blue-600',
  payment: 'bg-green-100 text-green-600',
  booking: 'bg-purple-100 text-purple-600',
  notice: 'bg-gray-100 text-gray-600',
  general: 'bg-gray-100 text-gray-600',
};

const TYPE_ICONS: Record<string, string> = {
  report: '⚠️', application: '📄', payment: '💳', booking: '🏛️', notice: '📢', general: '🔔',
};

export function NotificationsPage() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unread = myNotifs.filter(n => !n.read).length;

  const filtered = filter === 'all' ? myNotifs : filter === 'unread' ? myNotifs.filter(n => !n.read) : myNotifs.filter(n => n.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-1.5 text-sm text-[#1a4b8c] hover:underline">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'unread', 'report', 'application', 'payment', 'booking', 'notice'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${filter === f ? 'bg-[#1a4b8c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} />}
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${n.read ? 'border-gray-200 opacity-80' : 'border-[#1a4b8c]/20 shadow-sm'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${TYPE_COLORS[n.type]}`}>
                  {TYPE_ICONS[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold text-gray-900 ${!n.read ? 'font-bold' : ''}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#1a4b8c] flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
