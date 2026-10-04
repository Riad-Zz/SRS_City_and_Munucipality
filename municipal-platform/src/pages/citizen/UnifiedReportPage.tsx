import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, CheckCircle2, AlertTriangle, Camera, X, Locate } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { REPORT_TYPES } from '../../utils';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const REPORT_TYPE_ICONS: Record<string, string> = {
  'Road Damage': '🛣️', 'Pothole': '🕳️', 'Broken Streetlight': '💡', 'Drainage Problem': '🌊',
  'Waterlogging': '💧', 'Garbage': '🗑️', 'Illegal Dumping': '⚠️', 'Public Toilet Problem': '🚻',
  'Park/Playground Problem': '🌳', 'Market Problem': '🏪', 'Water Supply Problem': '🚰', 'Other': '📋',
};

function LocationPicker({ coords, onSelect }: { coords: [number, number]; onSelect: (c: [number, number]) => void }) {
  useMapEvents({ click: (e) => onSelect([e.latlng.lat, e.latlng.lng]) });
  return <Marker position={coords} />;
}

export function UnifiedReportPage() {
  const navigate = useNavigate();
  const { submitReport, currentUser } = useApp();

  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [coords, setCoords] = useState<[number, number]>([23.8103, 90.4125]);
  const [locationText, setLocationText] = useState('');
  const [locatingGPS, setLocatingGPS] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<{ name: string; type: string; url: string }[]>([]);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGPS = () => {
    setLocatingGPS(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
          setLocationText(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (GPS)`);
          setLocatingGPS(false);
        },
        () => {
          setLocationText('Mirpur Section 10, Ward 07, Dhaka (GPS)');
          setLocatingGPS(false);
        }
      );
    } else {
      setLocationText('Mirpur Section 10, Ward 07, Dhaka (GPS)');
      setLocatingGPS(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).map(f => ({
      name: f.name,
      type: f.type,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 1 && !type) errs.type = 'Please select a problem type.';
    if (step === 2 && !locationText) errs.location = 'Please set the report location.';
    if (step === 3 && !description.trim()) errs.description = 'Please describe the problem.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleSubmit = () => {
    const report = submitReport({
      type,
      location: locationText || `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`,
      coordinates: coords,
      description,
      evidence: files.map(f => f.name),
      submittedBy: currentUser?.id || 'citizen-001',
    });
    setSubmittedReport(report);
    setStep(6);
  };

  const STEPS = ['Problem Type', 'Location', 'Description', 'Evidence', 'Review'];

  if (step === 6 && submittedReport) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-500 text-sm mb-6">Your report has been received and is being processed.</p>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Tracking ID</span>
              <span className="text-sm font-bold font-mono text-[#1a4b8c]">{submittedReport.trackingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Problem Type</span>
              <span className="text-sm font-medium">{submittedReport.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Location</span>
              <span className="text-sm font-medium text-right max-w-40">{submittedReport.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium text-blue-600">Submitted</span>
            </div>
          </div>

          {/* Status pipeline */}
          <div className="flex items-center justify-between mb-6 px-2">
            {['Submitted', 'Received', 'Assigned', 'In Progress', 'Resolved'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex flex-col items-center ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-[#1a4b8c] text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                  <span className="text-[9px] text-gray-500 mt-1 hidden sm:block text-center leading-tight">{s}</span>
                </div>
                {i < 4 && <div className={`h-0.5 w-4 sm:w-8 mx-1 ${i === 0 ? 'bg-gray-200' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs text-blue-700 font-medium">Your report has been automatically routed to the responsible department. You will be notified as the status changes.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(`/citizen/reports/${submittedReport.id}`)} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors">
              Track Report
            </button>
            <button onClick={() => { setStep(1); setType(''); setDescription(''); setFiles([]); setLocationText(''); setSubmittedReport(null); }} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#1a4b8c]" /> Report a Problem
        </h1>
        <p className="text-sm text-gray-500 mt-1">Report any municipal problem. You do not need to know which department handles it.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className={`flex items-center gap-1.5 text-sm ${step === i + 1 ? 'font-semibold text-[#1a4b8c]' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step === i + 1 ? 'bg-[#1a4b8c] text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < 4 && <div className="w-6 sm:w-10 h-0.5 bg-gray-200 ml-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Step 1: Problem Type */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold mb-1">Select Problem Type</h2>
            <p className="text-sm text-gray-500 mb-4">Choose the category that best describes the problem.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {REPORT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => { setType(t); setErrors({}); }}
                  className={`flex flex-col items-center gap-2 p-3 border rounded-xl text-sm font-medium transition-all ${type === t ? 'border-[#1a4b8c] bg-[#1a4b8c]/5 text-[#1a4b8c]' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                >
                  <span className="text-2xl">{REPORT_TYPE_ICONS[t] || '📋'}</span>
                  <span className="text-center leading-tight text-xs">{t}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold mb-1">Set Location</h2>
            <p className="text-sm text-gray-500 mb-4">Use GPS or click on the map to mark where the problem is.</p>
            <div className="flex gap-2 mb-3">
              <button onClick={handleGPS} disabled={locatingGPS} className="flex items-center gap-2 px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-sm font-medium hover:bg-[#0f3060] transition-colors disabled:opacity-60">
                <Locate size={15} /> {locatingGPS ? 'Locating...' : 'Use My Location'}
              </button>
              <span className="text-sm text-gray-400 flex items-center">or click map below</span>
            </div>
            {locationText && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 mb-3 flex items-center gap-2">
                <MapPin size={14} /> {locationText}
              </div>
            )}
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 300 }}>
              <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <LocationPicker coords={coords} onSelect={(c) => { setCoords(c); setLocationText(`${c[0].toFixed(4)}, ${c[1].toFixed(4)} (Map)`); }} />
              </MapContainer>
            </div>
            <div className="mt-3">
              <label className="text-sm text-gray-600 font-medium block mb-1">Location description (optional)</label>
              <input
                type="text"
                value={locationText}
                onChange={e => setLocationText(e.target.value)}
                placeholder="e.g. Road 5, Mirpur Section 10, near bus stop"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              />
            </div>
            {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
          </div>
        )}

        {/* Step 3: Description */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold mb-1">Describe the Problem</h2>
            <p className="text-sm text-gray-500 mb-4">Provide details about the problem to help municipal staff address it effectively.</p>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors({}); }}
              placeholder="Describe the problem in detail. Include any relevant information such as how long it has been present, how severe it is, and any other relevant details."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 resize-none"
              rows={7}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <p className="text-xs text-gray-400 ml-auto">{description.length} characters</p>
            </div>
          </div>
        )}

        {/* Step 4: Evidence */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold mb-1">Upload Evidence (Optional)</h2>
            <p className="text-sm text-gray-500 mb-4">Photos or videos help staff verify and address the problem faster.</p>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1a4b8c]/50 hover:bg-[#1a4b8c]/2 transition-all">
              <Camera size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload photo or video</span>
              <span className="text-xs text-gray-400">JPG, PNG, MP4 up to 50MB</span>
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
            </label>
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((f, i) => (
                  <div key={i} className="relative border border-gray-200 rounded-lg overflow-hidden">
                    {f.url ? (
                      <img src={f.url} alt={f.name} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                        <Upload size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-gray-600 truncate">{f.name}</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Review Your Report</h2>
            <div className="space-y-4">
              <ReviewRow label="Problem Type" value={`${REPORT_TYPE_ICONS[type] || ''} ${type}`} />
              <ReviewRow label="Location" value={locationText || `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`} />
              <ReviewRow label="Description" value={description} multiline />
              <ReviewRow label="Evidence" value={files.length > 0 ? `${files.length} file(s) attached: ${files.map(f => f.name).join(', ')}` : 'No evidence uploaded'} />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-5">
              <p className="text-sm text-blue-800 font-medium">Automatic Internal Routing</p>
              <p className="text-sm text-blue-700 mt-1">Your report will be automatically routed to the appropriate municipal unit based on the problem type. You do not need to select any department.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Back
            </button>
          )}
          {step < 5 ? (
            <button onClick={handleNext} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors">
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm text-gray-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
    </div>
  );
}
