import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  ArrowLeft, 
  Check, 
  Coins, 
  Lock, 
  Sparkles, 
  Loader2, 
  MoreVertical, 
  AlertTriangle, 
  Ban, 
  SendHorizontal 
} from 'lucide-react';
import { Conversation, Message, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../services/dataService';
import { getApiUrl } from '../services/apiConfig';

interface MessagesViewProps {
  onOpenWallet: () => void;
  onReportUser: (targetId: string, reason: string) => void;
  targetConversationId?: string | null;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  onOpenWallet,
  onReportUser,
  targetConversationId
}) => {
  const { userProfile, deductCoins } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeConvId, setActiveConvId] = useState<string | null>(targetConversationId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [unlockingMessageId, setUnlockingMessageId] = useState<string | null>(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());

  const activeConv = conversations.find(c => c.id === activeConvId);
  const currentMessages = activeConvId ? (messagesMap[activeConvId] || []) : [];

  const filteredConversations = conversations.filter(c => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConvId,
      senderId: userProfile?.id || 'demo_fan_101',
      senderName: userProfile?.displayName || 'Moi',
      senderAvatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: inputText.trim(),
          lastMessageTime: 'À l\'instant',
          unreadCount: 0
        };
      }
      return c;
    }));

    setInputText('');
  };

  const handleUnlockPaidMessage = async (msg: Message) => {
    const price = msg.priceCoins || 30;
    if ((userProfile?.coinsBalance || 0) < price) {
      alert(`Solde insuffisant (${userProfile?.coinsBalance || 0} FanCoins). Vous avez besoin de ${price} FanCoins pour débloquer ce message exclusif.`);
      onOpenWallet();
      return;
    }

    setUnlockingMessageId(msg.id);

    try {
      const res = await fetch(getApiUrl('/api/payments/unlock-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msg.id,
          fanId: userProfile?.id,
          creatorId: msg.senderId,
          priceCoins: price,
          userCoinBalance: userProfile?.coinsBalance
        })
      });

      const data = await res.json();
      if (data.success) {
        deductCoins(price);
        if (activeConvId) {
          setMessagesMap(prev => ({
            ...prev,
            [activeConvId]: (prev[activeConvId] || []).map(m => {
              if (m.id === msg.id) {
                return { ...m, isUnlocked: true };
              }
              return m;
            })
          }));
        }
      } else {
        alert(data.error || 'Erreur lors du déblocage.');
      }
    } catch {
      alert('Erreur réseau lors de la transaction.');
    } finally {
      setUnlockingMessageId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pb-24 pt-2 h-[calc(100vh-135px)]">
      <div className="bg-[#0A100D] rounded-3xl border border-[#183A2A] h-full flex overflow-hidden shadow-2xl">
        
        {/* Left List of Conversations (Matching Screen 6) */}
        <div className={`w-full md:w-84 border-r border-[#183A2A] flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header matching Screen 6 */}
          <div className="p-4 pb-3 flex items-center justify-between border-b border-[#183A2A]">
            <h2 className="text-lg font-black text-white">Messages</h2>
            <button 
              onClick={() => alert('Nouveau message : Choisissez un contact dans Découvrir pour démarrer une discussion.')}
              className="p-1.5 rounded-full text-[#00E676] hover:bg-[#183A2A]/40 transition"
              title="Nouveau message"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar matching Screen 6 */}
          <div className="p-3 border-b border-[#183A2A]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
              />
            </div>
          </div>

          {/* Conversations List matching Screen 6 */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#183A2A]/40">
            {filteredConversations.map(conv => {
              const isBlocked = blockedUserIds.has(conv.participantId);
              if (isBlocked) return null;

              const isOnline = conv.lastMessageTime.includes('min');
              const isSelected = activeConvId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-[#183A2A]/40 border-l-4 border-[#00E676]' : 'hover:bg-[#030604]/50'
                  }`}
                >
                  {/* Avatar with Online/Offline indicator dot */}
                  <div className="relative">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-12 h-12 rounded-full object-cover border border-[#183A2A]"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0A100D] ${
                        isOnline ? 'bg-[#00E676]' : 'bg-[#A8B5AE]/60'
                      }`} 
                    />
                  </div>

                  {/* Contact Info & Message Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-white truncate">{conv.participantName}</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      </div>
                      <span className="text-[10px] text-[#A8B5AE] flex-shrink-0 ml-1">{conv.lastMessageTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#A8B5AE]">
                      <span className={isOnline ? 'text-[#00E676] font-semibold' : 'text-[#A8B5AE]'}>
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                      </span>
                      <span>•</span>
                      <p className="truncate text-white/90">{conv.lastMessage}</p>
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#00E676] text-black text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Active Chat Pane */}
        {activeConv ? (
          <div className={`flex-1 flex flex-col bg-[#030604] ${activeConvId ? 'flex' : 'hidden md:flex'}`}>
            
            {/* Active Chat Header */}
            <div className="p-3 border-b border-[#183A2A] flex items-center justify-between bg-[#0A100D]">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-1 rounded-lg text-[#A8B5AE] hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img
                    src={activeConv.participantAvatar}
                    alt={activeConv.participantName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00E676] border-2 border-[#0A100D]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white">{activeConv.participantName}</h3>
                    <div className="w-3 h-3 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                      <Check className="w-1.5 h-1.5 stroke-[3]" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#00E676] font-medium">En ligne</p>
                </div>
              </div>

              {/* Options */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsDropdown(prev => !prev)}
                  className="p-1 rounded-lg text-[#A8B5AE] hover:text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showOptionsDropdown && (
                  <div className="absolute right-0 top-8 z-30 w-44 rounded-2xl bg-[#0A100D] border border-[#183A2A] p-1.5 shadow-2xl text-xs">
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onReportUser(activeConv.participantId, 'Message abusif');
                        alert('Signalement transmis au comité de modération.');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-amber-400 hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Signaler le compte
                    </button>
                    <button
                      onClick={() => {
                        setBlockedUserIds(prev => new Set(prev).add(activeConv.participantId));
                        setShowOptionsDropdown(false);
                        setActiveConvId(null);
                        alert('Utilisateur bloqué.');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <Ban className="w-3.5 h-3.5" /> Bloquer l'utilisateur
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentMessages.map(msg => {
                const isMe = msg.senderId === userProfile?.id || msg.senderId === 'demo_fan_101';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    )}

                    <div>
                      {msg.isPaid && !msg.isUnlocked ? (
                        /* Paywalled message bubble */
                        <div className="p-3.5 rounded-2xl bg-[#0A100D] border border-amber-500/40 text-xs shadow-lg">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                            <Lock className="w-3.5 h-3.5" /> Message Exclusif Payant
                          </div>
                          <p className="text-[#A8B5AE] text-[11px] mb-3">
                            Contenu audio ou média exclusif réservé aux supporters VIP.
                          </p>
                          <button
                            onClick={() => handleUnlockPaidMessage(msg)}
                            disabled={unlockingMessageId === msg.id}
                            className="w-full py-2 px-3 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            {unlockingMessageId === msg.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5" />
                                Débloquer ({msg.priceCoins || 30} FanCoins)
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#00E676] text-black font-semibold rounded-tr-sm'
                              : 'bg-[#0A100D] text-white border border-[#183A2A] rounded-tl-sm'
                          }`}
                        >
                          {msg.isPaid && (
                            <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1 mb-1">
                              <Sparkles className="w-3 h-3" /> Exclusivité débloquée
                            </div>
                          )}
                          <p>{msg.text}</p>
                        </div>
                      )}

                      <span className={`text-[9px] text-[#A8B5AE] mt-1 block ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#183A2A] bg-[#0A100D] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-full bg-[#030604] border border-[#183A2A] text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[#00E676] text-black font-bold hover:bg-[#34FF96] disabled:opacity-40 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center text-[#A8B5AE] flex-col">
            <SendHorizontal className="w-12 h-12 text-[#00E676]/40 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Sélectionnez une conversation</h3>
            <p className="text-xs text-[#A8B5AE] max-w-xs">
              Discutez directement avec vos stars préférées sur FanLink AI.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
