import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Users, 
  Gift, 
  Send, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  History, 
  Heart,
  Volume2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { VIRTUAL_GIFTS } from '../services/dataService';
import { VirtualGift, TransactionRecord } from '../types';

interface LiveViewProps {
  onOpenWallet: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  isGift?: boolean;
  giftIcon?: string;
  badge?: string;
}

export const LiveView: React.FC<LiveViewProps> = ({ onOpenWallet }) => {
  const { userProfile, deductCoins } = useAuth();
  const { formatCurrency } = useCurrencyLang();
  
  const [activeGift, setActiveGift] = useState<VirtualGift | null>(null);
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(VIRTUAL_GIFTS[1]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'Kévin M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Le son est tellement bon ce soir !! Bravo Kémi 🎵',
      badge: 'Fan Actif'
    },
    {
      id: 'c2',
      sender: 'Aïcha D.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      text: 'Coucou depuis Dakar ! On attend le nouveau single avec impatience !',
      badge: 'VIP'
    },
    {
      id: 'c3',
      sender: 'Lucas R.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'A offert une Étoile FanLink ⭐ !',
      isGift: true,
      giftIcon: '⭐'
    }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [viewerCount, setViewerCount] = useState(1482);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [giftTransactions, setGiftTransactions] = useState<TransactionRecord[]>([]);

  // Periodically simulate live viewers fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender: userProfile?.displayName || 'Moi',
      avatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: inputChat.trim(),
      badge: userProfile?.badge === 'star_verified' ? 'Star' : 'Fan'
    };

    setChatMessages(prev => [...prev.slice(-40), newMsg]);
    setInputChat('');
  };

  const handleSendGift = (gift: VirtualGift) => {
    if ((userProfile?.coinsBalance || 0) < gift.coinsCost) {
      alert(`Solde insuffisant ! Ce cadeau coûte ${gift.coinsCost} FanCoins. Votre solde actuel est de ${userProfile?.coinsBalance || 0} FanCoins.`);
      onOpenWallet();
      return;
    }

    if (deductCoins(gift.coinsCost)) {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00E676', '#FFD700', '#00C853', '#ffffff']
      });

      // Record transaction
      const tx: TransactionRecord = {
        id: `gift_tx_${Date.now()}`,
        userId: userProfile?.id || 'demo_fan_101',
        creatorId: 'star_01',
        creatorName: 'Kémi AfroPulse',
        type: 'gift',
        amountCoins: gift.coinsCost,
        amountFiat: gift.fiatApproxEur,
        currency: 'EUR',
        provider: 'coins_wallet',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      setGiftTransactions(prev => [tx, ...prev]);

      // Push announcement into live chat
      const giftAnnouncement: ChatMessage = {
        id: `ann_${Date.now()}`,
        sender: userProfile?.displayName || 'Moi',
        avatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: `a offert ${gift.name} ${gift.icon} (${gift.coinsCost} coins) !`,
        isGift: true,
        giftIcon: gift.icon
      };

      setChatMessages(prev => [...prev.slice(-40), giftAnnouncement]);
      setShowGiftDrawer(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-24 pt-3">
      
      {/* Infrastructure Notice */}
      <div className="mb-4 p-3.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-start gap-3 text-xs text-[#A8B5AE]">
        <Radio className="w-4 h-4 text-[#00E676] animate-pulse mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-[#00E676] mb-0.5">
            FanLink Live Broadcast Edge
          </p>
          <p className="text-[#A8B5AE] leading-relaxed text-[11px]">
            Diffusion en direct ultra-rapide avec interactions temps réel, chat modéré et cadeaux virtuels FanCoins intégrés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Live Stage (2 cols) */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#0A100D] border border-[#183A2A] shadow-2xl group">
            {/* Stream Video Preview Background */}
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80"
              alt="Live Broadcast Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030604] via-transparent to-[#030604]/70" />

            {/* Live Indicator & Viewers Count */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                EN DIRECT
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030604]/80 backdrop-blur-md text-white text-xs font-semibold border border-[#183A2A]">
                <Users className="w-3.5 h-3.5 text-[#00E676]" />
                {viewerCount.toLocaleString()}
              </span>
            </div>

            {/* Creator Badge & Stream Title */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                  alt="Kémi AfroPulse"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#00E676] shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white">Kémi AfroPulse</h3>
                    <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                  </div>
                  <p className="text-xs text-[#A8B5AE]">Session acoustique exclusive & annonce de la tournée</p>
                </div>
              </div>

              {/* Gift Button Trigger */}
              <button
                onClick={() => setShowGiftDrawer(true)}
                className="px-4 py-2 rounded-full bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs flex items-center gap-1.5 shadow-xl shadow-[#00E676]/20 transform hover:scale-105 transition"
              >
                <Gift className="w-4 h-4" />
                <span>Offrir un cadeau</span>
              </button>
            </div>
          </div>

          {/* Quick Gift Tray */}
          <div className="p-3 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-[#A8B5AE] flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#00E676]" /> Cadeaux rapides :
            </span>
            <div className="flex items-center gap-2">
              {VIRTUAL_GIFTS.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#030604] hover:bg-[#121c16] border border-[#183A2A] text-xs transition active:scale-95"
                >
                  <span className="text-base">{gift.icon}</span>
                  <span className="font-bold text-[#00E676]">{gift.coinsCost}c</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Chat Pane (1 col) */}
        <div className="bg-[#0A100D] rounded-3xl border border-[#183A2A] flex flex-col h-[480px] shadow-2xl overflow-hidden">
          
          <div className="p-3.5 border-b border-[#183A2A] flex items-center justify-between bg-[#030604]/40">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              Chat en direct
            </h4>
            <span className="text-[10px] text-[#A8B5AE]">Modération active</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl leading-relaxed ${
                  msg.isGift
                    ? 'bg-[#00E676]/10 border border-[#00E676]/30 text-white'
                    : 'bg-[#030604] border border-[#183A2A]/60 text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-bold text-[#00E676]">{msg.sender}</span>
                  {msg.badge && (
                    <span className="px-1.5 py-0.2 rounded bg-[#183A2A] text-[9px] text-[#A8B5AE] font-medium">
                      {msg.badge}
                    </span>
                  )}
                  {msg.isGift && <span className="text-base">{msg.giftIcon}</span>}
                </div>
                <p className="text-[#A8B5AE]">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-2.5 border-t border-[#183A2A] bg-[#030604]/40 flex items-center gap-2">
            <input
              type="text"
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              placeholder="Envoyer un message au direct..."
              className="flex-1 px-3.5 py-2 rounded-full bg-[#030604] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
            />
            <button
              type="submit"
              disabled={!inputChat.trim()}
              className="p-2 rounded-full bg-[#00E676] text-[#030604] font-bold hover:bg-[#00B86B] disabled:opacity-40 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* Virtual Gifts Full Catalog Modal */}
      {showGiftDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 shadow-2xl text-white">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#183A2A] mb-4">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#00E676]" /> Catalogue de Cadeaux Virtuels
                </h3>
                <p className="text-[11px] text-[#A8B5AE]">80% des revenus sont reversés au créateur</p>
              </div>
              <button
                onClick={() => setShowGiftDrawer(false)}
                className="text-[#A8B5AE] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* User Coin Balance */}
            <div className="mb-4 p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center justify-between">
              <span className="text-xs text-[#A8B5AE]">Votre solde :</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#00E676]">
                  {userProfile?.coinsBalance || 0} FanCoins
                </span>
                <button
                  onClick={() => {
                    setShowGiftDrawer(false);
                    onOpenWallet();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#00E676]/20 text-[#00E676] text-xs font-bold border border-[#00E676]/40 hover:bg-[#00E676]/30 transition"
                >
                  + Recharger
                </button>
              </div>
            </div>

            {/* Gifts Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {VIRTUAL_GIFTS.map(gift => (
                <div
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                    selectedGift.id === gift.id
                      ? 'bg-[#00E676]/15 border-[#00E676]'
                      : 'bg-[#030604] border-[#183A2A] hover:border-[#183A2A]/80'
                  }`}
                >
                  <div className="text-3xl mb-1">{gift.icon}</div>
                  <h4 className="text-xs font-bold text-white">{gift.name}</h4>
                  <p className="text-[11px] font-extrabold text-[#00E676]">{gift.coinsCost} FanCoins</p>
                  <p className="text-[10px] text-[#A8B5AE]">~{formatCurrency(gift.fiatApproxEur)}</p>
                </div>
              ))}
            </div>

            {/* Confirmation & Send */}
            <button
              onClick={() => handleSendGift(selectedGift)}
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs shadow-lg shadow-[#00E676]/25 flex items-center justify-center gap-2 transition"
            >
              <span>Envoyer {selectedGift.name} ({selectedGift.coinsCost} FanCoins)</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
