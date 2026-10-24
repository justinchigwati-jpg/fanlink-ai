import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="Avertissement de connexion" className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-lg border border-amber-400">
      <WifiOff className="w-4 h-4 animate-bounce" />
      <span>Mode hors ligne actif — Données en cache local utilisées</span>
    </aside>
  );
};
