import React from 'react';
import { 
  Radio, 
  Coins, 
  Search, 
  Bell, 
  Sparkles, 
  Tv, 
  ShieldCheck,
  Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { FanLinkLogo } from './FanLinkLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { SupportedLanguage } from '../types';

interface HeaderProps {
  currentTab: string;
  feedSubTab: 'forYou' | 'following' | 'stars';
  onSelectFeedSubTab: (subTab: 'forYou' | 'following' | 'stars') => void;
  onOpenLive: () => void;
  onOpenWallet: () => void;
  onOpenAuth: () => void;
  onOpenAI: () => void;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  feedSubTab,
  onSelectFeedSubTab,
  onOpenLive,
  onOpenWallet,
  onOpenAuth,
  onOpenAI,
  onSelectTab,
  searchQuery,
  setSearchQuery
}) => {
  const { userProfile, currentUser, isAdmin } = useAuth();
  const { language, setLanguage } = useCurrencyLang();

  const handleLangToggle = () => {
    const langs: SupportedLanguage[] = ['fr', 'en', 'es', 'pt'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030604]/90 backdrop-blur-xl border-b border-[#183A2A]/80 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo + Live TV Quick Indicator */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab('feed')}
            className="cursor-pointer group flex-shrink-0"
          >
            <FanLinkLogo size="sm" showWordmark={true} showTagline={false} />
          </div>

          {/* Live Broadcast Badge Button */}
          <button
            onClick={onOpenLive}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-red-600/20 to-red-500/10 text-red-400 border border-red-500/30 hover:border-red-400 transition"
            title="Accéder aux directs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="hidden xs:inline">LIVE</span>
          </button>
        </div>

        {/* Center: When on Feed, show "Pour toi" / "Suivis" / "Stars" tabs matching Screen 2 */}
        {currentTab === 'feed' ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectFeedSubTab('forYou')}
              className={`px-3 py-1 text-xs font-bold transition rounded-full ${
                feedSubTab === 'forYou'
                  ? 'text-white border-b-2 border-[#00E676] text-shadow'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              Pour toi
            </button>
            <button
              onClick={() => onSelectFeedSubTab('following')}
              className={`px-3 py-1 text-xs font-bold transition rounded-full ${
                feedSubTab === 'following'
                  ? 'text-white border-b-2 border-[#00E676]'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              Suivis
            </button>
            <button
              onClick={() => onSelectFeedSubTab('stars')}
              className={`px-3 py-1 text-xs font-bold transition rounded-full ${
                feedSubTab === 'stars'
                  ? 'text-[#00E676] border-b-2 border-[#00E676]'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              Stars
            </button>
          </div>
        ) : (
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8B5AE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher sur FanLink..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#0A100D] text-xs text-white placeholder-[#A8B5AE]/60 border border-[#183A2A] focus:outline-none focus:border-[#00E676]"
              />
            </div>
          </div>
        )}

        {/* Right Action Icons: Search trigger on mobile, AI button, Coins balance, PWA, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Button (routes to discover) */}
          <button
            onClick={() => onSelectTab('discover')}
            className="p-1.5 rounded-full text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Assistant Studio Shortcut */}
          <button
            onClick={onOpenAI}
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 hover:bg-[#00E676]/20 transition"
            title="Assistant FanLink AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">IA Studio</span>
          </button>

          {/* PWA Install */}
          <PWAInstallButton />

          {/* FanCoins Wallet Pill */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/50 text-xs font-bold text-amber-300 transition"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{userProfile?.coinsBalance ?? 0}</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={handleLangToggle}
            className="px-2 py-1 rounded-lg text-[10px] font-black text-[#A8B5AE] hover:text-white bg-[#0A100D] border border-[#183A2A] uppercase"
            title="Langue"
          >
            {language}
          </button>

          {/* Quick Settings Access */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`p-1.5 rounded-full transition ${
              currentTab === 'settings'
                ? 'text-[#00E676] bg-[#00E676]/15 border border-[#00E676]/40'
                : 'text-[#A8B5AE] hover:text-white hover:bg-[#0A100D]'
            }`}
            title="Paramètres et confidentialité"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => onSelectTab('profile')}
            className="relative p-0.5 rounded-full border border-[#00E676]/40 hover:border-[#00E676] transition flex-shrink-0"
            title={userProfile?.displayName}
          >
            <img
              src={userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={userProfile?.displayName}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
            />
            {userProfile?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00E676] rounded-full flex items-center justify-center text-zinc-950 border border-zinc-950">
                <ShieldCheck className="w-2.5 h-2.5" />
              </div>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
