import React, { useState } from 'react';
import { X, Download, Smartphone, Share, MoreVertical, CheckCircle2, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isInstalling, install } = usePWAInstall();
  const { showToast } = useApp();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const result = await install();
    if (result === 'accepted') {
      setInstallSuccess(true);
      showToast('WHFS App installed! Launch it anytime from your Home Screen.', 'success');
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 1500);
    } else if (result === 'dismissed') {
      showToast('Installation cancelled. You can install WHFS App anytime.', 'info');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-[#1d4ed8] to-[#0f2f7a] px-6 py-5 text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/pwa-192x192.png"
              alt="WHFS App Icon"
              className="w-14 h-14 rounded-2xl shadow-md border border-white/25 bg-white shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">
                Official Mobile &amp; Desktop App
              </span>
              <h3 id="pwa-install-title" className="text-xl font-bold tracking-tight text-white">
                Install WHFS App
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Worldwide Humanitarian Foundation Support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Install App popup"
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {installSuccess || isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm">WHFS App is Installed</p>
                <p className="mt-1 text-emerald-800">
                  You can open WHFS directly from your Home Screen or app launcher in full-screen standalone mode.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Quick feature highlights */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2 text-slate-800 font-medium">
                  <Smartphone className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                  <span>1-Tap Home Screen</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2 text-slate-800 font-medium">
                  <WifiOff className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                  <span>Works Offline Ready</span>
                </div>
              </div>

              {/* Native 1-Tap Install Button (Android Chrome / Edge / Desktop Chromium) */}
              {isInstallable && (
                <button
                  onClick={handleNativeInstall}
                  disabled={isInstalling}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#1d4ed8] hover:bg-blue-800 active:bg-blue-900 disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>{isInstalling ? 'Adding to Home Screen...' : 'Add WHFS to Home Screen'}</span>
                </button>
              )}

              {/* Platform-specific Add to Home Screen instructions */}
              {isIOS ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Install on iPhone / iPad (Safari)
                  </p>
                  <ol className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>
                        Tap the <strong className="text-slate-900 inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline" /></strong> button in the Safari toolbar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>
                        Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span>
                        Tap <strong className="text-slate-900">Add</strong> in the top-right corner to install WHFS.
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {isInstallable ? 'Or Install via Android Chrome Menu' : 'How to Install on Android Chrome'}
                  </p>
                  <ol className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>
                        Tap the <strong className="text-slate-900 inline-flex items-center">Chrome Menu <MoreVertical className="w-3.5 h-3.5 inline ml-0.5" /></strong> at the top-right of your browser.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>
                        Select <strong className="text-slate-900">Add to Home screen</strong> or <strong className="text-slate-900">Install app</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d4ed8] font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span>
                        Tap <strong className="text-slate-900">Install</strong> — the blue <strong className="text-slate-900">WHFS</strong> icon will appear on your Home Screen.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {installSuccess || isInstalled ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
