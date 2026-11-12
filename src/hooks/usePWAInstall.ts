import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __whfsDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

// Capture beforeinstallprompt at module load so early Chromium events are never lost
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    window.__whfsDeferredInstallPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    window.__whfsDeferredInstallPrompt = null;
    notifyListeners();
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() =>
    typeof window !== 'undefined' ? window.__whfsDeferredInstallPrompt ?? null : null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));

    const syncPrompt = () => {
      setDeferredPrompt(window.__whfsDeferredInstallPrompt ?? null);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      window.__whfsDeferredInstallPrompt = null;
      setDeferredPrompt(null);
    };

    listeners.add(syncPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener?.('change', checkStandalone);

    return () => {
      listeners.delete(syncPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      mediaQuery.removeEventListener?.('change', checkStandalone);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const promptEvent = window.__whfsDeferredInstallPrompt ?? deferredPrompt;
    if (!promptEvent) {
      return 'unavailable';
    }

    setIsInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        window.__whfsDeferredInstallPrompt = null;
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
      return outcome;
    } catch {
      return 'unavailable';
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInstalling,
    install,
  };
}
