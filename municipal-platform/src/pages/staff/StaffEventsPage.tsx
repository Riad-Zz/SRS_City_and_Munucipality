import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, BarChart3, Plus, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils';
import { Modal } from '../../components/ui/Modal';

export function StaffEventsPage() {
  const { events, volunteers, surveys } = useApp();
  const [tab, setTab] = useState<'events' | 'volunteers' | 'surveys'>('events');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdNotice, setCreatedNotice] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Events, Volunteering & Surveys</h1>
          <p className="text-sm text-gray-500">Manage civic engagement campaigns and public consultations (FR-43).</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Publish New Entry
        </button>
      </div>

      {createdNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={15} /> New civic item created and published to Citizen Portal!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('events')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'events' ? 'bg-white shadow text-[#1a4b8c]' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setTab('volunteers')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'volunteers' ? 'bg-white shadow text-[#1a4b8c]' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Volunteer Drives ({volunteers.length})
        </button>
        <button
          onClick={() => setTab('surveys')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'surveys' ? 'bg-white shadow text-[#1a4b8c]' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Public Surveys ({surveys.length})
        </button>
      </div>

      {/* Events View */}
      {tab === 'events' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map(e => (
            <div key={e.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {e.category}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {e.registeredCount} / {e.maxAttendees} Enrolled
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{e.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{e.description}</p>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>{formatDate(e.date)} at {e.time}</span>
                <span className="font-medium text-emerald-700">{e.registrationOpen ? 'Registration Active' : 'Closed'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteer Opportunities */}
      {tab === 'volunteers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {volunteers.map(v => (
            <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Volunteer Drive
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {v.appliedCount} / {v.requiredVolunteers} Volunteers
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{v.title}</h3>
              <p className="text-xs text-gray-600">{v.description}</p>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Date: {formatDate(v.date)}</span>
                <span>Org: {v.organization}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surveys */}
      {tab === 'surveys' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {surveys.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Public Consultation
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {s.respondedBy.length} Responses
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{s.title}</h3>
              <p className="text-xs text-gray-600">{s.description}</p>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Deadline: {formatDate(s.deadline)}</span>
                <span className="text-emerald-700 font-medium">Collecting Answers</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Publish Engagement Activity">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
            <input type="text" placeholder="e.g. Ward 07 Cleanliness & Tree Planting Drive" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category / Type *</label>
            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
              <option>Community Cleanup Event</option>
              <option>Volunteer Task Force</option>
              <option>Citizen Opinion Survey</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
            <textarea rows={3} placeholder="Information for citizens..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setCreatedNotice(true);
                setTimeout(() => setCreatedNotice(false), 3000);
              }}
              className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060]"
            >
              Publish Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
