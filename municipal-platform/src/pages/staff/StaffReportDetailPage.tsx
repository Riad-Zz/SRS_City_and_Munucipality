import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, MapPin, Camera, Send } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { formatDateTime, REPORT_STATUS_STEPS } from '../../utils';
import type { ReportStatus } from '../../types';

export function StaffReportDetailPage() {
  const { id } = useParams();
  const { reports, updateReportStatus, currentUser } = useApp();
  const report = reports.find(r => r.id === id);

  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('');
  const [officerNote, setOfficerNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Report not found.</p>
        <Link to="/staff/reports" className="text-[#1a4b8c] text-sm hover:underline mt-2 inline-block">
          ← Back to reports
        </Link>
      </div>
    );
  }

  const currentStepIdx = REPORT_STATUS_STEPS.indexOf(report.status);
  const nextRecommendedStep = currentStepIdx < REPORT_STATUS_STEPS.length - 1
    ? REPORT_STATUS_STEPS[currentStepIdx + 1]
    : null;

  const handleUpdate = (targetStatus: ReportStatus) => {
    const note = officerNote.trim() || `Status updated to ${targetStatus} by ${currentUser?.name || 'Department Officer'}.`;
    updateReportStatus(report.id, targetStatus, note, currentUser?.name || 'Municipal Officer');
    setOfficerNote('');
    setSelectedStatus('');
    setActionSuccess(true);
    setTimeout(() => setActionSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link to="/staff/reports" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{report.type}</h1>
          <p className="text-sm font-mono text-gray-400">{report.trackingId}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={report.status} />
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600" />
          Status updated successfully! Notification dispatched to citizen ({report.trackingId}).
        </div>
      )}

      {/* Staff Action Console (FR-25 & FR-26) */}
      <div className="bg-white border-2 border-[#1a4b8c]/20 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Update Report Status & Dispatch Citizen Notification
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Strict SRS status sequence: Submitted → Received → Assigned → In Progress → Resolved.
          </p>
        </div>

        {/* Quick next step button */}
        {nextRecommendedStep && (
          <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-lg flex items-center justify-between">
            <span className="text-xs text-blue-900">
              Next recommended stage: <strong>{nextRecommendedStep}</strong>
            </span>
            <button
              onClick={() => handleUpdate(nextRecommendedStep)}
              className="px-3.5 py-1.5 bg-[#1a4b8c] hover:bg-[#0f3060] text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              Advance to {nextRecommendedStep} →
            </button>
          </div>
        )}

        {/* Custom status selector with note */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {REPORT_STATUS_STEPS.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  report.status === s
                    ? 'bg-gray-200 text-gray-800 cursor-default'
                    : selectedStatus === s
                    ? 'bg-[#1a4b8c] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s} {report.status === s && '(Current)'}
              </button>
            ))}
          </div>

          {selectedStatus && selectedStatus !== report.status && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Officer Remarks / Action Log for {selectedStatus} *
                </label>
                <textarea
                  rows={2}
                  value={officerNote}
                  onChange={e => setOfficerNote(e.target.value)}
                  placeholder={`Describe the action taken (e.g. Field team dispatched, repair completed)...`}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                />
              </div>
              <button
                onClick={() => handleUpdate(selectedStatus)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send size={13} /> Confirm Status: {selectedStatus} & Notify Citizen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Report Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div><p className="text-xs text-gray-500 font-medium">Tracking ID</p><p className="font-mono font-bold text-[#1a4b8c] mt-0.5">{report.trackingId}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Problem Type</p><p className="font-semibold text-gray-900 mt-0.5">{report.type}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Assigned Department</p><p className="font-medium text-gray-800 mt-0.5">{report.assignedDepartment}</p></div>
          <div><p className="text-xs text-gray-500 font-medium">Submission Timestamp</p><p className="font-medium text-gray-800 mt-0.5">{formatDateTime(report.submittedAt)}</p></div>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Reported Location</p>
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <MapPin size={15} className="text-red-500" /> {report.location}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Citizen Problem Description</p>
          <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
            {report.description}
          </p>
        </div>

        {report.evidence.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Uploaded Citizen Evidence</p>
            <div className="flex gap-2 flex-wrap">
              {report.evidence.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                  <Camera size={13} className="text-[#1a4b8c]" /> {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Report Lifecycle Timeline</h2>
        <StatusTimeline timeline={report.timeline} />
      </div>
    </div>
  );
}
