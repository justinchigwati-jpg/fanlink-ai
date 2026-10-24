import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  MessageSquare, 
  Users, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Filter, 
  Search, 
  ChevronRight,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStoredUserActivities } from '../services/dataService';
import { Post, UserActivityItem, UserProfile } from '../types';

interface ActivityCenterViewProps {
  onBack: () => void;
  posts: Post[];
  onSelectCreator?: (creator: UserProfile) => void;
}

export const ActivityCenterView: React.FC<ActivityCenterViewProps> = ({
  onBack,
  posts
}) => {
  const { userProfile } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'like' | 'comment' | 'follow' | 'wallet' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const rawActivities = getStoredUserActivities();

  // Filter activities
  const filteredActivities = rawActivities.filter(act => {
    if (filterType !== 'all' && act.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        (act.targetTitle && act.targetTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter liked posts
  const likedPosts = posts.filter(p => p.likedByCurrentUser);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
      {/* Top Header */}
      <div className="flex items-center justify-between py-2.5 mb-4 border-b border-[#183A2A]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 p-1.5 -ml-1 rounded-xl text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#00E676]" />
          <span className="text-xs font-bold">Retour au profil</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 justify-center">
            <Activity className="w-4 h-4 text-[#00E676]" />
            Centre des Activités
          </h2>
          <p className="text-[10px] text-[#A8B5AE]">
            Historique complet de vos interactions et actions privées
          </p>
        </div>

        <div className="w-8" />
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans l'historique d'activité..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/60 focus:outline-none focus:border-[#00E676]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Tout', icon: Activity },
            { id: 'like', label: 'Mentions J\'aime', icon: Heart },
            { id: 'comment', label: 'Commentaires', icon: MessageSquare },
            { id: 'follow', label: 'Abonnements', icon: Users },
            { id: 'wallet', label: 'FanCoins & Cadeaux', icon: Sparkles },
            { id: 'security', label: 'Sécurité & Compte', icon: ShieldCheck }
          ].map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
                    : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Activity Timeline */}
      <div className="space-y-3 mb-6">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#0A100D] border border-[#183A2A] text-[#A8B5AE] text-xs">
            <Clock className="w-8 h-8 text-[#A8B5AE]/40 mx-auto mb-2" />
            <p className="font-bold text-white mb-1">Aucune activité trouvée</p>
            <p className="text-[11px]">Vos futures interactions apparaîtront automatiquement ici en temps réel.</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-start gap-3.5 text-xs hover:border-[#183A2A]/80 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center justify-center flex-shrink-0 mt-0.5">
                {act.type === 'like' && <Heart className="w-4 h-4 text-red-400 fill-red-400" />}
                {act.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                {act.type === 'follow' && <Users className="w-4 h-4 text-[#00E676]" />}
                {act.type === 'gift' && <Gift className="w-4 h-4 text-amber-400" />}
                {act.type === 'wallet' && <Sparkles className="w-4 h-4 text-[#00E676]" />}
                {act.type === 'profile_update' && <ShieldCheck className="w-4 h-4 text-purple-400" />}
                {act.type === 'security' && <ShieldCheck className="w-4 h-4 text-[#00E676]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-extrabold text-white">{act.title}</p>
                  <span className="text-[10px] text-[#A8B5AE] flex-shrink-0">
                    {new Date(act.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-[#A8B5AE] leading-relaxed mb-1">{act.description}</p>

                {act.targetTitle && (
                  <div className="p-2 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center gap-2 mt-1.5">
                    {act.targetImage && (
                      <img src={act.targetImage} alt="Preview" className="w-7 h-7 rounded-lg object-cover" />
                    )}
                    <span className="text-[11px] text-white truncate font-medium">{act.targetTitle}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Liked Publications Quick Gallery */}
      {filterType === 'like' || filterType === 'all' ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0A100D] border border-[#183A2A]">
          <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            Publications que vous avez aimées ({likedPosts.length})
          </h3>

          {likedPosts.length === 0 ? (
            <p className="text-xs text-[#A8B5AE] italic py-3 text-center">
              Vous n'avez pas encore aimé de publications.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {likedPosts.map(post => (
                <div key={post.id} className="p-2.5 rounded-2xl bg-[#030604] border border-[#183A2A] text-xs">
                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt="Post preview" className="w-full aspect-video rounded-xl object-cover mb-2" />
                  )}
                  <p className="font-bold text-white line-clamp-1">{post.authorName}</p>
                  <p className="text-[10px] text-[#A8B5AE] line-clamp-1 mt-0.5">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

    </div>
  );
};
