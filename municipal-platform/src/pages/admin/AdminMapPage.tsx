import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import type { MapLocation } from '../../types';

export function AdminMapPage() {
  const { mapLocations, addMapLocation, deleteMapLocation } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLoc, setNewLoc] = useState({
    name: '',
    category: 'park' as MapLocation['category'],
    address: '',
    lat: '23.8103',
    lng: '90.4125',
    description: '',
    openingHours: '9:00 AM - 6:00 PM',
    contact: '02-9888888',
  });
  const [notice, setNotice] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMapLocation({
      name: newLoc.name,
      category: newLoc.category,
      address: newLoc.address,
      coordinates: [parseFloat(newLoc.lat) || 23.8103, parseFloat(newLoc.lng) || 90.4125],
      description: newLoc.description,
      openingHours: newLoc.openingHours,
      contact: newLoc.contact,
    });
    setShowAddModal(false);
    setNewLoc({
      name: '',
      category: 'park',
      address: '',
      lat: '23.8103',
      lng: '90.4125',
      description: '',
      openingHours: '9:00 AM - 6:00 PM',
      contact: '02-9888888',
    });
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Municipal Map Maintenance</h1>
          <p className="text-sm text-gray-500">
            Maintain GIS municipal infrastructure, facilities, and points of interest (FR-30).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Add Map Location
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={15} /> Map point added and synchronized with Citizen City Map!
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Location / Facility</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Coordinates (Lat, Lng)</th>
                <th className="py-3 px-4 text-left">Timings & Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mapLocations.map(loc => (
                <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                    {loc.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a4b8c]">
                      {loc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">{loc.address}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">
                    {loc.coordinates[0].toFixed(4)}, {loc.coordinates[1].toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    <p>{loc.openingHours || '24 Hours'}</p>
                    <p className="text-gray-400">{loc.contact || 'N/A'}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteMapLocation(loc.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Location"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Municipal Map Point">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Facility / Point Name *</label>
            <input
              type="text"
              required
              value={newLoc.name}
              onChange={e => setNewLoc(l => ({ ...l, name: e.target.value }))}
              placeholder="e.g. Mirpur Public Library"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={newLoc.category}
                onChange={e => setNewLoc(l => ({ ...l, category: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              >
                <option value="park">Park / Playground</option>
                <option value="hospital">Hospital / Clinic</option>
                <option value="toilet">Public Toilet</option>
                <option value="market">Municipal Market</option>
                <option value="auditorium">Public Auditorium</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="waste">Waste Transfer Station</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                required
                value={newLoc.address}
                onChange={e => setNewLoc(l => ({ ...l, address: e.target.value }))}
                placeholder="Ward, Sector, Road"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                value={newLoc.lat}
                onChange={e => setNewLoc(l => ({ ...l, lat: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                value={newLoc.lng}
                onChange={e => setNewLoc(l => ({ ...l, lng: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={newLoc.openingHours}
                onChange={e => setNewLoc(l => ({ ...l, openingHours: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={newLoc.contact}
                onChange={e => setNewLoc(l => ({ ...l, contact: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060]">Save to City Map</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
