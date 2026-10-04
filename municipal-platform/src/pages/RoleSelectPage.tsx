import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import { Shield, Users, UserCircle, AlertTriangle } from 'lucide-react';

export function RoleSelectPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSelect = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) return;
    login(user);
    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3060] to-[#1a4b8c] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">DN</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Dhaka North City Corporation</h1>
          <p className="text-white/70 mt-1">Municipal Digital Platform</p>
        </div>

        {/* Demo notice */}
        <div className="bg-amber-400/20 border border-amber-400/40 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-300 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-200 text-sm font-semibold">Prototype / Demo Mode</p>
            <p className="text-amber-200/80 text-xs mt-0.5">Select a role below to explore the platform. No real login is required.</p>
          </div>
        </div>

        {/* Role cards */}
        <div className="space-y-3">
          <RoleCard
            icon={<UserCircle size={28} className="text-green-400" />}
            title="Citizen"
            subtitle="Ayesha Rahman"
            description="Access municipal services, submit reports, make payments, track applications."
            onClick={() => handleSelect('citizen-001')}
            color="green"
          />
          <RoleCard
            icon={<Users size={28} className="text-blue-400" />}
            title="Municipal Staff"
            subtitle="Md. Karim Hossain — Roads & Infrastructure Unit"
            description="Process applications, handle assigned reports, update statuses and notify citizens."
            onClick={() => handleSelect('staff-001')}
            color="blue"
          />
          <RoleCard
            icon={<Shield size={28} className="text-purple-400" />}
            title="Administrator"
            subtitle="Syed Rafiqul Islam"
            description="Manage users, services, notices, map, events and system activity."
            onClick={() => handleSelect('admin-001')}
            color="purple"
          />
        </div>

        <p className="text-center text-white/40 text-xs mt-8">
          This is a functional prototype for demonstration purposes only.
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  icon, title, subtitle, description, onClick, color
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  color: 'green' | 'blue' | 'purple';
}) {
  const borderColors = { green: 'hover:border-green-400', blue: 'hover:border-blue-400', purple: 'hover:border-purple-400' };
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white/10 hover:bg-white/15 border border-white/20 ${borderColors[color]} rounded-xl p-5 text-left transition-all group`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-base">{title}</h3>
          </div>
          <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>
          <p className="text-white/50 text-xs mt-2 leading-relaxed">{description}</p>
        </div>
        <div className="ml-auto text-white/30 group-hover:text-white/60 transition-colors text-xl">→</div>
      </div>
    </button>
  );
}
