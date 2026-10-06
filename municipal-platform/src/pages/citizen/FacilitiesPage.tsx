import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { PaymentFlow } from '../../components/payment/PaymentFlow';
import { Clock, Phone, Users, CheckCircle2 } from 'lucide-react';
import type { Facility } from '../../types';

export function FacilitiesPage() {
  const { facilities, createBooking, currentUser } = useApp();
  const [selected, setSelected] = useState<Facility | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '', purpose: '' });
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [paying, setPaying] = useState(false);

  const TIME_SLOTS = ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM', '4:00 PM - 8:00 PM', '6:00 PM - 10:00 PM'];

  const handleBook = () => {
    if (!selected || !bookingData.date || !bookingData.timeSlot || !bookingData.purpose) return;
    const b = createBooking({
      facilityId: selected.id,
      facilityName: selected.name,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      purpose: bookingData.purpose,
      citizenName: currentUser?.name || '',
      amount: selected.fee || 0,
    });
    setConfirmedBooking(b);
    setBooking(false);
    if (selected.fee && selected.fee > 0) {
      setPaying(true);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Community Facilities</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and book municipal community facilities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(f => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#1a4b8c]/30 hover:shadow-md transition-all">
            <div className={`h-24 flex items-center justify-center text-4xl ${
              f.type === 'park' ? 'bg-green-50' :
              f.type === 'hospital' ? 'bg-red-50' :
              f.type === 'auditorium' ? 'bg-blue-50' :
              f.type === 'toilet' ? 'bg-gray-50' : 'bg-amber-50'
            }`}>
              {f.type === 'park' ? '🌳' : f.type === 'hospital' ? '🏥' : f.type === 'auditorium' ? '🏛️' : f.type === 'toilet' ? '🚻' : '🏪'}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{f.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{f.address}</p>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{f.description}</p>
              <div className="flex flex-col gap-1 mt-3 text-xs text-gray-500">
                {f.openingHours && <span className="flex items-center gap-1"><Clock size={11} /> {f.openingHours}</span>}
                {f.contact && <span className="flex items-center gap-1"><Phone size={11} /> {f.contact}</span>}
                {f.capacity && <span className="flex items-center gap-1"><Users size={11} /> Capacity: {f.capacity}</span>}
              </div>
              <div className="flex items-center justify-between mt-4">
                {f.fee ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">{formatCurrency(f.fee)}</span> : <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Free</span>}
                <button
                  onClick={() => { setSelected(f); f.bookable ? setBooking(true) : setSelected(f); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${f.bookable ? 'bg-[#1a4b8c] text-white hover:bg-[#0f3060]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f.bookable ? 'Book Now' : 'View Info'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking confirmed */}
      {confirmedBooking && !paying && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Booking Confirmed!</p>
              <p className="text-sm text-green-700 mt-0.5">Booking ID: {confirmedBooking.bookingId}</p>
              <p className="text-xs text-green-600 mt-0.5">{confirmedBooking.facilityName} · {confirmedBooking.date} · {confirmedBooking.timeSlot}</p>
              {confirmedBooking.amount > 0 && <p className="text-xs text-green-600 mt-0.5">Amount: {formatCurrency(confirmedBooking.amount)} (payment pending)</p>}
            </div>
          </div>
        </div>
      )}

      {/* Booking modal */}
      <Modal open={booking} onClose={() => setBooking(false)} title={`Book: ${selected?.name}`}>
        {selected && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date *</label>
              <input type="date" value={bookingData.date} onChange={e => setBookingData(d => ({ ...d, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Time Slot *</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => setBookingData(d => ({ ...d, timeSlot: t }))} className={`py-2 px-3 text-xs border rounded-lg transition-colors ${bookingData.timeSlot === t ? 'border-[#1a4b8c] bg-[#1a4b8c]/5 text-[#1a4b8c] font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Purpose *</label>
              <input type="text" value={bookingData.purpose} onChange={e => setBookingData(d => ({ ...d, purpose: e.target.value }))} placeholder="e.g. Wedding reception, Conference, Cultural event" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30" />
            </div>
            {selected.fee && <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800"><strong>Fee: {formatCurrency(selected.fee)}</strong> — Payment required to confirm booking.</div>}
            <div className="flex gap-3">
              <button onClick={() => setBooking(false)} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleBook} disabled={!bookingData.date || !bookingData.timeSlot || !bookingData.purpose} className="flex-1 py-3 bg-[#1a4b8c] text-white rounded-lg text-sm font-semibold hover:bg-[#0f3060] disabled:opacity-50">Confirm Booking</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment modal */}
      <Modal open={paying} onClose={() => setPaying(false)} title="Complete Payment">
        {confirmedBooking && (
          <PaymentFlow
            service={`Facility Booking — ${confirmedBooking.facilityName}`}
            referenceId={confirmedBooking.bookingId}
            amount={confirmedBooking.amount}
            applicantName={currentUser?.name}
            onSuccess={() => setTimeout(() => setPaying(false), 3000)}
            onCancel={() => setPaying(false)}
          />
        )}
      </Modal>
    </div>
  );
}
