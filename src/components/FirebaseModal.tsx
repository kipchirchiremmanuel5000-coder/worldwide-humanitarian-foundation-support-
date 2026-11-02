import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Code2, 
  Layers, 
  KeyRound 
} from 'lucide-react';
import { 
  FIRESTORE_COLLECTIONS, 
  FIRESTORE_SECURITY_RULES_PREVIEW, 
  getFirebaseConfig, 
  isFirebaseConfigured 
} from '../firebase/config';
import { useApp } from '../context/AppContext';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'rules'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const config = getFirebaseConfig();
  const isConfigured = isFirebaseConfigured();

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_SECURITY_RULES_PREVIEW);
    setCopied(true);
    showToast('Firestore Security Rules copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a1f38] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Firebase & Cloud Firestore Architecture
              </h3>
              <p className="text-xs text-slate-300">
                Prepared data schema, authentication providers, and security rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0a1f38] text-[#0a1f38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Integration Status</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'border-[#0a1f38] text-[#0a1f38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>Firestore Collections Schema</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rules'
                ? 'border-[#0a1f38] text-[#0a1f38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Security Rules (firestore.rules)</span>
            </div>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Status banner */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Integration Ready & Schema Pre-Constructed
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    WHFS is architected with complete Firebase Authentication and Cloud Firestore compatibility. Currently using the reactive local persistence store with full data integrity. All form submissions, grant approvals, and donation receipts follow Firestore document models.
                  </p>
                </div>
              </div>

              {/* Environment Variable Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Environment Keys Status
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-700">VITE_FIREBASE_API_KEY</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans ${config.apiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {config.apiKey ? 'Configured' : 'Ready for injection'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-700">VITE_FIREBASE_PROJECT_ID</span>
                    <span className="text-emerald-700 font-semibold">{config.projectId}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-700">VITE_FIREBASE_AUTH_DOMAIN</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans ${config.authDomain ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {config.authDomain ? 'Configured' : 'whfs-aid.firebaseapp.com'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supported Auth Methods */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Prepared Authentication Methods
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <p className="text-xs font-bold text-slate-900">Email & Password</p>
                    <p className="text-[11px] text-slate-500 mt-1">Applicant self-registration & password recovery</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <p className="text-xs font-bold text-slate-900">Google OAuth</p>
                    <p className="text-[11px] text-slate-500 mt-1">Fast sign-in for university scholars & field officers</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <p className="text-xs font-bold text-slate-900">RBAC Custom Claims</p>
                    <p className="text-[11px] text-slate-500 mt-1">Admin token claim for foundation grant officers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                WHFS utilizes 4 primary Firestore root collections designed for scale, regional partitioning, and high-frequency queries.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0a1f38]">
                      /{FIRESTORE_COLLECTIONS.APPLICATIONS}/{'{applicationId}'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                      Primary Document
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Stores complete worldwide grant applications: <code className="text-slate-800">fullName</code>, <code className="text-slate-800">country</code>, <code className="text-slate-800">programmeName</code>, <code className="text-slate-800">amountRequestedUSD</code>, <code className="text-slate-800">status</code>, <code className="text-slate-800">documents[]</code>, <code className="text-slate-800">timeline[]</code>, and reviewer committee notes.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0a1f38]">
                      /{FIRESTORE_COLLECTIONS.USERS}/{'{userId}'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold">
                      Profiles & RBAC
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Stores role mapping (<code className="text-slate-800">'applicant' | 'admin'</code>), organization, verified contact, and linked application references.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0a1f38]">
                      /{FIRESTORE_COLLECTIONS.DONATIONS}/{'{donationId}'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                      Public Ledger
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Stores public contributions with masked private details, designated cause, currency conversion, and tax receipt sequence numbers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hardened Security Rules
                </span>
                <button
                  onClick={handleCopyRules}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#0a1f38] text-white rounded-md hover:bg-[#133e87] transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-72">
                {FIRESTORE_SECURITY_RULES_PREVIEW}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            WHFS Foundation IT Security Protocol v2.6
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
