import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'file';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const DEATH_CERT_STEPS: FormStep[] = [
  {
    title: 'Applicant Information',
    fields: [
      { id: 'applicantName', label: 'Applicant Name', type: 'text', placeholder: 'Full name of applicant', required: true },
      { id: 'applicantPhone', label: 'Phone Number', type: 'text', placeholder: '01XXXXXXXXX', required: true },
      { id: 'applicantNID', label: 'Applicant NID Number', type: 'text', placeholder: '10 or 17 digit NID', required: true },
      { id: 'relation', label: 'Relationship to Deceased', type: 'select', options: ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Legal Guardian'], required: true },
      { id: 'ward', label: 'Ward', type: 'select', options: ['Ward 01', 'Ward 02', 'Ward 03', 'Ward 04', 'Ward 05', 'Ward 06', 'Ward 07', 'Ward 08', 'Ward 09', 'Ward 10', 'Ward 19', 'Ward 20'], required: true },
    ],
  },
  {
    title: 'Deceased Person Information',
    fields: [
      { id: 'deceasedName', label: 'Full Name of Deceased', type: 'text', placeholder: 'Full legal name', required: true },
      { id: 'deceasedNID', label: 'Deceased NID / Birth Reg No.', type: 'text', placeholder: 'NID or Birth Reg Number', required: true },
      { id: 'dateOfDeath', label: 'Date of Death', type: 'date', required: true },
      { id: 'placeOfDeath', label: 'Place of Death', type: 'text', placeholder: 'Hospital or Home address', required: true },
      { id: 'causeOfDeath', label: 'Cause of Death', type: 'text', placeholder: 'As certified by medical authority', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
    ],
  },
  {
    title: 'Required Supporting Documents',
    fields: [
      { id: 'doc_death_certificate', label: 'Hospital Death Certificate / Medical Attendant Proof', type: 'file', required: true },
      { id: 'doc_burial_slip', label: 'Graveyard / Crematorium Burial Slip', type: 'file', required: true },
      { id: 'doc_applicant_nid', label: 'Applicant NID Photocopy', type: 'file', required: true },
      { id: 'doc_deceased_nid', label: 'Deceased NID / Smart Card', type: 'file' },
    ],
  },
];

export function DeathCertificatePage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = DEATH_CERT_STEPS[step];

  const validate = () => {
    const errs: Record<string, string> = {};
    currentStep.fields.filter(f => f.required && f.type !== 'file').forEach(f => {
      if (!formData[f.id]) errs[f.id] = `${f.label} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (step < DEATH_CERT_STEPS.length - 1) setStep(s => s + 1);
      else handleSubmit();
    }
  };

  const handleSubmit = () => {
    const app = submitApplication({
      serviceType: 'death-certificate',
      serviceName: 'Death Certificate Application',
      submittedBy: currentUser?.id || 'citizen-001',
      details: formData,
      documents: Object.keys(formData).filter(k => k.startsWith('doc_')).map(k => formData[k] || `${k}.pdf`),
      paymentRequired: false,
      department: 'Civil Registration Unit',
    });
    setSubmittedApp(app);
  };

  if (submittedApp) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your death certificate application has been recorded.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">Death Certificate</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-blue-600 font-medium">Submitted</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Estimated Review</span><span className="font-medium">3-5 working days</span></div>
          </div>
          <p className="text-sm text-gray-500 mb-6">Status updates will be notified via the Central Notification System and visible in <strong>My Applications</strong>.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors">Track Application</button>
            <button onClick={() => navigate('/citizen/services')} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">Back to Services</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Death Certificate Application</h1>
          <p className="text-sm text-gray-500">Step {step + 1} of {DEATH_CERT_STEPS.length}: {currentStep.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {DEATH_CERT_STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-[#1a4b8c]' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{currentStep.title}</h2>
        <div className="space-y-4">
          {currentStep.fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={e => { setFormData(d => ({ ...d, [field.id]: e.target.value })); setErrors(e2 => { const n = { ...e2 }; delete n[field.id]; return n; }); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                >
                  <option value="">Select...</option>
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1a4b8c]/40 transition-colors">
                  <input type="file" className="hidden" id={field.id} onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setFormData(d => ({ ...d, [field.id]: f.name }));
                  }} />
                  <label htmlFor={field.id} className="cursor-pointer">
                    {formData[field.id] ? (
                      <span className="text-sm text-green-600 font-medium">✓ {formData[field.id]}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Click to upload document (PDF / JPG)</span>
                    )}
                  </label>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={e => { setFormData(d => ({ ...d, [field.id]: e.target.value })); setErrors(e2 => { const n = { ...e2 }; delete n[field.id]; return n; }); }}
                  placeholder={field.placeholder}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 ${errors[field.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
              )}
              {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Back</button>}
          <button onClick={handleNext} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors">
            {step < DEATH_CERT_STEPS.length - 1 ? 'Continue' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
