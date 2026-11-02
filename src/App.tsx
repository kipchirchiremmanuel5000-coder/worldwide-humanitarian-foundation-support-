/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { TrackingPage } from './pages/TrackingPage';
import { DonationPage } from './pages/DonationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutUsPage />;
      case 'education':
        return <EducationPage />;
      case 'humanitarian':
        return <HumanitarianPage />;
      case 'apply':
        return <ApplicationFormPage />;
      case 'track':
        return <TrackingPage />;
      case 'donate':
        return <DonationPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return (
          <AdminDashboardPage 
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} 
          />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar 
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {renderCurrentView()}
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
