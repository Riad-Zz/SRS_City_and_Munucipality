import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    login(user);
    navigate(`/${user.role}`);
  };

  const autofill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3060] to-[#1a4b8c] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-[#0f3060] text-3xl font-bold">DN</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Municipal Portal</h1>
          <p className="text-blue-200 mt-2">Log in to access your dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Log In
                <LogIn size={16} />
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Demo Accounts</h3>
            <div className="grid grid-cols-1 gap-2">
              <button type="button" onClick={() => autofill('citizen@municipal.demo')} className="text-left px-3 py-2 text-sm text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-colors flex justify-between items-center group">
                <span className="font-medium">Citizen</span>
                <span className="text-xs text-slate-400 group-hover:text-slate-600 font-mono">citizen@municipal.demo</span>
              </button>
              <button type="button" onClick={() => autofill('staff@municipal.demo')} className="text-left px-3 py-2 text-sm text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-colors flex justify-between items-center group">
                <span className="font-medium">Staff</span>
                <span className="text-xs text-slate-400 group-hover:text-slate-600 font-mono">staff@municipal.demo</span>
              </button>
              <button type="button" onClick={() => autofill('admin@municipal.demo')} className="text-left px-3 py-2 text-sm text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-colors flex justify-between items-center group">
                <span className="font-medium">Admin</span>
                <span className="text-xs text-slate-400 group-hover:text-slate-600 font-mono">admin@municipal.demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
