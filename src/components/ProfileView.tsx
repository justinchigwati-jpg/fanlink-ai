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
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { SupportedLanguage, CurrencyCode, UserProfile } from '../types';
import { SYSTEM_BADGES } from '../services/dataService';

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
  onOpenActivityCenter
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

  // Edit fields
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [country, setCountry] = useState(profile?.country || 'France');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');

  // 3-column video thumbnails matching Screen 5 of reference image
  const profileVideos = [
    { id: 'v1', views: '892K', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { id: 'v2', views: '1,4M', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80' },
    { id: 'v3', views: '659K', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80' },
    { id: 'v4', views: '420K', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
    { id: 'v5', views: '2,1M', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' },
    { id: 'v6', views: '780K', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({ displayName, bio, country, avatarUrl });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2 mb-3">
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

        <h3 className="font-extrabold text-sm text-white">{profile?.displayName}</h3>

        <div className="flex items-center gap-1.5">
          {isOwnProfile && (
            <button
              onClick={onOpenSettings}
              title="Paramètres et confidentialité"
              className="p-1.5 px-2.5 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/50 text-[#A8B5AE] hover:text-white transition flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-[#00E676]" />
              <span className="text-[11px] font-bold text-white hidden sm:inline">Paramètres</span>
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSettingsDrawer(prev => !prev)}
              className="p-1.5 rounded-full text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Quick Settings Dropdown */}
            {showSettingsDrawer && (
              <div className="absolute right-0 top-8 z-30 w-52 rounded-2xl bg-[#0A100D] border border-[#183A2A] p-2 shadow-2xl text-xs space-y-1">
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => { onOpenSettings(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2 font-bold"
                    >
                      <Settings className="w-4 h-4 text-[#00E676]" /> Paramètres & Confidentialité
                    </button>
                    <button
                      onClick={() => { onOpenEvolution(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4 text-[#00E676]" /> Mon évolution (Stats)
                    </button>
                    <button
                      onClick={() => { onOpenActivityCenter(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-[#183A2A]/40 flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4 text-[#00E676]" /> Centre des activités
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
                      <DollarSign className="w-4 h-4 text-[#00E676]" /> Monétisation (80/20)
                    </button>
                    <button
                      onClick={() => { onOpenSettings(); setShowSettingsDrawer(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-[#00E676] hover:bg-[#183A2A]/40 flex items-center gap-2 font-bold"
                    >
                      <Download className="w-4 h-4 text-[#00E676]" /> Exporter Code & APK
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
                  <Coins className="w-4 h-4" /> Portefeuille FanCoins
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

      {/* Main Avatar & Verification Checkmark (Matching Screen 5) */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#00E676] to-[#00B86B] shadow-xl shadow-[#00E676]/15">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'}
              alt={profile?.displayName}
              className="w-full h-full rounded-full object-cover border-2 border-[#030604]"
            />
          </div>
          {profile?.isVerified && (
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center text-white border-2 border-[#030604] shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Display Name & Username */}
        <h2 className="text-lg font-black text-white">{profile?.displayName}</h2>
        <p className="text-xs text-[#A8B5AE] mt-0.5">@{profile?.username}</p>

        {/* Stats Row (Suivis | Abonnés | J'aime) matching Screen 5 */}
        <div className="flex items-center justify-center gap-8 my-4 text-center">
          <div>
            <h4 className="text-base font-black text-white">{profile?.followingCount || 252}</h4>
            <span className="text-[11px] text-[#A8B5AE]">Suivis</span>
          </div>
          <div className="w-px h-6 bg-[#183A2A]" />
          <div>
            <h4 className="text-base font-black text-white">
              {profile?.followersCount && profile.followersCount >= 1000000 
                ? `${(profile.followersCount / 1000000).toFixed(1)}M` 
                : profile?.followersCount ? profile.followersCount.toLocaleString() : '1,2M'}
            </h4>
            <span className="text-[11px] text-[#A8B5AE]">Abonnés</span>
          </div>
          <div className="w-px h-6 bg-[#183A2A]" />
          <div>
            <h4 className="text-base font-black text-white">18,6M</h4>
            <span className="text-[11px] text-[#A8B5AE]">J'aime</span>
          </div>
        </div>

        {/* Bio matching Screen 5 */}
        <div className="max-w-md px-4 text-xs text-[#A8B5AE] leading-relaxed mb-4">
          <p className="text-white font-medium mb-1">
            {profile?.bio || 'Créateur • Music • Dreamer | FanLink Family 💚 | Goma, RDC 🇨🇩'}
          </p>
        </div>

        {/* Action Buttons: Own Profile Tools or Follow / Message */}
        <div className="w-full max-w-sm justify-center mb-4">
          {!isOwnProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowed(prev => !prev)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition shadow-lg ${
                  isFollowed
                    ? 'bg-[#183A2A] text-white border border-[#183A2A]'
                    : 'bg-[#00E676] hover:bg-[#34FF96] text-black shadow-[#00E676]/25'
                }`}
              >
                {isFollowed ? 'Abonné' : 'Suivre'}
              </button>

              <button
                onClick={() => {
                  if (profile && onOpenMessageWithCreator) {
                    onOpenMessageWithCreator(profile);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>

              <button className="p-2.5 rounded-xl bg-[#0A100D] border border-[#183A2A] text-white hover:bg-[#183A2A]/40 transition">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black text-xs font-black transition shadow-lg shadow-[#00E676]/20 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Modifier le profil
                </button>

                <button
                  onClick={onOpenSettings}
                  className="py-2.5 px-3.5 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/50 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                  title="Paramètres et confidentialité"
                >
                  <Settings className="w-4 h-4 text-[#00E676]" />
                  <span>Paramètres</span>
                </button>
              </div>

              {/* Quick Action Strip: Mon Évolution & Centre des Activités */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={onOpenEvolution}
                  className="py-2 px-3 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/60 text-white font-bold transition flex items-center justify-center gap-1.5 group"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#00E676] group-hover:scale-110 transition" />
                  <span>Mon évolution</span>
                </button>

                <button
                  onClick={onOpenActivityCenter}
                  className="py-2 px-3 rounded-xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/60 text-white font-bold transition flex items-center justify-center gap-1.5 group"
                >
                  <Activity className="w-3.5 h-3.5 text-[#00E676] group-hover:scale-110 transition" />
                  <span>Centre d'activités</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Unlocked Badges Showcase */}
        {isOwnProfile && (
          <div className="w-full max-w-sm p-3 mb-2 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-white text-[11px]">Badges officiels obtenus</p>
                <p className="text-[10px] text-[#A8B5AE]">Pionnier FanLink • Fan Actif 🟢 • Mécène Live ⭐</p>
              </div>
            </div>
            <button
              onClick={onOpenEvolution}
              className="text-[10px] font-bold text-[#00E676] hover:underline flex-shrink-0"
            >
              Voir tout
            </button>
          </div>
        )}

      </div>

      {/* Tabs: Vidéos, Likes, À propos (Matching Screen 5) */}
      <div className="flex border-b border-[#183A2A] mb-3">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
            activeTab === 'videos'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          Vidéos
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
            activeTab === 'likes'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          Likes
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 pb-2.5 text-xs font-bold transition text-center ${
            activeTab === 'about'
              ? 'text-white border-b-2 border-[#00E676]'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          À propos
        </button>
      </div>

      {/* Content for Tabs */}
      {activeTab === 'videos' && (
        /* 3-Column Video Thumbnail Grid matching Screen 5 */
        <div className="grid grid-cols-3 gap-1.5">
          {profileVideos.map((video) => (
            <div
              key={video.id}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0A100D] border border-[#183A2A] group cursor-pointer"
            >
              <img
                src={video.img}
                alt="Video thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* View count at bottom left */}
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[10px] font-bold text-white">
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>{video.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'likes' && (
        <div className="py-12 text-center text-xs text-[#A8B5AE] bg-[#0A100D] rounded-2xl border border-[#183A2A]">
          Ce créateur a aimé 142 publications sur FanLink AI.
        </div>
      )}

      {activeTab === 'about' && (
        <div className="p-4 bg-[#0A100D] rounded-2xl border border-[#183A2A] text-xs space-y-3 text-[#A8B5AE]">
          <p><strong className="text-white">Pays :</strong> {profile?.country}</p>
          <p><strong className="text-white">Type de compte :</strong> {profile?.accountType?.toUpperCase()}</p>
          <p><strong className="text-white">Membre depuis :</strong> {new Date(profile?.createdAt || '').toLocaleDateString()}</p>
          <p><strong className="text-white">Statut :</strong> Officiellement vérifié sur FanLink 💚</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 shadow-2xl text-white">
            <h3 className="font-bold text-base mb-4 text-[#00E676]">Modifier le Profil</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Nom affiché</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Biographie</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Pays</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#183A2A] text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00E676] text-black font-extrabold"
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
