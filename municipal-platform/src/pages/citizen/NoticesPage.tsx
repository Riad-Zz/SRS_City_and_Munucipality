import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils';
import { Megaphone, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Tax', 'Licensing', 'Public Safety', 'Events', 'Infrastructure', 'Emergency'];

const CAT_COLORS: Record<string, string> = {
  Emergency: 'bg-red-50 text-red-700 border-red-200',
  'Public Safety': 'bg-orange-50 text-orange-700 border-orange-200',
  Tax: 'bg-amber-50 text-amber-700 border-amber-200',
  Licensing: 'bg-blue-50 text-blue-700 border-blue-200',
  Infrastructure: 'bg-gray-50 text-gray-700 border-gray-200',
  Events: 'bg-purple-50 text-purple-700 border-purple-200',
  General: 'bg-green-50 text-green-700 border-green-200',
};

export function NoticesPage() {
  const { notices } = useApp();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<any>(null);

  const active = notices.filter(n => n.active);
  const filtered = filter === 'All' ? active : active.filter(n => n.category === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Notice Board</h1>
        <p className="text-sm text-gray-500 mt-0.5">Official municipal notices and announcements.</p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${filter === c ? 'bg-[#1a4b8c] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a4b8c]/40'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(n => (
          <button key={n.id} onClick={() => setSelected(n)} className="w-full text-left bg-white border border-gray-200 hover:border-[#1a4b8c]/30 hover:shadow-sm rounded-xl p-4 transition-all">
            <div className="flex items-start gap-3">
              {n.important && (
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
              )}
              {!n.important && (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Megaphone size={16} className="text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm text-gray-900 ${n.important ? 'text-red-900' : ''}`}>{n.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${CAT_COLORS[n.category] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>{n.category}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.summary}</p>
                <p className="text-xs text-gray-400 mt-1.5">{formatDate(n.publishedAt)} · {n.publishedBy}</p>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Megaphone size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No notices in this category.</p>
          </div>
        )}
      </div>

      {/* Notice detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  {selected.important && <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full mb-2 inline-block">Important Notice</span>}
                  <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(selected.publishedAt)} · Published by {selected.publishedBy}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
