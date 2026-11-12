import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Globe, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, adminLogin, register, setActiveTab } = useApp();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<'applicant' | 'admin'>('applicant');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalized = email.trim().toLowerCase();
      if (mode === 'signin') {
        if (role === 'admin' || normalized === 'admin@whfs.org' || normalized === 'kipchirchiremmanuel5000@gmail.com') {
          const success = await adminLogin(email, password);
          if (success) {
            setActiveTab('admin');
            onClose();
          }
          return;
        } else {
          const success = await login(email, password);
          if (success) onClose();
        }
      } else {
        const success = await register(name, email, country, password);
        if (success) onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0a1f38] text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Worldwide Portal</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white">
            {mode === 'signin' ? 'Sign In to WHFS Portal' : 'Create Applicant Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access your applications, track relief grants, or manage foundation funds.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('applicant')}
              className={`py-1.5 rounded-md transition-all cursor-pointer ${
                role === 'applicant' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applicant
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-1.5 rounded-md transition-all cursor-pointer ${
                role === 'admin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Foundation Officer
            </button>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Zainab Mwangi"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Country of Residence
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Kenya, Philippines, Ukraine..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@example.org"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In to Portal' : 'Register Account')}
          </button>

          <div className="text-center pt-2">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-600">
                Don't have an applicant account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#059669] font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-[#0a1f38] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
