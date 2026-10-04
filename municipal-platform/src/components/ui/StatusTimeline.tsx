import { Check, Clock } from 'lucide-react';
import type { TimelineEntry } from '../../types';
import { formatDateTime } from '../../utils';

interface StatusTimelineProps {
  timeline: TimelineEntry[];
  steps?: string[];
}

export function StatusTimeline({ timeline, steps }: StatusTimelineProps) {
  const allSteps = steps || timeline.map(t => t.status);

  return (
    <div className="space-y-0">
      {timeline.map((entry, idx) => {
        const isLast = idx === timeline.length - 1;
        return (
          <div key={idx} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#1a4b8c] flex items-center justify-center flex-shrink-0 z-10">
                {isLast && allSteps[allSteps.length - 1] !== 'Resolved' ? (
                  <Clock size={14} className="text-white" />
                ) : (
                  <Check size={14} className="text-white" />
                )}
              </div>
              {!isLast && <div className="w-0.5 bg-[#1a4b8c] flex-1 min-h-8 my-1 opacity-30" />}
            </div>
            {/* Content */}
            <div className={`pb-6 ${isLast ? '' : ''}`}>
              <p className="font-semibold text-gray-900 text-sm">{entry.status}</p>
              {entry.note && <p className="text-sm text-gray-600 mt-0.5">{entry.note}</p>}
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(entry.timestamp)}{entry.updatedBy ? ` · ${entry.updatedBy}` : ''}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
