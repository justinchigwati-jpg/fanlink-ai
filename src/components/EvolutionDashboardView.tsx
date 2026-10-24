import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Users, 
  Calendar, 
  Award, 
  DollarSign, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  Gift, 
  Bookmark,
  Share2,
  Zap,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { SYSTEM_BADGES, getStoredUserActivities } from '../services/dataService';
import { Post, UserProfile } from '../types';

interface EvolutionDashboardViewProps {
  onBack: () => void;
  posts: Post[];
  creators: UserProfile[];
  onSelectCreator: (creator: UserProfile) => void;
  onOpenMonetization: () => void;
  onOpenWallet: () => void;
}

export const EvolutionDashboardView: React.FC<EvolutionDashboardViewProps> = ({
  onBack,
  posts,
  creators,
  onSelectCreator,
  onOpenMonetization,
  onOpenWallet
}) => {
  const { userProfile } = useAuth();
  const { formatCurrency } = useCurrencyLang();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const isCreatorAccount = userProfile?.accountType === 'creator' || userProfile?.accountType === 'artist' || userProfile?.accountType === 'athlete';
  const [activeTab, setActiveTab] = useState<'overview' | 'creator' | 'fan'>(isCreatorAccount ? 'creator' : 'overview');

  const userActivities = getStoredUserActivities();

  // Dynamic simulation values matching the selected time range
  const rangeMultipliers = {
    '7d': { views: 0.28, growth: '+6.2%', likes: 0.24, comments: 0.22, days: 7 },
    '30d': { views: 1.0, growth: '+18.4%', likes: 1.0, comments: 1.0, days: 30 },
    '90d': { views: 2.8, growth: '+42.5%', likes: 2.7, comments: 2.6, days: 90 },
    'all': { views: 6.5, growth: '+128%', likes: 6.2, comments: 5.9, days: 180 }
  };

  const currMult = rangeMultipliers[timeRange];

  // Calculated Stats
  const baseViews = isCreatorAccount ? 342000 : 12400;
  const totalViews = Math.round(baseViews * currMult.views);
  const totalLikes = isCreatorAccount ? Math.round(48200 * currMult.likes) : Math.round(1860 * currMult.likes);
  const totalComments = isCreatorAccount ? Math.round(3420 * currMult.comments) : Math.round(145 * currMult.comments);
  const totalPosts = userProfile?.postsCount || (isCreatorAccount ? 45 : 8);

  // SVG Chart Data Points (Responsive Smooth Line)
  const chartPoints = timeRange === '7d' 
    ? [32, 45, 58, 52, 69, 84, 95]
    : timeRange === '30d'
    ? [20, 28, 35, 42, 38, 55, 62, 58, 74, 82, 88, 96]
    : timeRange === '90d'
    ? [15, 24, 32, 48, 59, 68, 72, 85, 98]
    : [10, 18, 30, 42, 60, 75, 88, 100];

  // Helper to generate SVG polyline / path coordinates
  const svgWidth = 600;
  const svgHeight = 180;
  const xStep = svgWidth / (chartPoints.length - 1);
  const maxY = Math.max(...chartPoints);
  const minY = Math.min(...chartPoints);

  const pointsString = chartPoints
    .map((val, idx) => {
      const x = idx * xStep;
      const y = svgHeight - ((val - minY) / (maxY - minY || 1)) * (svgHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `M 0,${svgHeight} L ${chartPoints
    .map((val, idx) => {
      const x = idx * xStep;
      const y = svgHeight - ((val - minY) / (maxY - minY || 1)) * (svgHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' L ')} L ${svgWidth},${svgHeight} Z`;

  // Top Performing Posts (Filtered or from seeds)
  const topContents = posts.slice(0, 3).map((p, idx) => ({
    ...p,
    rank: idx + 1,
    viewsCount: Math.round(p.likesCount * 3.4),
    engagementRate: `${((p.likesCount + p.commentsCount) / Math.max(1, p.likesCount * 3.4) * 100).toFixed(1)}%`
  }));

  // Monetization eligibility criteria check
  const criteriaFollowers = (userProfile?.followersCount || 0) >= 1000;
  const criteriaViews = totalViews >= 10000;
  const criteriaVerified = !!userProfile?.isVerified;
  const isEligible = criteriaFollowers && criteriaViews;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
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
            <TrendingUp className="w-4 h-4 text-[#00E676]" />
            Mon Évolution & Statistiques
          </h2>
          <p className="text-[10px] text-[#A8B5AE]">
            Tableau de bord de visibilité et d'engagement personnel
          </p>
        </div>

        <div className="w-8" />
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] mb-5">
        <span className="text-[11px] font-bold text-[#A8B5AE] pl-3 hidden sm:inline">
          Période analysée :
        </span>
        <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-end">
          {[
            { id: '7d', label: '7 jours' },
            { id: '30d', label: '30 jours' },
            { id: '90d', label: '90 jours' },
            { id: 'all', label: 'Tout le temps' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-1 sm:flex-initial text-center ${
                timeRange === r.id
                  ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Perspective Tabs (Vue Globale / Créateur / Fan) */}
      <div className="flex border-b border-[#183A2A] mb-5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
            activeTab === 'overview'
              ? 'text-[#00E676] border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          Vue d'ensemble
        </button>

        {isCreatorAccount ? (
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
              activeTab === 'creator'
                ? 'text-[#00E676] border-b-2 border-[#00E676]'
                : 'text-[#A8B5AE] hover:text-white'
            }`}
          >
            Performances Créateur & Monétisation
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('fan')}
            className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
              activeTab === 'fan'
                ? 'text-[#00E676] border-b-2 border-[#00E676]'
                : 'text-[#A8B5AE] hover:text-white'
            }`}
          >
            Activité Fan & Récompenses
          </button>
        )}
      </div>

      {/* 4 HIGHLIGHT METRICS CARDS (Mobile Responsive Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Total Views */}
        <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#A8B5AE]">Vues de contenu</span>
            <div className="w-7 h-7 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white">{totalViews.toLocaleString()}</h3>
          <span className="text-[10px] font-bold text-[#00E676] flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> {currMult.growth} vs précédente
          </span>
        </div>

        {/* Followers / Audience */}
        <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#A8B5AE]">Abonnés</span>
            <div className="w-7 h-7 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white">
            {(userProfile?.followersCount || 142).toLocaleString()}
          </h3>
          <span className="text-[10px] text-[#A8B5AE] mt-1 block">
            {userProfile?.followingCount || 38} abonnements
          </span>
        </div>

        {/* Likes Received */}
        <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#A8B5AE]">J'aime reçus</span>
            <div className="w-7 h-7 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-red-400" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white">{totalLikes.toLocaleString()}</h3>
          <span className="text-[10px] font-bold text-[#00E676] flex items-center gap-1 mt-1">
            <Flame className="w-3 h-3" /> Forte interaction
          </span>
        </div>

        {/* Comments Received */}
        <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#A8B5AE]">Commentaires</span>
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white">{totalComments.toLocaleString()}</h3>
          <span className="text-[10px] text-[#A8B5AE] mt-1 block">
            {totalPosts} publications publiées
          </span>
        </div>

      </div>

      {/* INTERACTIVE GROWTH SVG CHART */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0A100D] border border-[#183A2A] mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E676]" />
              Courbe d'évolution de visibilité
            </h3>
            <p className="text-[11px] text-[#A8B5AE]">Progression des vues et interactions cumulées</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#00E676]/20 text-[#00E676] text-xs font-black border border-[#00E676]/40">
            {currMult.growth}
          </span>
        </div>

        {/* Responsive SVG Graphic */}
        <div className="w-full h-44 overflow-hidden relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full preserve-3d">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E676" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#00E676" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="#183A2A" strokeDasharray="3 3" />
            <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="#183A2A" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2={svgWidth} y2="140" stroke="#183A2A" strokeDasharray="3 3" />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Line Stroke */}
            <polyline
              fill="none"
              stroke="#00E676"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* Point Markers */}
            {chartPoints.map((val, idx) => {
              const x = idx * xStep;
              const y = svgHeight - ((val - minY) / (maxY - minY || 1)) * (svgHeight - 40) - 20;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#030604"
                  stroke="#00E676"
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#A8B5AE] pt-2 border-t border-[#183A2A]">
          <span>Début de période</span>
          <span>Point médian ({timeRange})</span>
          <span className="text-[#00E676] font-bold">Aujourd'hui</span>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Account Vital Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#A8B5AE] block mb-1">Date d'inscription :</span>
              <p className="font-extrabold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                {new Date(userProfile?.createdAt || '2026-02-15').toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div>
              <span className="text-[#A8B5AE] block mb-1">Statut du compte :</span>
              <p className="font-extrabold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                {userProfile?.isVerified ? 'Certifié Officiel' : 'Standard vérifié'}
              </p>
            </div>

            <div>
              <span className="text-[#A8B5AE] block mb-1">Solde FanCoins :</span>
              <p className="font-extrabold text-[#00E676] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {userProfile?.coinsBalance || 0} FanCoins
              </p>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E676]" />
              Activité Récente Confirmée
            </h3>

            <div className="space-y-3">
              {userActivities.slice(0, 4).map(act => (
                <div key={act.id} className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {act.type === 'like' && <Heart className="w-4 h-4 fill-[#00E676]" />}
                    {act.type === 'comment' && <MessageSquare className="w-4 h-4" />}
                    {act.type === 'follow' && <Users className="w-4 h-4" />}
                    {act.type === 'gift' && <Gift className="w-4 h-4" />}
                    {act.type === 'wallet' && <Sparkles className="w-4 h-4" />}
                    {act.type === 'profile_update' && <ShieldCheck className="w-4 h-4" />}
                    {act.type === 'security' && <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-white truncate">{act.title}</p>
                      <span className="text-[10px] text-[#A8B5AE] flex-shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A8B5AE] leading-relaxed">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: CREATOR PERFORMANCE */}
      {activeTab === 'creator' && (
        <div className="space-y-6">
          
          {/* Top Performing Publications */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00E676]" />
              Contenus les Plus Consultés
            </h3>

            <div className="space-y-2.5">
              {topContents.map(post => (
                <div key={post.id} className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-[#183A2A] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    #{post.rank}
                  </span>
                  
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-[#183A2A] flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold line-clamp-1">{post.content}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#A8B5AE] mt-1">
                      <span className="flex items-center gap-1 text-white font-bold">
                        <Eye className="w-3 h-3 text-[#00E676]" /> {post.viewsCount.toLocaleString()} vues
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" /> {post.likesCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-blue-400" /> {post.commentsCount}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-[#00E676]/15 text-[#00E676] text-[11px] font-black border border-[#00E676]/30 hidden sm:inline">
                    {post.engagementRate} eng.
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Audience & AI Optimization Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Peak Activity Hours */}
            <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-2 text-xs">
              <h4 className="font-extrabold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00E676]" />
                Meilleures Heures d'Audience
              </h4>
              <p className="text-[#A8B5AE] text-[11px]">
                Vos abonnés sont les plus réactifs aux créneaux suivants :
              </p>
              <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
                <p className="font-bold text-white text-sm">18h30 - 22h00 (Heure de Paris/Abidjan)</p>
                <p className="text-[11px] text-[#00E676] font-semibold mt-0.5">Jours phares : Vendredi & Samedi soir</p>
              </div>
            </div>

            {/* AI Optimization Tips */}
            <div className="p-4 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-2 text-xs">
              <h4 className="font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E676]" />
                Conseil Stratégique FanLink AI
              </h4>
              <p className="text-[#A8B5AE] text-[11px]">
                Analyse prédictive basée sur vos 30 derniers jours :
              </p>
              <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
                <p className="text-white leading-relaxed text-[11px]">
                  Les publications avec extraits musicaux et tags régionaux obtiennent <strong className="text-[#00E676]">+32% de partages</strong>. Pensez à planifier un live acoustique avant chaque sortie.
                </p>
              </div>
            </div>

          </div>

          {/* Monetization Status (80% net creator / 20% platform) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#00E676]" />
                  Programme de Monétisation (80% Créateur / 20% Plateforme)
                </h3>
                <p className="text-xs text-[#A8B5AE]">
                  Revenus générés par abonnements VIP, cadeaux virtuels et messages exclusifs.
                </p>
              </div>

              <button
                onClick={onOpenMonetization}
                className="px-3.5 py-2 rounded-xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition shadow-md shadow-[#00E676]/20 flex-shrink-0"
              >
                Gérer les Revenus
              </button>
            </div>

            {/* Criteria Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${criteriaFollowers ? 'bg-[#00E676]/10 border-[#00E676]' : 'bg-[#030604] border-[#183A2A]'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">1 000 Abonnés</span>
                  {criteriaFollowers ? <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> : <span className="text-[10px] text-[#A8B5AE]">En cours</span>}
                </div>
                <p className="text-[11px] text-[#A8B5AE]">{(userProfile?.followersCount || 0).toLocaleString()} / 1 000</p>
              </div>

              <div className={`p-3 rounded-xl border ${criteriaViews ? 'bg-[#00E676]/10 border-[#00E676]' : 'bg-[#030604] border-[#183A2A]'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">10 000 Vues</span>
                  {criteriaViews ? <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> : <span className="text-[10px] text-[#A8B5AE]">En cours</span>}
                </div>
                <p className="text-[11px] text-[#A8B5AE]">{totalViews.toLocaleString()} / 10 000</p>
              </div>

              <div className={`p-3 rounded-xl border ${criteriaVerified ? 'bg-[#00E676]/10 border-[#00E676]' : 'bg-[#030604] border-[#183A2A]'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Certification</span>
                  {criteriaVerified ? <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> : <span className="text-[10px] text-[#A8B5AE]">Facultatif</span>}
                </div>
                <p className="text-[11px] text-[#A8B5AE]">{criteriaVerified ? 'Identité Validée' : 'Non vérifié'}</p>
              </div>
            </div>

            {/* Confirmed Earnings Banner */}
            <div className="p-3.5 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#A8B5AE] block">Revenus nets disponibles :</span>
                <span className="text-lg font-black text-white">
                  {formatCurrency(userProfile?.creatorEarningsEur || 0)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#A8B5AE] block">En cours de traitement :</span>
                <span className="text-sm font-bold text-amber-400">
                  {formatCurrency(userProfile?.pendingEarningsEur || 0)}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: FAN ACTIVITY & BADGES */}
      {activeTab === 'fan' && (
        <div className="space-y-6">
          
          {/* Fan Level & Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#00E676]" />
                  Niveau d'Engagement Supporter
                </h3>
                <p className="text-xs text-[#A8B5AE]">
                  Gagnez des points d'expérience (XP) en soutenant vos créateurs préférés.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00E676]/20 text-[#00E676] font-black text-xs border border-[#00E676]/40">
                Niveau 3 • Fan Élite
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mb-2">
              <div className="w-full h-3 rounded-full bg-[#030604] border border-[#183A2A] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00E676] to-[#00B86B]" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-[#A8B5AE]">
                <span>680 XP</span>
                <span>1 000 XP (Niveau 4 : Super Mécène)</span>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              Badges & Récompenses Officiels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYSTEM_BADGES.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-xs transition flex items-start gap-3 ${
                    badge.isUnlocked
                      ? 'bg-[#030604] border-[#00E676]/40'
                      : 'bg-[#030604]/50 border-[#183A2A] opacity-50'
                  }`}
                >
                  <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-extrabold text-white truncate">{badge.name}</p>
                      {badge.isUnlocked ? (
                        <span className="text-[10px] text-[#00E676] font-bold">Débloqué</span>
                      ) : (
                        <span className="text-[10px] text-[#A8B5AE]">Verrouillé</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A8B5AE] leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creators Followed & Suggestions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00E676]" />
                Créateurs Recommandés Pour Vous
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {creators.slice(0, 3).map(c => (
                <div key={c.id} className="p-3 rounded-2xl bg-[#030604] border border-[#183A2A] flex items-center gap-3 text-xs">
                  <img src={c.avatarUrl} alt={c.displayName} className="w-10 h-10 rounded-full object-cover border border-[#00E676]/40" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{c.displayName}</p>
                    <p className="text-[10px] text-[#A8B5AE] truncate">@{c.username}</p>
                    <button
                      onClick={() => onSelectCreator(c)}
                      className="mt-1.5 px-3 py-1 rounded-lg bg-[#00E676] text-[#030604] font-black text-[10px] hover:bg-[#00B86B] transition"
                    >
                      Voir profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
