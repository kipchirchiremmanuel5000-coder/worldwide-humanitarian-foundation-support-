import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  Search, 
  FileText,
  LogOut,
  ChevronDown,
  Database
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenFirebaseModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFirebaseModal, onOpenAuthModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    logout 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Security Gate: Only show Admin affordances if user email is admin@whfs.org or authorized admin email or role === 'admin'
  const isAdmin = currentUser?.email === 'admin@whfs.org' || currentUser?.email === 'kipchirchiremmanuel5000@gmail.com' || currentUser?.role === 'admin';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'education', label: 'Education' },
    { id: 'humanitarian', label: 'Humanitarian' },
    { id: 'track', label: 'Track Aid' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Brand & Utility Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group shrink-0"
          >
            <div className="w-11 h-11 rounded-lg bg-[#0a1f38] text-amber-400 flex items-center justify-center font-bold text-xl shadow-xs group-hover:bg-[#07172c] transition-colors">
              <Globe className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0a1f38] leading-none">
                WHFS
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
                Worldwide Humanitarian Support
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 Single-Line Concise Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer text-sm font-medium ${
                    isActive 
                      ? 'text-[#0a1f38] font-bold' 
                      : 'hover:text-[#0a1f38] text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Auth / Admin Affordances */}
          <div className="flex items-center gap-3 shrink-0">
            {/* PWA Install App Button */}
            <PWAInstallButton />

            {/* Quick Firebase Readiness indicator button */}
            <button
              onClick={onOpenFirebaseModal}
              title="Firebase & Cloud Firestore Integration Architecture"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Firebase Ready</span>
            </button>

            {/* Admin Portal button - visible ONLY to authorized administrators */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#0a1f38] text-amber-400 shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Primary Action Button: Donate */}
            <button
              onClick={() => handleNavClick('donate')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donate</span>
            </button>

            {/* Apply Now Quick Button */}
            <button
              onClick={() => handleNavClick('apply')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#0a1f38] hover:bg-[#133e87] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Apply</span>
            </button>

            {/* User Profile / Auth Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-700"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a1f38] text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/30">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                        {currentUser.role === 'admin' ? 'Foundation Officer (Admin)' : 'Registered Applicant'}
                      </span>
                    </div>

                    <div className="py-1">
                      {/* Only show Switch to Admin Mode if user is admin */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Switch to Admin Mode</span>
                        </button>
                      )}

                      {/* Normal applicants see ONLY My Tracked Applications & Sign Out */}
                      <button
                        onClick={() => {
                          handleNavClick('track');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-slate-500" />
                        <span>My Tracked Applications</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#0a1f38] font-semibold hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Grants Officer Dashboard</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slogan Banner bar below header */}
      <div className="bg-[#0a1f38] text-slate-200 py-1.5 px-4 text-center text-xs tracking-wider border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-amber-400 font-medium">
            <span>OFFICIAL SLOGAN:</span>
            <span className="text-white font-semibold">Education • Opportunity • Brighter Futures</span>
          </div>
          <div className="w-full md:w-auto text-center md:text-right text-[11px] text-slate-300">
            <span>UN ECOSOC Consultative Status Accredited · Global Aid Operations Active in 52 Countries</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-amber-50 text-[#0a1f38] border-l-4 border-[#059669]' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs text-[#059669] font-bold">Active</span>}
                </button>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Portal (/admin)</span>
                </div>
                {activeTab === 'admin' && <span className="text-xs text-[#059669] font-bold">Active</span>}
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('apply')}
              className="w-full py-2.5 px-3 bg-[#0a1f38] text-white text-xs font-bold uppercase rounded-lg text-center"
            >
              Apply for Aid
            </button>
            <button
              onClick={() => handleNavClick('donate')}
              className="w-full py-2.5 px-3 bg-[#059669] text-white text-xs font-bold uppercase rounded-lg text-center"
            >
              Donate Now
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => {
                onOpenFirebaseModal();
                setMobileMenuOpen(false);
              }}
              className="text-[#0a1f38] font-medium underline flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Integration Blueprint</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
