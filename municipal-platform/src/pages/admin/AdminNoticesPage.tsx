import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import type { Notice } from '../../types';

export function AdminNoticesPage() {
  const { notices, createNotice, updateNotice, deleteNotice, addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'General' as Notice['category'],
    summary: '',
    content: '',
    important: false,
    active: true,
  });
  const [alertSuccess, setAlertSuccess] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createNotice({
      title: newNotice.title,
      category: newNotice.category,
      summary: newNotice.summary,
      content: newNotice.content,
      publishedBy: 'DNCC Central Administration',
      important: newNotice.important,
      active: true,
    });

    // If important, dispatch broadcast notification via Central Notification System (FR-57)
    if (newNotice.important) {
      addNotification({
        userId: 'citizen-001',
        title: `URGENT NOTICE: ${newNotice.title}`,
        message: newNotice.summary,
        type: 'notice',
      });
    }

    setShowAddModal(false);
    setNewNotice({
      title: '',
      category: 'General',
      summary: '',
      content: '',
      important: false,
      active: true,
    });
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Official Notice Board Management</h1>
          <p className="text-sm text-gray-500">
            Publish municipal gazettes, emergency alerts, and department announcements (FR-46).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Publish New Notice
        </button>
      </div>

      {alertSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={15} /> Notice published and synchronized across Notice Board & Citizen Notifications.
        </div>
      )}

      {/* Notices List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {notices.map(notice => (
            <div key={notice.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.important && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-1">
                      <AlertTriangle size={11} /> Urgent
                    </span>
                  )}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {notice.category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${notice.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                    {notice.active ? 'Live on Board' : 'Archived'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mt-1">{notice.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{notice.summary}</p>
                <p className="text-[11px] text-gray-400">
                  Published: {formatDate(notice.publishedAt)} by {notice.publishedBy}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => updateNotice(notice.id, { active: !notice.active })}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {notice.active ? 'Archive' : 'Publish'}
                </button>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Notice"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Notice Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Publish Official Notice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={e => setNewNotice(n => ({ ...n, title: e.target.value }))}
              placeholder="e.g. Schedule for Quarterly Holding Tax Rebate"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notice Category *</label>
            <select
              value={newNotice.category}
              onChange={e => setNewNotice(n => ({ ...n, category: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            >
              <option value="General">General</option>
              <option value="Tax">Tax</option>
              <option value="Licensing">Licensing</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Events">Events</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Short Summary / Brief *</label>
            <input
              type="text"
              required
              value={newNotice.summary}
              onChange={e => setNewNotice(n => ({ ...n, summary: e.target.value }))}
              placeholder="1-2 sentences for summary cards..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Notice Content *</label>
            <textarea
              rows={4}
              required
              value={newNotice.content}
              onChange={e => setNewNotice(n => ({ ...n, content: e.target.value }))}
              placeholder="Complete official announcement text..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={newNotice.important}
              onChange={e => setNewNotice(n => ({ ...n, important: e.target.checked }))}
              className="rounded text-[#1a4b8c]"
            />
            <label htmlFor="important" className="text-xs font-semibold text-red-700 cursor-pointer">
              Mark as URGENT (Automatically broadcasts notification to all citizens)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060]">Publish Notice</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
