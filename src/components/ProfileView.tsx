import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Check, 
  Play, 
  Edit3, 
  Coins, 
  DollarSign, 
  Shield, 
  Settings, 
  Globe2, 
  FileText, 
  LogOut, 
  Trash2, 
  ChevronDown, 
  MessageSquare,
  Sparkles,
  TrendingUp,
  Activity,
  Award,
  Download,
  Share2,
  Heart,
  PlusCircle,
  Video,
  Camera,
  Calendar,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { Post, UserProfile } from '../types';

interface ProfileViewProps {
  creatorToView?: UserProfile | null;
  onBack?: () => void;
  onOpenWallet: () => void;
  onOpenAuth: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenMonetization: () => void;
  onOpenAdmin: () => void;
  onOpenMessageWithCreator?: (creator: UserProfile) => void;
  onOpenSettings: () => void;
  onOpenEvolution: () => void;
  onOpenActivityCenter: () => void;
  posts?: Post[];
  onOpenCreate?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  creatorToView,
  onBack,
  onOpenWallet,
  onOpenAuth,
  onOpenTerms,
  onOpenPrivacy,
  onOpenMonetization,
  onOpenAdmin,
  onOpenMessageWithCreator,
  onOpenSettings,
  onOpenEvolution,
  onOpenActivityCenter,
  posts = [],
  onOpenCreate
}) => {
  const { userProfile, updateProfileData, logout, isAdmin } = useAuth();
  const { language, setLanguage, currency, setCurrency, formatCurrency } = useCurrencyLang();

  // If viewing a creator, use their profile, otherwise use the logged-in user profile
  const profile = creatorToView || userProfile;
  const isOwnProfile = !creatorToView || creatorToView.id === userProfile?.id;

  const [activeTab, setActiveTab] = useState<'videos' | 'likes' | 'about'>('videos');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit fields
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [country, setCountry] = useState(profile?.country || 'France');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');

  // Calculate REAL genuine metrics (no fake bots, no fake numbers)
  const userPosts = posts.filter(p => p.authorId === profile?.id);
  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
  const userLikedPosts = posts.filter(p => p.likedByCurrentUser);

  const followingCount = profile?.followingCount ?? 0;
  const followersCount = (profile?.followersCount ?? 0) + (isFollowed ? 1 : 0);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    await updateProfileData({ 
      displayName: displayName.trim(), 
      username: cleanUsername,
      bio: bio.trim(), 
      country, 
      avatarUrl 
    });
    setIsEditing(false);
  };

  const handleCopyProfileLink = () => {
    if (profile?.username) {
      navigator.clipboard?.writeText(`${window.location.origin}/@${profile.username}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-2 mb-2">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-5" />
        )}

        <div className="text-center">
          <h3 className="font-black text-sm text-white tracking-tight flex items-center justify-center gap-1">
            <span>@{profile?.username || 'utilisateur'}</span>
            {profile?.isVerified && (
              <span className="w-4 h-4 bg-[#00E676] rounded-full flex items-center justify-center text-black text-[9px] font-bold">
                ✓
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {isOwnProfile && (
            <button
              onClick={onOpenSettings}
              title="Paramètres du compte"
              className="p-1.5 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/50 text-[#A8B5AE] hover:text-white transition"
            >
              <Settings className="w-4 h-4 text-[#00E676]" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSettingsDrawer(prev => !prev)}
              className="p-1.5 rounded-full text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Quick Actions Dropdown */}
            {showSettingsDrawer && (
              <div className="absolute right-0 top-8 z-30 w-52 rounded-2xl bg-[#0A100D] border border-[#183A2A] p-2 shadow-2xl text-xs space-y-1">
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => { onOpenSettings(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2 font-bold"
                    >
                      <Settings className="w-4 h-4 text-[#00E676]" /> Paramètres & Sécurité
                    </button>
                    <button
                      onClick={() => { onOpenEvolution(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4 text-[#00E676]" /> Mon Évolution
                    </button>
                    <button
                      onClick={() => { setIsEditing(true); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4 text-[#00E676]" /> Modifier le profil
                    </button>
                    <button
                      onClick={() => { onOpenMonetization(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4 text-[#00E676]" /> Espace Monétisation
                    </button>
                  </>
                )}
                {isAdmin && (
                  <button
                    onClick={() => { onOpenAdmin(); setShowSettingsDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-amber-300 hover:bg-[#183A2A]/40 flex items-center gap-2 font-bold"
                  >
                    <Shield className="w-4 h-4" /> Administration
                  </button>
                )}
                <button
                  onClick={() => { onOpenWallet(); setShowSettingsDrawer(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-amber-400 hover:bg-[#183A2A]/40 flex items-center gap-2"
                >
                  <Coins className="w-4 h-4" /> Portefeuille ({userProfile?.coinsBalance ?? 0} FC)
                </button>
                {isOwnProfile && (
                  <button
                    onClick={() => { logout(); setShowSettingsDrawer(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-[#183A2A]/40 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Se déconnecter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Avatar & Verification (TikTok Standard) */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-2.5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#00E676] to-[#00B86B] shadow-xl shadow-[#00E676]/15">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile?.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-[#030604]"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0A100D] flex items-center justify-center text-2xl font-black text-[#00E676] border-2 border-[#030604]">
                {(profile?.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {profile?.isVerified && (
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00E676] rounded-full flex items-center justify-center text-black border-2 border-[#030604] shadow-md font-bold text-xs">
              ✓
            </div>
          )}
        </div>

        {/* Display Name & Role */}
        <h2 className="text-lg font-black text-white">{profile?.displayName || 'Utilisateur FanLink'}</h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#A8B5AE] font-mono">@{profile?.username}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#183A2A] text-[#00E676] font-bold uppercase tracking-wider">
            {profile?.accountType === 'creator' || profile?.accountType === 'artist' ? 'Créateur' : 'Supporter'}
          </span>
        </div>

        {/* Real TikTok-style Stats Row (Suivis | Abonnés | J'aime réels) */}
        <div className="flex items-center justify-center gap-8 my-4 text-center">
          <div>
            <h4 className="text-base sm:text-lg font-black text-white">{followingCount}</h4>
            <span className="text-[11px] text-[#A8B5AE] font-medium">Abonnements</span>
          </div>
          <div className="w-px h-6 bg-[#183A2A]" />
          <div>
            <h4 className="text-base sm:text-lg font-black text-white">{followersCount}</h4>
            <span className="text-[11px] text-[#A8B5AE] font-medium">Abonnés</span>
          </div>
          <div className="w-px h-6 bg-[#183A2A]" />
          <div>
            <h4 className="text-base sm:text-lg font-black text-white">{totalLikes}</h4>
            <span className="text-[11px] text-[#A8B5AE] font-medium">J'aime</span>
          </div>
        </div>

        {/* Bio */}
        <div className="max-w-md px-4 text-xs text-[#A8B5AE] leading-relaxed mb-4">
          <p className="text-white font-medium">
            {profile?.bio || (isOwnProfile ? "Aucune biographie ajoutée pour le moment. Cliquez sur 'Modifier le profil' pour vous présenter à la communauté." : "Aucune biographie pour le moment.")}
          </p>
        </div>

        {/* Action Buttons: Own Profile Tools or Follow/Message (TikTok Style) */}
        <div className="w-full max-w-sm px-2 mb-4">
          {!isOwnProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowed(prev => !prev)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition shadow-lg ${
                  isFollowed
                    ? 'bg-[#183A2A] text-white border border-[#183A2A]'
                    : 'bg-[#00E676] hover:bg-[#34FF96] text-black shadow-[#00E676]/25'
                }`}
              >
                {isFollowed ? 'Abonné ✓' : 'S\'abonner'}
              </button>

              <button
                onClick={() => {
                  if (profile && onOpenMessageWithCreator) {
                    onOpenMessageWithCreator(profile);
                  }
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 rounded-2xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/60 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Modifier le profil</span>
              </button>

              <button
                onClick={handleCopyProfileLink}
                className="py-2.5 px-4 rounded-2xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/60 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                title="Partager le lien du profil"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Share2 className="w-3.5 h-3.5 text-[#A8B5AE]" />}
                <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Profile Navigation Tabs (Vidéos / J'aime / À propos) */}
      <div className="flex border-b border-[#183A2A] mb-3">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'videos'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Publications ({userPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'likes'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>J'aime ({userLikedPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'about'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>À propos</span>
        </button>
      </div>

      {/* Tab 1: Real Publications Grid */}
      {activeTab === 'videos' && (
        <div>
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0A100D] border border-[#183A2A] group cursor-pointer"
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.content}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full p-2 bg-[#0A100D] flex items-center justify-center text-[10px] text-center text-[#A8B5AE]">
                      {post.content.slice(0, 50)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Real Like Counter at bottom */}
                  <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[10px] font-bold text-white">
                    <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                    <span>{post.likesCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean TikTok Empty State */
            <div className="text-center py-14 px-4 bg-[#0A100D] rounded-3xl border border-[#183A2A]">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
                <Camera className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {isOwnProfile ? 'Partagez votre premier contenu' : 'Aucune publication pour le moment'}
              </h4>
              <p className="text-xs text-[#A8B5AE] mb-5 max-w-xs mx-auto">
                {isOwnProfile 
                  ? 'Publiez une vidéo, une photo ou une annonce pour débuter votre communauté FanLink.'
                  : 'Cet utilisateur n\'a pas encore publié de vidéo ou de photo.'}
              </p>
              {isOwnProfile && onOpenCreate && (
                <button
                  onClick={onOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00B86B] text-black font-black text-xs hover:brightness-110 shadow-lg shadow-[#00E676]/20 transition flex items-center gap-2 mx-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Créer une publication</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Real Liked Posts */}
      {activeTab === 'likes' && (
        <div>
          {userLikedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {userLikedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0A100D] border border-[#183A2A] group cursor-pointer"
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.content}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full p-2 bg-[#0A100D] flex items-center justify-center text-[10px] text-center text-[#A8B5AE]">
                      {post.content.slice(0, 50)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[10px] font-bold text-white">
                    <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                    <span>{post.likesCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#A8B5AE] bg-[#0A100D] rounded-3xl border border-[#183A2A]">
              Vous n'avez pas encore aimé de publication.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Genuine Account Details */}
      {activeTab === 'about' && (
        <div className="p-5 bg-[#0A100D] rounded-3xl border border-[#183A2A] text-xs space-y-3.5 text-[#A8B5AE]">
          <div className="flex items-center justify-between py-1.5 border-b border-[#183A2A]/50">
            <span className="text-[#A8B5AE]">Type de compte</span>
            <span className="text-white font-bold uppercase">{profile?.accountType || 'Standard'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#183A2A]/50">
            <span className="text-[#A8B5AE]">Pays / Région</span>
            <span className="text-white font-bold">{profile?.country || 'International'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#183A2A]/50">
            <span className="text-[#A8B5AE]">Date d'inscription</span>
            <span className="text-white font-bold">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Membre récent'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#183A2A]/50">
            <span className="text-[#A8B5AE]">Statut de certification</span>
            <span className="font-bold flex items-center gap-1 text-white">
              {profile?.isVerified ? (
                <span className="text-[#00E676] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Officiellement Certifié
                </span>
              ) : (
                <span className="text-[#A8B5AE]">Compte Standard</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Clean Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 sm:p-6 shadow-2xl text-white">
            <h3 className="font-black text-sm mb-4 text-[#00E676] flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span>Modifier mon Profil</span>
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Pseudonyme unique (@)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white font-mono focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Biographie (150 caractères max)</label>
                <textarea
                  rows={3}
                  maxLength={150}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Présentez-vous à votre communauté..."
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Pays / Ville</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ex: RDC, France, Côte d'Ivoire..."
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Lien de la photo de profil (Avatar URL)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#183A2A]/40 text-[#A8B5AE] hover:text-white transition font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00E676] text-black font-black hover:bg-[#34FF96] transition shadow-lg shadow-[#00E676]/20"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
