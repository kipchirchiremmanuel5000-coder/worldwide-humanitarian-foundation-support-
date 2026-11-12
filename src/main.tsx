import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import './hooks/usePWAInstall';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW() {
      // Service worker active for WHFS PWA
    },
    onRegisterError() {
      // Fallback safely if SW registration is blocked by an embedded browser context
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
