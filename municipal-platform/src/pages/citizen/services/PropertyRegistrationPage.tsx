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
  type: 'text' | 'select' | 'file' | 'number';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const PROPERTY_REG_STEPS: FormStep[] = [
  {
    title: 'Property & Holding Location',
    fields: [
      { id: 'ward', label: 'Ward', type: 'select', options: ['Ward 01', 'Ward 02', 'Ward 03', 'Ward 04', 'Ward 05', 'Ward 06', 'Ward 07', 'Ward 08', 'Ward 09', 'Ward 10', 'Ward 19', 'Ward 20'], required: true },
      { id: 'holdingAddress', label: 'Holding / Premises Address', type: 'text', placeholder: 'House/Plot No, Road No, Block/Sector', required: true },
      { id: 'mouza', label: 'Mouza & Khatian Number', type: 'text', placeholder: 'e.g. Mouza: Senpara Parbata, Khatian: 421', required: true },
      { id: 'propertyType', label: 'Nature of Property', type: 'select', options: ['Residential Building', 'Commercial Complex', 'Mixed Use (Residential + Commercial)', 'Vacant Land / Plot', 'Industrial / Warehouse'], required: true },
    ],
  },
  {
    title: 'Building & Construction Specifications',
    fields: [
      { id: 'numberOfFloors', label: 'Total Number of Floors / Stories', type: 'select', options: ['Single Storey (1)', '2 - 3 Stories', '4 - 6 Stories', '7 - 10 Stories', 'High-rise (10+ Stories)'], required: true },
      { id: 'totalFloorArea', label: 'Total Covered Area (sq. ft.)', type: 'number', placeholder: 'e.g. 3500', required: true },
      { id: 'constructionYear', label: 'Year of Construction / Completion', type: 'text', placeholder: 'e.g. 2021', required: true },
      { id: 'rajukPlanNo', label: 'RAJUK / Municipal Approved Plan Approval No', type: 'text', placeholder: 'Approval reference code', required: true },
    ],
  },
  {
    title: 'Ownership & Legal Records',
    fields: [
      { id: 'ownerName', label: 'Primary Title Owner Name', type: 'text', placeholder: 'As in legal deed', required: true },
      { id: 'ownerNID', label: 'Owner National ID (NID)', type: 'text', placeholder: '10 or 17 digit NID', required: true },
      { id: 'ownerPhone', label: 'Owner Contact Mobile Number', type: 'text', placeholder: '01XXXXXXXXX', required: true },
      { id: 'doc_deed', label: 'Registered Purchase Deed / Ownership Title Copy', type: 'file', required: true },
      { id: 'doc_mutation', label: 'Land Mutation (Namzari) & Dakhila Copy', type: 'file', required: true },
      { id: 'doc_approved_plan', label: 'Approved Architectural Building Plan', type: 'file', required: true },
    ],
  },
];

export function PropertyRegistrationPage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = PROPERTY_REG_STEPS[step];

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
      if (step < PROPERTY_REG_STEPS.length - 1) setStep(s => s + 1);
      else handleSubmit();
    }
  };

  const handleSubmit = () => {
    const app = submitApplication({
      serviceType: 'property-registration',
      serviceName: 'Property / Holding Registration',
      submittedBy: currentUser?.id || 'citizen-001',
      details: formData,
      documents: Object.keys(formData).filter(k => k.startsWith('doc_')).map(k => formData[k] || `${k}.pdf`),
      paymentRequired: false,
      department: 'Revenue & Property Tax Assessment Unit',
    });
    setSubmittedApp(app);
  };

  if (submittedApp) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Request Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your holding registration request has been submitted for field assessment.</p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">Property Registration</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Assigned Unit</span><span className="text-gray-700">Property Tax Assessment Unit</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Next Action</span><span className="text-indigo-600 font-medium">Physical Assessment & Holding No. Issuance</span></div>
          </div>
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
          <h1 className="text-xl font-bold text-gray-900">Property / Holding Registration</h1>
          <p className="text-sm text-gray-500">Step {step + 1} of {PROPERTY_REG_STEPS.length}: {currentStep.title}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {PROPERTY_REG_STEPS.map((_, i) => (
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
            {step < PROPERTY_REG_STEPS.length - 1 ? 'Continue' : 'Submit Registration Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
