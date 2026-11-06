import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-16 lg:bottom-5 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/90 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-emerald-500/40 backdrop-blur-md animate-fade-in">
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Conexión restablecida — Sincronizando con la nube</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-5 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-500/40 backdrop-blur-md animate-pulse">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Modo Sin Conexión — Tus datos se guardan en este dispositivo</span>
    </div>
  );
};
