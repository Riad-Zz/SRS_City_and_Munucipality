import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils';
import { Calendar, MapPin, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

type Tab = 'events' | 'volunteers' | 'surveys';

export function EventsPage() {
  const { events, volunteers, surveys, currentUser, registerForEvent, applyForVolunteer, respondToSurvey } = useApp();
  const [tab, setTab] = useState<Tab>('events');
  const [surveyModal, setSurveyModal] = useState<any>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string | string[]>>({});
  const [surveyDone, setSurveyDone] = useState(false);

  const userId = currentUser?.id || '';

  const handleSurveySubmit = () => {
    if (surveyModal) {
      respondToSurvey(surveyModal.id, userId);
      setSurveyDone(true);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Events & Community</h1>
        <p className="text-sm text-gray-500 mt-0.5">Discover events, volunteer opportunities and surveys from the municipality.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['events', 'volunteers', 'surveys'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white shadow text-[#1a4b8c]' : 'text-gray-600 hover:text-gray-800'}`}>
            {t === 'events' ? '📅 Events' : t === 'volunteers' ? '🤝 Volunteer' : '📊 Surveys'}
          </button>
        ))}
      </div>

      {/* Events */}
      {tab === 'events' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map(e => {
            const registered = e.registeredBy.includes(userId);
            return (
              <div key={e.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{e.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-2">{e.title}</h3>
                  </div>
                  {registered && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{e.description}</p>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(e.date)} at {e.time}</p>
                  <p className="flex items-center gap-1.5"><MapPin size={12} /> {e.location}</p>
                  <p className="flex items-center gap-1.5"><Users size={12} /> {e.registeredCount}/{e.maxAttendees} registered · Organizer: {e.organizer}</p>
                </div>
                <button
                  onClick={() => !registered && registerForEvent(e.id, userId)}
                  disabled={registered || !e.registrationOpen || e.registeredCount >= e.maxAttendees}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${registered ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#1a4b8c] text-white hover:bg-[#0f3060] disabled:opacity-50'}`}
                >
                  {registered ? '✓ Registered' : e.registeredCount >= e.maxAttendees ? 'Event Full' : 'Register'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Volunteers */}
      {tab === 'volunteers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {volunteers.map(v => {
            const applied = v.appliedBy.includes(userId);
            return (
              <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{v.organization}</p>
                  </div>
                  {applied && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{v.description}</p>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(v.date)}</p>
                  <p className="flex items-center gap-1.5"><MapPin size={12} /> {v.location}</p>
                  <p className="flex items-center gap-1.5"><Users size={12} /> {v.appliedCount}/{v.requiredVolunteers} applied</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {v.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{s}</span>)}
                </div>
                <button
                  onClick={() => !applied && applyForVolunteer(v.id, userId)}
                  disabled={applied}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${applied ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#1a4b8c] text-white hover:bg-[#0f3060]'}`}
                >
                  {applied ? '✓ Applied' : 'Apply as Volunteer'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Surveys */}
      {tab === 'surveys' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {surveys.filter(s => s.active).map(s => {
            const responded = s.respondedBy.includes(userId);
            return (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{s.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Deadline: {formatDate(s.deadline)}</p>
                  <p>{s.respondedBy.length} responses · {s.questions.length} questions</p>
                </div>
                <button
                  onClick={() => { setSurveyModal(s); setSurveyAnswers({}); setSurveyDone(false); }}
                  disabled={responded}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${responded ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#1a4b8c] text-white hover:bg-[#0f3060]'}`}
                >
                  {responded ? '✓ Responded' : 'Take Survey'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Survey modal */}
      <Modal open={!!surveyModal} onClose={() => { setSurveyModal(null); setSurveyDone(false); }} title={surveyModal?.title || 'Survey'} size="lg">
        {surveyModal && (
          surveyDone ? (
            <div className="text-center py-8">
              <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">Thank you for your response!</h3>
              <p className="text-gray-500 text-sm mt-1">Your feedback helps the municipality improve services.</p>
              <button onClick={() => { setSurveyModal(null); setSurveyDone(false); }} className="mt-4 px-6 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold">Close</button>
            </div>
          ) : (
            <div className="space-y-6">
              {surveyModal.questions.map((q: any, i: number) => (
                <div key={q.id}>
                  <p className="text-sm font-semibold text-gray-900 mb-2">{i + 1}. {q.question}</p>
                  {q.type === 'text' && (
                    <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 resize-none" onChange={e => setSurveyAnswers(a => ({ ...a, [q.id]: e.target.value }))} />
                  )}
                  {(q.type === 'radio' || q.type === 'rating') && q.options?.map((o: string) => (
                    <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="radio" name={q.id} value={o} onChange={() => setSurveyAnswers(a => ({ ...a, [q.id]: o }))} className="accent-[#1a4b8c]" />
                      <span className="text-sm text-gray-700">{o}</span>
                    </label>
                  ))}
                  {q.type === 'checkbox' && q.options?.map((o: string) => (
                    <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" value={o} onChange={e => setSurveyAnswers(a => ({ ...a, [q.id]: [...(Array.isArray(a[q.id]) ? a[q.id] as string[] : []), o].filter(v => e.target.checked || v !== o) }))} className="accent-[#1a4b8c]" />
                      <span className="text-sm text-gray-700">{o}</span>
                    </label>
                  ))}
                </div>
              ))}
              <button onClick={handleSurveySubmit} className="w-full py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060]">Submit Response</button>
            </div>
          )
        )}
      </Modal>
    </div>
  );
}
