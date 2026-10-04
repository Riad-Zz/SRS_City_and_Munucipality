import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { AlertTriangle } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'park', label: '🌳 Parks' },
  { id: 'hospital', label: '🏥 Hospitals' },
  { id: 'toilet', label: '🚻 Public Toilets' },
  { id: 'market', label: '🏪 Markets' },
  { id: 'auditorium', label: '🏛️ Auditoriums' },
  { id: 'infrastructure', label: '🏛️ Infrastructure' },
  { id: 'waste', label: '🗑️ Waste Points' },
];

export function CityMapPage() {
  const { mapLocations } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  const filtered = activeCategory === 'all' ? mapLocations : mapLocations.filter(l => l.category === activeCategory);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">City Map</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse municipal facilities and infrastructure across the city.</p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${activeCategory === c.id ? 'bg-[#1a4b8c] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a4b8c]/40'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ height: 500 }}>
          <MapContainer center={[23.7951, 90.4044]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {filtered.map(loc => (
              <Marker key={loc.id} position={loc.coordinates} eventHandlers={{ click: () => setSelected(loc) }}>
                <Popup>
                  <div className="min-w-32">
                    <p className="font-semibold text-sm">{loc.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                    {loc.openingHours && <p className="text-xs text-gray-400 mt-0.5">⏰ {loc.openingHours}</p>}
                    {loc.contact && <p className="text-xs text-gray-400">📞 {loc.contact}</p>}
                    <button
                      onClick={() => navigate('/citizen/report')}
                      className="mt-2 text-xs text-[#1a4b8c] hover:underline flex items-center gap-1"
                    >
                      <AlertTriangle size={10} /> Report a Problem Here
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Location list */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-y-auto" style={{ maxHeight: 500 }}>
          <div className="p-4 border-b border-gray-100">
            <p className="font-semibold text-sm text-gray-900">{filtered.length} Location{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selected?.id === loc.id ? 'bg-[#1a4b8c]/5' : ''}`}
              >
                <p className="font-medium text-sm text-gray-900">{loc.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{loc.category} · {loc.address}</p>
                {loc.openingHours && <p className="text-xs text-gray-400 mt-0.5">⏰ {loc.openingHours}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected details */}
      {selected && (
        <div className="bg-white border border-[#1a4b8c]/20 rounded-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{selected.address}</p>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">{selected.category}</span>
          </div>
          {selected.description && <p className="text-sm text-gray-700 mt-3">{selected.description}</p>}
          <div className="flex gap-4 mt-3 text-sm flex-wrap">
            {selected.openingHours && <p className="text-gray-600">⏰ {selected.openingHours}</p>}
            {selected.contact && <p className="text-gray-600">📞 {selected.contact}</p>}
          </div>
          <button
            onClick={() => navigate('/citizen/report')}
            className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:underline"
          >
            <AlertTriangle size={14} /> Report a Problem at this Location
          </button>
        </div>
      )}
    </div>
  );
}
