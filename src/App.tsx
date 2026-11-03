/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { FirebaseModal } from './components/FirebaseModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { EducationPage } from './pages/EducationPage';
import { HumanitarianPage } from './pages/HumanitarianPage';
import { Application } from './pages/Application';
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { TrackingPage } from './pages/TrackingPage';
import { DonationPage } from './pages/DonationPage';
import { ContactPage } from './pages/ContactPage';
import { Admin } from './pages/Admin';

// Protected Route Guard for /admin: Only allows admin@whfs.org, authorized admin email, or role === 'admin'
const ProtectedAdminRoute: React.FC<{ onOpenFirebaseModal: () => void }> = ({ onOpenFirebaseModal }) => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.email === 'admin@whfs.org' || currentUser?.email === 'kipchirchiremmanuel5000@gmail.com' || currentUser?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Admin onOpenFirebaseModal={onOpenFirebaseModal} />;
};

const AppRoutes: React.FC<{ onOpenFirebaseModal: () => void }> = ({ onOpenFirebaseModal }) => {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = currentUser?.email === 'admin@whfs.org' || currentUser?.email === 'kipchirchiremmanuel5000@gmail.com' || currentUser?.role === 'admin';

  // Sync browser URL to AppContext activeTab and intercept unauthorized /admin navigation
  useEffect(() => {
    const rawPath = location.pathname.replace(/^\//, '').split('/')[0];
    const currentRoute = rawPath || 'home';
    if (currentRoute === 'admin' && !isAdmin) {
      navigate('/', { replace: true });
      setActiveTab('home');
      return;
    }
    if (currentRoute !== activeTab) {
      setActiveTab(currentRoute);
    }
  }, [location.pathname, isAdmin]);

  // Sync AppContext activeTab changes to browser URL
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('home');
      return;
    }
    const targetUrl = activeTab === 'home' ? '/' : `/${activeTab}`;
    if (location.pathname !== targetUrl) {
      navigate(targetUrl);
    }
  }, [activeTab, isAdmin]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/humanitarian" element={<HumanitarianPage />} />
      <Route path="/apply" element={<Application />} />
      <Route path="/application" element={<Application />} />
      <Route path="/track" element={<TrackingPage />} />
      <Route path="/donate" element={<DonationPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<ProtectedAdminRoute onOpenFirebaseModal={onOpenFirebaseModal} />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar 
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Area with Routes */}
      <main className="flex-1">
        <AppRoutes onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Ergonomic Bottom Action Navigation (Android & Mobile) */}
      <MobileBottomNav />

      {/* Floating Notification Toasts */}
      <ToastContainer />

      {/* Firebase & Firestore Blueprint Modal */}
      <FirebaseModal 
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Applicant & Admin Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
