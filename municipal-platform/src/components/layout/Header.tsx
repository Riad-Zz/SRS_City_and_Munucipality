import { Link, useNavigate } from 'react-router-dom';
import { Bell, Globe, LogOut, Menu, X, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function Header({ onMenuToggle, menuOpen }: { onMenuToggle: () => void; menuOpen: boolean }) {
  const { currentUser, unreadCount, language, setLanguage, logout } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#1a4b8c] text-white z-40 flex items-center px-4 gap-4 shadow-lg">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-md hover:bg-white/10 transition-colors"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo */}
      <Link to={currentUser ? `/${currentUser.role}` : '/'} className="flex items-center gap-2.5 font-semibold text-white no-underline">
        <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center text-xs font-bold">DN</div>
        <span className="hidden sm:block text-sm leading-tight">
          Dhaka North<br />
          <span className="text-white/70 font-normal text-xs">City Corporation</span>
        </span>
      </Link>

      <div className="flex-1" />

      {/* Language toggle */}
      <button
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        className="flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Toggle language"
      >
        <Globe size={15} />
        <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
      </button>

      {/* Notifications */}
      {currentUser && (
        <Link
          to={`/${currentUser.role}/notifications`}
          className="relative p-1.5 rounded-md hover:bg-white/10 transition-colors text-white"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      )}

      {/* Profile */}
      {currentUser && (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
              {currentUser.avatar || currentUser.name.substring(0, 2)}
            </div>
            <span className="hidden sm:block text-sm max-w-24 truncate">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown size={14} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role === 'staff' ? 'Municipal Staff' : currentUser.role}</p>
                </div>
                <Link
                  to={`/${currentUser.role}/profile`}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={15} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
