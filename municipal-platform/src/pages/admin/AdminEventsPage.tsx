import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, BarChart3, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils';
import { Modal } from '../../components/ui/Modal';

export function AdminEventsPage() {
  const { events, volunteers, surveys } = useApp();
  const [tab, setTab] = useState<'events' | 'volunteers' | 'surveys'>('events');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Events, Volunteers & Surveys</h1>
          <p className="text-sm text-gray-500">Citizen participation, public consultations, and volunteer drives (FR-43).</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Create Program
        </button>
      </div>

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
          Volunteering ({volunteers.length})
        </button>
        <button
          onClick={() => setTab('surveys')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'surveys' ? 'bg-white shadow text-[#1a4b8c]' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Surveys ({surveys.length})
        </button>
      </div>

      {tab === 'events' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Event Title</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Date & Location</th>
                <th className="py-3 px-4 text-left">Attendees Enrolled</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{e.title}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{e.category}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDate(e.date)} · {e.location}</td>
                  <td className="py-3 px-4 text-xs font-mono font-medium">{e.registeredCount} / {e.maxAttendees}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {e.registrationOpen ? 'Open' : 'Closed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'volunteers' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Volunteer Initiative</th>
                <th className="py-3 px-4 text-left">Organization</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Volunteers Applied</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{v.title}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{v.organization}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDate(v.date)}</td>
                  <td className="py-3 px-4 text-xs font-mono font-medium">{v.appliedCount} / {v.requiredVolunteers}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'surveys' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Survey Consultation</th>
                <th className="py-3 px-4 text-left">Questions</th>
                <th className="py-3 px-4 text-left">Deadline</th>
                <th className="py-3 px-4 text-left">Citizen Responses</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {surveys.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{s.title}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{s.questions.length} questions</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDate(s.deadline)}</td>
                  <td className="py-3 px-4 text-xs font-mono font-medium">{s.respondedBy.length} submissions</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Community Engagement Entry">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
            <input type="text" placeholder="Title of the campaign..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold">Publish</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
