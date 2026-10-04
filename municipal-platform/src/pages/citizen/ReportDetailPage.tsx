import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { MapPin, ArrowLeft, Image } from 'lucide-react';
import { formatDateTime } from '../../utils';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_STEPS = ['Submitted', 'Received', 'Assigned', 'In Progress', 'Resolved'];

export function ReportDetailPage() {
  const { id } = useParams();
  const { reports } = useApp();
  const report = reports.find(r => r.id === id);

  if (!report) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Report not found.</p>
      <Link to="/citizen/reports" className="text-[#1a4b8c] text-sm hover:underline mt-2 inline-block">← Back to reports</Link>
    </div>
  );

  const currentStepIndex = STATUS_STEPS.indexOf(report.status);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/citizen/reports" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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

      {/* Progress bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Report Progress</h2>
        <div className="flex items-center">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${i <= currentStepIndex ? '' : 'opacity-30'}`} style={{ flex: '0 0 auto' }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < currentStepIndex ? 'bg-green-500 text-white' : i === currentStepIndex ? 'bg-[#1a4b8c] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < currentStepIndex ? '✓' : i + 1}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 text-center leading-tight hidden sm:block">{s}</span>
              </div>
              {i < 4 && <div className={`flex-1 h-1 mx-1 rounded ${i < currentStepIndex ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Report Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-500 text-xs">Tracking ID</p><p className="font-mono font-medium mt-0.5">{report.trackingId}</p></div>
          <div><p className="text-gray-500 text-xs">Problem Type</p><p className="font-medium mt-0.5">{report.type}</p></div>
          <div><p className="text-gray-500 text-xs">Submitted</p><p className="font-medium mt-0.5">{formatDateTime(report.submittedAt)}</p></div>
          <div><p className="text-gray-500 text-xs">Last Updated</p><p className="font-medium mt-0.5">{formatDateTime(report.updatedAt)}</p></div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Location</p>
          <p className="text-sm font-medium flex items-center gap-1"><MapPin size={12} className="text-gray-400" /> {report.location}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Description</p>
          <p className="text-sm text-gray-800 leading-relaxed">{report.description}</p>
        </div>
        {report.evidence.length > 0 && (
          <div>
            <p className="text-gray-500 text-xs mb-2">Evidence ({report.evidence.length} file{report.evidence.length !== 1 ? 's' : ''})</p>
            <div className="flex gap-2 flex-wrap">
              {report.evidence.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600">
                  <Image size={12} /> {e}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Problem Location</h2>
        </div>
        <div style={{ height: 250 }}>
          <MapContainer center={report.coordinates} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            <Marker position={report.coordinates} />
          </MapContainer>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Status Timeline</h2>
        <StatusTimeline timeline={report.timeline} />
      </div>
    </div>
  );
}
