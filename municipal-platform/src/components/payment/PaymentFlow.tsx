import { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils';

interface PaymentFlowProps {
  service: string;
  referenceId: string;
  amount: number;
  dueDate?: string;
  applicantName?: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

const PAYMENT_METHODS = [
  { id: 'bkash', label: 'bKash', category: 'Mobile Financial Service', icon: Smartphone },
  { id: 'nagad', label: 'Nagad', category: 'Mobile Financial Service', icon: Smartphone },
  { id: 'rocket', label: 'Rocket', category: 'Mobile Financial Service', icon: Smartphone },
  { id: 'visa', label: 'VISA / MasterCard', category: 'Card', icon: CreditCard },
  { id: 'dbbl', label: 'DBBL Internet Banking', category: 'Internet Banking', icon: Building2 },
  { id: 'ebl', label: 'EBL Internet Banking', category: 'Internet Banking', icon: Building2 },
];

export function PaymentFlow({ service, referenceId, amount, dueDate, applicantName, onSuccess, onCancel }: PaymentFlowProps) {
  const { makePayment, currentUser } = useApp();
  const [step, setStep] = useState<'summary' | 'method' | 'processing' | 'success' | 'failed'>('summary');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [transaction, setTransaction] = useState<{ transactionId: string; paidAt: string } | null>(null);

  const handlePay = () => {
    if (!selectedMethod) return;
    setStep('processing');
    setTimeout(() => {
      const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
      const payment = makePayment(
        referenceId,
        service,
        amount,
        method ? `${method.label} (${method.category})` : selectedMethod,
        applicantName || currentUser?.name || 'Citizen',
      );
      setTransaction({ transactionId: payment.transactionId, paidAt: payment.paidAt });
      setStep('success');
      if (onSuccess) onSuccess(payment.transactionId);
    }, 2000);
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-[#1a4b8c] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Processing your payment...</p>
        <p className="text-sm text-gray-500 mt-1">Please do not close this window.</p>
      </div>
    );
  }

  if (step === 'success' && transaction) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Successful</h3>
        <p className="text-gray-500 mb-6">Your payment has been processed successfully.</p>
        <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6 border border-gray-200">
          <Row label="Transaction ID" value={transaction.transactionId} mono />
          <Row label="Reference ID" value={referenceId} mono />
          <Row label="Service" value={service} />
          <Row label="Amount" value={formatCurrency(amount)} bold />
          <Row label="Date & Time" value={formatDateTime(transaction.paidAt)} />
          <Row label="Payment Method" value={PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || selectedMethod} />
          <Row label="Status" value="Successful" success />
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 mx-auto text-sm text-[#1a4b8c] hover:underline">
          <Download size={16} /> Download Receipt
        </button>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Failed</h3>
        <p className="text-gray-500 mb-6">Your payment could not be processed. Please try again.</p>
        <button onClick={() => setStep('method')} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {step === 'summary' && (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="bg-[#1a4b8c]/5 rounded-xl p-5 space-y-3 mb-6 border border-[#1a4b8c]/10">
            <Row label="Service" value={service} />
            <Row label="Reference ID" value={referenceId} mono />
            <Row label="Applicant" value={applicantName || currentUser?.name || '—'} />
            {dueDate && <Row label="Due Date" value={dueDate} />}
            <div className="border-t border-gray-200 pt-3">
              <Row label="Amount Payable" value={formatCurrency(amount)} bold />
            </div>
          </div>
          <div className="flex gap-3">
            {onCancel && <button onClick={onCancel} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>}
            <button onClick={() => setStep('method')} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold hover:bg-[#0f3060] transition-colors">Proceed to Payment</button>
          </div>
        </>
      )}

      {step === 'method' && (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Select Payment Method</h3>
          <p className="text-sm text-gray-500 mb-4">Choose how you would like to pay {formatCurrency(amount)}</p>
          <div className="space-y-2 mb-6">
            {PAYMENT_METHODS.map(m => (
              <label key={m.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedMethod === m.id ? 'border-[#1a4b8c] bg-[#1a4b8c]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value={m.id} checked={selectedMethod === m.id} onChange={() => setSelectedMethod(m.id)} className="accent-[#1a4b8c]" />
                <m.icon size={18} className="text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.category}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('summary')} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={handlePay} disabled={!selectedMethod} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg font-semibold hover:bg-[#0f3060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Pay {formatCurrency(amount)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, mono, bold, success }: { label: string; value: string; mono?: boolean; bold?: boolean; success?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-right ${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-gray-900' : 'text-gray-800'} ${success ? 'text-green-600 font-semibold' : ''}`}>{value}</span>
    </div>
  );
}
