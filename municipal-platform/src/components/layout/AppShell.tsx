import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, login } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      if (location.pathname.startsWith('/staff')) {
        login(MOCK_USERS.find(u => u.id === 'staff-001')!);
      } else if (location.pathname.startsWith('/admin')) {
        login(MOCK_USERS.find(u => u.id === 'admin-001')!);
      } else {
        login(MOCK_USERS.find(u => u.id === 'citizen-001')!);
      }
    }
  }, [currentUser, location.pathname, login]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="lg:ml-60 pt-14 min-h-screen">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

