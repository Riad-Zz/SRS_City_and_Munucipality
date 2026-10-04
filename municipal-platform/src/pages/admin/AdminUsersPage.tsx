import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import { Users, Search, UserCheck, Shield, Plus, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import type { User, UserRole } from '../../types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', nid: '', role: 'staff' as UserRole, department: 'Roads & Infrastructure Unit' });
  const [savedNotice, setSavedNotice] = useState(false);

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr-new-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      nid: newUser.nid,
      address: 'Dhaka North City Corporation Area',
      role: newUser.role,
      department: newUser.role === 'staff' ? newUser.department : undefined,
      avatar: newUser.name.substring(0, 2).toUpperCase(),
    };
    setUsers(prev => [created, ...prev]);
    setShowAddModal(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User & Role Management</h1>
          <p className="text-sm text-gray-500">Manage municipal accounts, assign departments, and configure system permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Add New User
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={15} /> User account registered and permissions updated.
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'citizen', 'staff', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                roleFilter === r ? 'bg-[#1a4b8c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">National ID</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Department / Jurisdiction</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1a4b8c]/10 text-[#1a4b8c] font-bold text-xs flex items-center justify-center">
                        {u.avatar || u.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">{u.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    <p>{u.email}</p>
                    <p className="text-gray-400">{u.phone}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{u.nid}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                      u.role === 'staff' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">{u.department || 'Ward Resident'}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Provision User Account">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
              placeholder="e.g. Farhan Ahmed"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
              placeholder="user@dncc.gov.bd"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
              <input
                type="text"
                required
                value={newUser.phone}
                onChange={e => setNewUser(u => ({ ...u, phone: e.target.value }))}
                placeholder="017XXXXXXXX"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">National ID (NID) *</label>
              <input
                type="text"
                required
                value={newUser.nid}
                onChange={e => setNewUser(u => ({ ...u, nid: e.target.value }))}
                placeholder="10 or 17 digit NID"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role Permission *</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              >
                <option value="citizen">Citizen</option>
                <option value="staff">Municipal Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            {newUser.role === 'staff' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Department Unit *</label>
                <select
                  value={newUser.department}
                  onChange={e => setNewUser(u => ({ ...u, department: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                >
                  <option value="Roads & Infrastructure Unit">Roads & Infrastructure</option>
                  <option value="Waste Management Unit">Waste Management</option>
                  <option value="Civil Registration Unit">Civil Registration</option>
                  <option value="Revenue & Trade Licensing Unit">Trade Licensing</option>
                  <option value="Electrical Unit">Electrical / Lighting</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#1a4b8c] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3060]">Create Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
