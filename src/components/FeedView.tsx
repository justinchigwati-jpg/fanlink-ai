import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Check, 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music2, 
  Lock, 
  Sparkles, 
  UserPlus, 
  UserCheck, 
  LayoutList, 
  Smartphone 
} from 'lucide-react';
import { Post, UserProfile } from '../types';
import { ACTIVE_LIVES } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';

interface FeedViewProps {
  posts: Post[];
  creators: UserProfile[];
  feedSubTab: 'forYou' | 'following' | 'stars';
  onLikePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onOpenShare: (post: Post) => void;
  onSelectCreator: (creator: UserProfile) => void;
  onOpenLive: () => void;
  onOpenCreate: () => void;
  searchQuery: string;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  creators,
  feedSubTab,
  onLikePost,
  onOpenComments,
  onOpenShare,
  onSelectCreator,
  onOpenLive,
  onOpenCreate,
  searchQuery
}) => {
  const { userProfile, deductCoins } = useAuth();
  const { t } = useCurrencyLang();

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('Tendances');
  const categories = ['Tendances', 'Musique', 'Sport', 'Gaming', 'Mode'];

  // Followed creators
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set(['sarah_queen']));
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set(['post_sarah_01']));
  const [unlockedExclusiveIds, setUnlockedExclusiveIds] = useState<Set<string>>(new Set());
  
  // Media playback controls
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'immersive' | 'standard'>('immersive');

  const handleToggleFollow = (creatorId: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  };

  const handleToggleSave = (postId: string) => {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleUnlockExclusive = (post: Post) => {
    const cost = post.exclusivePriceCoins || 50;
    if (deductCoins(cost)) {
      setUnlockedExclusiveIds(prev => new Set(prev).add(post.id));
    } else {
      alert(`Solde insuffisant ! Cette exclusivité requiert ${cost} FanCoins. Rechargez votre compte depuis le bouton monnaie.`);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (feedSubTab === 'following') {
      return followedIds.has(p.authorId);
    }
    if (feedSubTab === 'stars') {
      return p.authorVerified;
    }
    return true;
  });

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-3 pb-24 pt-2">
      
      {/* 1. Stories & Live Creators Carousel */}
      <div className="mb-3.5 bg-[#0A100D] p-3 rounded-2xl border border-[#183A2A] shadow-md">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#00E676] animate-pulse" />
            Directs & Stories
          </span>
          <button 
            onClick={onOpenLive}
            className="text-[11px] font-bold text-[#00E676] hover:underline flex items-center gap-1"
          >
            Tous les directs &gt;
          </button>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
          
          {/* Active Live Creators matching reference mockup */}
          {ACTIVE_LIVES.map((live) => (
            <div
              key={live.id}
              onClick={onOpenLive}
              className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#00E676] via-pink-500 to-red-500 group-hover:scale-105 transition-transform duration-200">
                <div className="p-0.5 bg-[#030604] rounded-full">
                  <img
                    src={live.creatorAvatar}
                    alt={live.creatorName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                </div>
                {/* LIVE badge */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md bg-gradient-to-r from-red-600 to-pink-600 text-[8px] font-black uppercase text-white shadow-md border border-black flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {live.viewers}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white max-w-[64px] truncate mt-0.5">
                {live.creatorName}
              </span>
            </div>
          ))}

          {/* Other creators in stories bar */}
          {creators.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCreator(c)}
              className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00B86B] group-hover:scale-105 transition-transform duration-200">
                <div className="p-0.5 bg-[#030604] rounded-full">
                  <img
                    src={c.avatarUrl}
                    alt={c.displayName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                </div>
                {c.isVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00E676] rounded-full flex items-center justify-center text-black border border-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-[#A8B5AE] max-w-[64px] truncate mt-0.5">
                {c.displayName.split(' ')[0]}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* 2. Category Discovery Pills & View Mode Toggle */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#00E676] text-black shadow-md shadow-[#00E676]/20'
                  : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-[#0A100D] border border-[#183A2A] rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('immersive')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'immersive' ? 'bg-[#00E676] text-black' : 'text-[#A8B5AE] hover:text-white'}`}
            title="Mode Immersif (Reels/TikTok)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('standard')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'standard' ? 'bg-[#00E676] text-black' : 'text-[#A8B5AE] hover:text-white'}`}
            title="Mode Fil Standard"
          >
            <LayoutList className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Posts Stream */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0A100D] rounded-3xl border border-[#183A2A]">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-[#00E676]/60 animate-pulse" />
          <h3 className="text-base font-bold text-white mb-1">Aucune publication dans cette vue</h3>
          <p className="text-xs text-[#A8B5AE] mb-5 max-w-sm mx-auto">
            {feedSubTab === 'following' 
              ? 'Abonnez-vous à vos créateurs préférés pour voir leurs publications exclusives ici.'
              : 'Soyez le premier à publier pour votre communauté !'}
          </p>
          <button
            onClick={onOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[#00E676] text-black font-extrabold text-xs shadow-lg shadow-[#00E676]/20 hover:bg-[#34FF96] transition"
          >
            Créer une publication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isFollowed = followedIds.has(post.authorId);
            const isSaved = savedPostIds.has(post.id);
            const isUnlocked = unlockedExclusiveIds.has(post.id);

            // IMMERSIVE / VIDEO REELS CARD STYLE (Matching reference mockup Screen 2)
            if (viewMode === 'immersive') {
              return (
                <div
                  key={post.id}
                  className="relative rounded-3xl overflow-hidden bg-black border border-[#183A2A] shadow-2xl aspect-[9/14] sm:aspect-[9/13] max-h-[640px] flex flex-col justify-between group"
                >
                  {/* Media Background */}
                  <div className="absolute inset-0 z-0">
                    {post.mediaUrl ? (
                      <img
                        src={post.mediaUrl}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0A100D] via-[#051A10] to-[#030604] flex items-center justify-center p-6 text-center">
                        <p className="text-sm text-white font-medium leading-relaxed">{post.content}</p>
                      </div>
                    )}
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30 pointer-events-none" />
                  </div>

                  {/* Top Bar on Immersive Card */}
                  <div className="relative z-10 p-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#00E676] border border-[#183A2A]">
                      #{post.tags[0] || 'FanLink'}
                    </span>

                    <button
                      onClick={() => setIsMuted(prev => !prev)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-[#183A2A] hover:bg-black/80 transition"
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00E676]" />}
                    </button>
                  </div>

                  {/* Floating Action Column on the Right (Matching Screen 2) */}
                  <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
                    
                    {/* Creator avatar with (+) follow button */}
                    <div className="relative">
                      <div 
                        onClick={() => {
                          const matched = creators.find(c => c.id === post.authorId);
                          if (matched) onSelectCreator(matched);
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xl"
                        />
                      </div>
                      {!isFollowed && (
                        <button
                          onClick={() => handleToggleFollow(post.authorId)}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-[#00E676] text-black font-black flex items-center justify-center text-xs shadow-md border border-black hover:scale-110 transition"
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Like button with count */}
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex flex-col items-center gap-0.5 group/btn"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/btn:bg-black/80 transition">
                        <Heart className={`w-5 h-5 ${post.likedByCurrentUser ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
                      </div>
                      <span className="text-[10px] font-bold text-white shadow-sm">
                        {post.likesCount > 1000 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}
                      </span>
                    </button>

                    {/* Comment button with count */}
                    <button
                      onClick={() => onOpenComments(post)}
                      className="flex flex-col items-center gap-0.5 group/btn"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/btn:bg-black/80 transition">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white shadow-sm">
                        {post.commentsCount}
                      </span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={() => onOpenShare(post)}
                      className="flex flex-col items-center gap-0.5 group/btn"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/btn:bg-black/80 transition">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white shadow-sm">
                        Partager
                      </span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleSave(post.id)}
                      className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/80 transition"
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#00E676] text-[#00E676]' : 'text-white'}`} />
                    </button>

                  </div>

                  {/* Bottom Creator Info & Caption Overlay (Matching Screen 2) */}
                  <div className="relative z-10 p-4 pt-0 pr-16">
                    
                    {/* Creator Row with Green "Suivre" Button */}
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        onClick={() => {
                          const matched = creators.find(c => c.id === post.authorId);
                          if (matched) onSelectCreator(matched);
                        }}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="font-extrabold text-sm text-white drop-shadow-md">
                          {post.authorName}
                        </span>
                        {/* Blue verified checkmark from mockup */}
                        <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Green "Suivre" Button */}
                      {!isFollowed && (
                        <button
                          onClick={() => handleToggleFollow(post.authorId)}
                          className="px-3 py-1 rounded-full bg-[#00E676] text-black text-[11px] font-extrabold shadow-md hover:bg-[#34FF96] transition"
                        >
                          Suivre
                        </button>
                      )}
                    </div>

                    {/* Caption & Hashtags */}
                    <p className="text-xs text-white leading-relaxed line-clamp-3 mb-2 font-medium drop-shadow-sm">
                      {post.content}
                    </p>

                    {/* Sound / Music Ticker from mockup */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A8B5AE] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-max border border-white/10">
                      <Music2 className="w-3.5 h-3.5 text-[#00E676] animate-pulse" />
                      <span className="truncate max-w-[220px]">Original Sound - FanLink</span>
                    </div>

                  </div>

                </div>
              );
            }

            // STANDARD FEED CARD VIEW
            return (
              <article
                key={post.id}
                className="bg-[#0A100D] rounded-2xl border border-[#183A2A] overflow-hidden shadow-xl"
              >
                {/* Author Bar */}
                <div className="p-3.5 flex items-center justify-between">
                  <div 
                    onClick={() => {
                      const matched = creators.find(c => c.id === post.authorId);
                      if (matched) onSelectCreator(matched);
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#183A2A]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{post.authorName}</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#A8B5AE]">@{post.authorUsername}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(post.authorId)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      isFollowed
                        ? 'bg-[#183A2A] text-white'
                        : 'bg-[#00E676] text-black hover:bg-[#34FF96]'
                    }`}
                  >
                    {isFollowed ? 'Abonné' : 'Suivre'}
                  </button>
                </div>

                {/* Media */}
                {post.mediaUrl && (
                  <div className="relative bg-black w-full overflow-hidden max-h-[480px]">
                    <img src={post.mediaUrl} alt="Post Media" className="w-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="p-3.5">
                  <p className="text-xs sm:text-sm text-white leading-relaxed mb-2.5">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#A8B5AE] pt-2 border-t border-[#183A2A]/60">
                    <span>{new Date(post.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
                    <span>{post.likesCount.toLocaleString()} J'aime • {post.commentsCount} commentaires</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="px-3 py-2 bg-[#030604] border-t border-[#183A2A]/60 flex items-center justify-between text-[#A8B5AE]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold ${post.likedByCurrentUser ? 'text-red-500' : 'hover:text-red-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>
                    <button
                      onClick={() => onOpenComments(post)}
                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#00E676]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button onClick={() => onOpenShare(post)} className="hover:text-[#00E676]">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => handleToggleSave(post.id)}>
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#00E676] text-[#00E676]' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
};
