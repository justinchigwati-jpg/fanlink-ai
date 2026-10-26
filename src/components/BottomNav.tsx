import React from 'react';
import { 
  Home, 
  Search, 
  Trophy,
  Plus, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { useCurrencyLang } from '../context/CurrencyLangContext';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreate: () => void;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreate,
  unreadMessagesCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#030604]/95 backdrop-blur-xl border-t border-[#183A2A] px-2 py-1.5 sm:px-6 transition-all safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* 1. Accueil */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition ${
            currentTab === 'feed'
              ? 'text-[#00E676] font-bold'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Accueil</span>
        </button>

        {/* 2. Matchs & Pronos */}
        <button
          onClick={() => onSelectTab('matches')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition ${
            currentTab === 'matches'
              ? 'text-[#00E676] font-bold'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <div className="relative">
            <Trophy className={`w-5 h-5 ${currentTab === 'matches' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="absolute -top-1 -right-2 px-1 rounded-full bg-[#00E676] text-black text-[8px] font-black">
              LIVE
            </span>
          </div>
          <span className="text-[10px] tracking-tight">Matchs</span>
        </button>

        {/* 3. Central Green Button (+) */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={onOpenCreate}
            className="w-12 h-8.5 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-black flex items-center justify-center shadow-lg shadow-[#00E676]/30 active:scale-95 transition-all group"
            title="Créer une publication"
            aria-label="Créer une publication"
          >
            <Plus className="w-5 h-5 stroke-[3] text-black group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* 4. Messages */}
        <button
          onClick={() => onSelectTab('messages')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition ${
            currentTab === 'messages'
              ? 'text-[#00E676] font-bold'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${currentTab === 'messages' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-[#00E676] text-black text-[9px] font-black border border-[#030604]">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Messages</span>
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition ${
            ['profile', 'settings', 'evolution', 'activity-center'].includes(currentTab)
              ? 'text-[#00E676] font-bold'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${['profile', 'settings', 'evolution', 'activity-center'].includes(currentTab) ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Profil</span>
        </button>

      </div>
    </nav>
  );
};
