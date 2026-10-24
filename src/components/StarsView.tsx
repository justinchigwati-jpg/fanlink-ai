import React, { useState } from 'react';
import { 
  Search, 
  QrCode, 
  Check, 
  Radio, 
  Play, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  UserX, 
  Flame, 
  TrendingUp, 
  Music, 
  Trophy, 
  Gamepad2, 
  Shirt 
} from 'lucide-react';
import { UserProfile } from '../types';
import { ACTIVE_LIVES, DISCOVER_TRENDING_ITEMS, DiscoverTrendingItem } from '../services/dataService';

interface StarsViewProps {
  creators: UserProfile[];
  onSelectCreator: (creator: UserProfile) => void;
  onOpenGift: (creator: UserProfile) => void;
  onRequestVerification: () => void;
}

export const StarsView: React.FC<StarsViewProps> = ({
  creators,
  onSelectCreator,
  onOpenGift,
  onRequestVerification
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tendance');
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set(['sarah_queen']));

  const categoryPills = ['Tendance', 'Musique', 'Sport', 'Fashion', 'Gaming'];

  const popularSearches = [
    { id: 'musique', label: 'Musique', icon: Music, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
    { id: 'sport', label: 'Sport', icon: Trophy, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2, avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80' },
    { id: 'mode', label: 'Mode', icon: Shirt, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' }
  ];

  const handleToggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Search results
  const filteredCreators = creators.filter(c => 
    c.displayName.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.bio.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 pb-28 pt-3">
      
      {/* Top Search Bar with QR scanner icon matching mockup Screens 3 & 4 */}
      <div className="relative flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur, créateur..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AE] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* QR Scanner Icon from Mockup */}
        <button
          onClick={() => alert('Scanner QR FanLink : Prêt pour scanner le profil d\'un créateur.')}
          className="p-2.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] text-[#00E676] hover:bg-[#183A2A]/40 transition"
          title="Scanner un QR Code FanLink"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* If search query has no match, show exact Screen 3 Empty State */}
      {search && filteredCreators.length === 0 ? (
        <div className="p-8 my-6 text-center bg-[#0A100D] rounded-3xl border border-[#183A2A] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#00E676]/10 border-2 border-[#00E676] flex items-center justify-center mb-4 text-[#00E676]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1.5">
            Aucun compte FanLink trouvé
          </h3>
          <p className="text-xs text-[#A8B5AE] max-w-xs mb-6 leading-relaxed">
            Cette personne n'est pas encore inscrite sur FanLink. Partagez le lien pour la faire rejoindre la famille !
          </p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.origin);
              alert('Lien d\'invitation FanLink copié ! Envoyez-le à votre ami.');
            }}
            className="px-6 py-3 rounded-full bg-[#00E676] hover:bg-[#34FF96] text-black font-extrabold text-xs shadow-lg shadow-[#00E676]/30 transition"
          >
            Inviter à rejoindre
          </button>
        </div>
      ) : search ? (
        /* Search results */
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-[#A8B5AE] uppercase px-1">Résultats de recherche ({filteredCreators.length})</h3>
          {filteredCreators.map(creator => {
            const isFollowed = followedIds.has(creator.id);
            return (
              <div
                key={creator.id}
                onClick={() => onSelectCreator(creator)}
                className="p-3.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-center justify-between gap-3 cursor-pointer hover:border-[#00E676]/50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={creator.avatarUrl} alt={creator.displayName} className="w-11 h-11 rounded-full object-cover border border-[#183A2A]" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">{creator.displayName}</h4>
                      {creator.isVerified && (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A8B5AE] truncate">@{creator.username} • {creator.followersCount.toLocaleString()} abonnés</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleToggleFollow(creator.id, e)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                    isFollowed ? 'bg-[#183A2A] text-white' : 'bg-[#00E676] text-black hover:bg-[#34FF96]'
                  }`}
                >
                  {isFollowed ? 'Abonné' : 'Suivre'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* MAIN DISCOVER SCREEN (Matching Screens 3 and 4) */
        <>
          {/* Section: Recherches Populaires (Horizontal Circular Avatars) */}
          <div className="mb-5">
            <h3 className="text-xs font-extrabold text-white mb-2.5 px-1">
              Recherches populaires
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {popularSearches.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSearch(item.label)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00B86B] group-hover:scale-105 transition">
                    <div className="p-0.5 bg-[#030604] rounded-full">
                      <img
                        src={item.avatar}
                        alt={item.label}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#A8B5AE] group-hover:text-white transition">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Tabs: Tendance, Musique, Sport, Fashion, Gaming */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
            {categoryPills.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#00E676] text-black shadow-md shadow-[#00E676]/20'
                    : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section: Lives (Matching Screen 4) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-pink-500 animate-pulse" />
                Lives
              </h3>
              <button 
                onClick={() => alert('Affichage de la liste complète des directs.')}
                className="text-xs font-bold text-[#00E676] hover:underline"
              >
                Voir tout &gt;
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ACTIVE_LIVES.map(live => (
                <div
                  key={live.id}
                  onClick={() => {
                    const matched = creators.find(c => c.id === live.creatorId);
                    if (matched) onSelectCreator(matched);
                  }}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 group-hover:scale-105 transition shadow-lg shadow-pink-500/20">
                    <div className="p-0.5 bg-[#030604] rounded-full">
                      <img
                        src={live.creatorAvatar}
                        alt={live.creatorName}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover"
                      />
                    </div>
                    {/* Pink "En direct" pill from mockup */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-md bg-gradient-to-r from-pink-600 to-red-600 text-[8px] font-black uppercase text-white shadow-md border border-black whitespace-nowrap">
                      En direct
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-white mt-2 truncate w-full">{live.creatorName}</h4>
                  <span className="text-[10px] text-pink-400 font-bold flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    {live.viewers}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pour vous (2-Column Discovery Grid matching Screen 4) */}
          <div className="mb-6">
            <h3 className="text-sm font-extrabold text-white mb-3 px-1">
              Pour vous
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {DISCOVER_TRENDING_ITEMS.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    const matched = creators.find(c => c.displayName.toLowerCase().includes(item.creatorName.toLowerCase()));
                    if (matched) onSelectCreator(matched);
                  }}
                  className="relative rounded-2xl overflow-hidden bg-[#0A100D] border border-[#183A2A] aspect-[3/4] cursor-pointer group shadow-xl hover:border-[#00E676]/60 transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                  {/* Top Category Badge (Musique, Sport) */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/20">
                    {item.category}
                  </span>

                  {/* Bottom View Count + Play Icon */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      {item.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Call to Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A100D] to-[#041F12] border border-[#183A2A] flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="text-xs font-bold text-white mb-0.5">Vous êtes un artiste ou créateur ?</p>
              <p className="text-[11px] text-[#A8B5AE]">Obtenez le badge officiel certifié FanLink.</p>
            </div>
            <button
              onClick={onRequestVerification}
              className="px-3 py-1.5 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-extrabold text-xs flex-shrink-0 transition"
            >
              Postuler
            </button>
          </div>

        </>
      )}

    </div>
  );
};
