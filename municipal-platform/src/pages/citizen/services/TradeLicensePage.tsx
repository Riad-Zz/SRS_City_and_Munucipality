import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, ArrowLeft, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { Modal } from '../../../components/ui/Modal';
import { PaymentFlow } from '../../../components/payment/PaymentFlow';

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

const TRADE_LICENSE_STEPS: FormStep[] = [
  {
    title: 'Business Enterprise Details',
    fields: [
      { id: 'businessName', label: 'Business / Company Name', type: 'text', placeholder: 'Official legal name of enterprise', required: true },
      { id: 'businessType', label: 'Type of Ownership', type: 'select', options: ['Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company'], required: true },
      { id: 'businessCategory', label: 'Business Sector / Category', type: 'select', options: ['Retail & Trading', 'Information Technology / Software', 'Food & Restaurant', 'Manufacturing & Industry', 'Healthcare & Pharmacy', 'Consulting & Professional Services', 'Construction & Real Estate'], required: true },
      { id: 'ward', label: 'Ward Location', type: 'select', options: ['Ward 01', 'Ward 02', 'Ward 03', 'Ward 04', 'Ward 05', 'Ward 06', 'Ward 07', 'Ward 08', 'Ward 09', 'Ward 10', 'Ward 19', 'Ward 20'], required: true },
      { id: 'businessAddress', label: 'Commercial Business Address', type: 'text', placeholder: 'Holding, Road, Sector, Area', required: true },
    ],
  },
  {
    title: 'Proprietor / Managing Director Information',
    fields: [
      { id: 'ownerName', label: 'Owner / Managing Director Name', type: 'text', placeholder: 'Full legal name', required: true },
      { id: 'ownerPhone', label: 'Contact Phone Number', type: 'text', placeholder: '01XXXXXXXXX', required: true },
      { id: 'ownerEmail', label: 'Official Business Email', type: 'text', placeholder: 'name@business.com', required: true },
      { id: 'ownerNID', label: 'National ID (NID) Number', type: 'text', placeholder: '10 or 17 digit NID', required: true },
      { id: 'tinNumber', label: 'e-TIN Number', type: 'text', placeholder: '12-digit Taxpayer Identification Number', required: true },
    ],
  },
  {
    title: 'Statutory Documents Upload',
    fields: [
      { id: 'doc_tin', label: 'e-TIN Certificate Copy', type: 'file', required: true },
      { id: 'doc_rent_deed', label: 'Commercial Space Rental Agreement or Ownership Deed', type: 'file', required: true },
      { id: 'doc_nid', label: 'Proprietor / Director NID Copy', type: 'file', required: true },
      { id: 'doc_photo', label: 'Passport Size Photograph', type: 'file', required: true },
    ],
  },
];

export function TradeLicensePage() {
  const navigate = useNavigate();
  const { submitApplication, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);

  const currentStep = TRADE_LICENSE_STEPS[step];

  // Statutory fee calculation based on ownership
  const licenseFee = formData.businessType === 'Private Limited Company' ? 8500 :
                     formData.businessType === 'Partnership' ? 5000 : 3000;

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
      if (step < TRADE_LICENSE_STEPS.length - 1) setStep(s => s + 1);
      else handleSubmit();
    }
  };

  const handleSubmit = () => {
    const app = submitApplication({
      serviceType: 'trade-license',
      serviceName: 'New Trade License Application',
      submittedBy: currentUser?.id || 'citizen-001',
      details: { ...formData, statutoryFee: `BDT ${licenseFee}` },
      documents: Object.keys(formData).filter(k => k.startsWith('doc_')).map(k => formData[k] || `${k}.pdf`),
      paymentRequired: true,
      paymentAmount: licenseFee,
      paymentStatus: 'Pending',
      department: 'Revenue & Trade Licensing Unit',
    });
    setSubmittedApp(app);
  };

  if (submittedApp) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trade License Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your trade license application is registered for administrative verification.</p>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5 text-sm text-left mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Application ID</span><span className="font-mono font-bold text-[#1a4b8c]">{submittedApp.appId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Enterprise</span><span className="font-semibold text-gray-900">{formData.businessName || 'Business Enterprise'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">License Fee</span><span className="font-bold text-gray-900">{formatCurrency(licenseFee)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Status</span><span className="text-amber-600 font-semibold">{submittedApp.paymentStatus || 'Pending'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Department</span><span className="text-gray-700">Revenue & Trade Licensing Unit</span></div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left mb-6">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Central Payment System Notice</p>
            <p className="text-xs text-amber-700 mt-1">
              You can pay the statutory license fee now through the Central Payment System, or pay once your application document review is marked Approved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPayment(true)}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard size={16} /> Pay Fee Now ({formatCurrency(licenseFee)})
            </button>
            <button
              onClick={() => navigate(`/citizen/applications/${submittedApp.id}`)}
              className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold text-sm hover:bg-[#0f3060] transition-colors"
            >
              Track Application
            </button>
          </div>
        </div>

        <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Trade License Fee Payment">
          <PaymentFlow
            service="New Trade License Application"
            referenceId={submittedApp.appId}
            amount={licenseFee}
            applicantName={currentUser?.name}
            onSuccess={() => setTimeout(() => setShowPayment(false), 2500)}
            onCancel={() => setShowPayment(false)}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/citizen/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={18} className="text-gray-500" /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Trade License Application</h1>
          <p className="text-sm text-gray-500">Step {step + 1} of {TRADE_LICENSE_STEPS.length}: {currentStep.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {TRADE_LICENSE_STEPS.map((_, i) => (
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
                      <span className="text-sm text-gray-500">Click to upload {field.label} (PDF/PNG)</span>
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

        {step === 0 && (
          <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-lg flex items-center justify-between text-xs text-blue-900">
            <span>Estimated Statutory License Fee:</span>
            <span className="font-bold text-sm text-[#1a4b8c]">{formatCurrency(licenseFee)}</span>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Back</button>}
          <button onClick={handleNext} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] transition-colors">
            {step < TRADE_LICENSE_STEPS.length - 1 ? 'Continue' : 'Submit Application & Review Fee'}
          </button>
        </div>
      </div>
    </div>
  );
}
