import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const BIRTH_REG_STEPS: FormStep[] = [
  {
    title: 'Applicant Information',
    fields: [
      { id: 'applicantName', label: 'Applicant Name', type: 'text', placeholder: 'Full name of applicant', required: true },
      { id: 'applicantPhone', label: 'Phone Number', type: 'text', placeholder: '01XXXXXXXXX', required: true },
      { id: 'applicantNID', label: 'NID Number', type: 'text', placeholder: 'National ID number', required: true },
      { id: 'ward', label: 'Ward', type: 'select', options: ['Ward 01', 'Ward 02', 'Ward 03', 'Ward 04', 'Ward 05', 'Ward 06', 'Ward 07', 'Ward 08', 'Ward 09', 'Ward 10', 'Ward 19', 'Ward 20'], required: true },
    ],
  },
  {
    title: 'Birth Information',
    fields: [
      { id: 'childName', label: "Child's Name", type: 'text', placeholder: "Full name of child", required: true },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { id: 'placeOfBirth', label: 'Place of Birth', type: 'text', placeholder: 'Hospital or location', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
    ],
  },
  {
    title: 'Parent / Guardian Information',
    fields: [
      { id: 'fatherName', label: "Father's Name", type: 'text', placeholder: "Father's full name", required: true },
      { id: 'fatherNID', label: "Father's NID", type: 'text', placeholder: "Father's NID number" },
      { id: 'motherName', label: "Mother's Name", type: 'text', placeholder: "Mother's full name", required: true },
      { id: 'motherNID', label: "Mother's NID", type: 'text', placeholder: "Mother's NID number" },
    ],
  },
  {
    title: 'Required Documents',
    fields: [
      { id: 'doc_hospital', label: 'Hospital Birth Certificate / Discharge Summary', type: 'file', required: true },
      { id: 'doc_parent_nid', label: "Parent's NID (both sides)", type: 'file', required: true },
      { id: 'doc_marriage', label: 'Marriage Certificate of Parents', type: 'file' },
    ],
  },
];

export function BirthRegistrationPage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = BIRTH_REG_STEPS[step];

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
      if (step < BIRTH_REG_STEPS.length - 1) setStep(s => s + 1);
      else handleSubmit();
    }
  };

  const handleSubmit = () => {
    const app = submitApplication({
      serviceType: 'birth-registration',
      serviceName: 'Birth Registration',
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
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your birth registration application has been received.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">Birth Registration</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-blue-600 font-medium">Submitted</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Processing Time</span><span className="font-medium">7 working days</span></div>
          </div>
          <p className="text-sm text-gray-500 mb-6">You will be notified when the status of your application changes. You can track it in <strong>My Applications</strong>.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm">Track Application</button>
            <button onClick={() => navigate('/citizen/services')} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm">Back to Services</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Birth Registration</h1>
          <p className="text-sm text-gray-500">Step {step + 1} of {BIRTH_REG_STEPS.length}: {currentStep.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {BIRTH_REG_STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-[#1a4b8c]' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
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
                      <span className="text-sm text-gray-500">Click to upload file</span>
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
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>}
          <button onClick={handleNext} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060]">
            {step < BIRTH_REG_STEPS.length - 1 ? 'Continue' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
