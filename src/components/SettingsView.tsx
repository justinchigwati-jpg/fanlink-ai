import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Globe2, 
  HelpCircle, 
  AlertTriangle, 
  LogOut, 
  Trash2, 
  Check, 
  Lock, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Volume2, 
  Wifi, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Mail, 
  AtSign, 
  ChevronRight, 
  Key,
  Users,
  MessageSquare,
  Sparkles,
  Info,
  Download,
  Copy,
  Code2,
  Terminal,
  PackageCheck,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { 
  getStoredUserSettings, 
  saveStoredUserSettings, 
  addStoredUserActivity 
} from '../services/dataService';
import { 
  UserSettings, 
  SupportedLanguage, 
  CurrencyCode, 
  AccountType 
} from '../types';

interface SettingsViewProps {
  onBack: () => void;
  onOpenVerification: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenEvolution?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onOpenVerification,
  onOpenTerms,
  onOpenPrivacy,
  onOpenEvolution
}) => {
  const { userProfile, updateProfileData, logout, resetPassword } = useAuth();
  const { language, setLanguage, currency, setCurrency } = useCurrencyLang();

  // Settings tab navigation
  const [activeSection, setActiveSection] = useState<
    'account' | 'privacy' | 'notifications' | 'appearance' | 'help' | 'export_apk'
  >('account');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Stored preferences state
  const [settings, setSettings] = useState<UserSettings>(() => getStoredUserSettings());

  // Personal info fields
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '+33 6 12 34 56 78');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [country, setCountry] = useState(userProfile?.country || 'France');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');

  // Feedback states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('bug');
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [blockedUsersList, setBlockedUsersList] = useState(settings.privacy.blockedUsers || []);
  const [newBlockedUsername, setNewBlockedUsername] = useState('');

  // Save partial settings
  const updateSettings = (updater: (prev: UserSettings) => UserSettings) => {
    setSettings(prev => {
      const updated = updater(prev);
      saveStoredUserSettings(updated);
      return updated;
    });
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName,
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email,
      phone,
      bio,
      country,
      avatarUrl
    });

    addStoredUserActivity({
      id: `act_${Date.now()}`,
      userId: userProfile?.id || 'demo_fan_101',
      type: 'profile_update',
      title: 'Paramètres mis à jour',
      description: 'Vos informations personnelles ont été enregistrées avec succès.',
      timestamp: new Date().toISOString()
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    try {
      await resetPassword(email);
      setPasswordResetSent(true);
      setTimeout(() => setPasswordResetSent(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de l\'envoi du lien de réinitialisation.');
    }
  };

  const handleAccountTypeToggle = async (newType: AccountType) => {
    if (newType === userProfile?.accountType) return;
    await updateProfileData({
      accountType: newType,
      badge: newType === 'creator' ? 'none' : 'active_fan'
    });
    alert(`Votre compte a été basculé en mode ${newType === 'creator' ? 'Créateur / Artiste' : 'Fan & Supporter'}.`);
  };

  const handleThemeToggle = (theme: 'dark' | 'light') => {
    updateSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme }
    }));
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleUnblockUser = (userId: string) => {
    const filtered = blockedUsersList.filter(u => u.id !== userId);
    setBlockedUsersList(filtered);
    updateSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, blockedUsers: filtered }
    }));
  };

  const handleAddBlockedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedUsername.trim()) return;
    const newUser = {
      id: `blocked_${Date.now()}`,
      username: newBlockedUsername.trim().replace('@', ''),
      displayName: newBlockedUsername.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    };
    const updated = [...blockedUsersList, newUser];
    setBlockedUsersList(updated);
    updateSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, blockedUsers: updated }
    }));
    setNewBlockedUsername('');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportModalOpen(false);
      setReportText('');
    }, 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'SUPPRIMER') {
      alert('Veuillez taper précisément SUPPRIMER pour confirmer.');
      return;
    }
    alert('Votre compte a été supprimé définitivement. Toutes vos données ont été purgées.');
    await logout();
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between py-2.5 mb-4 border-b border-[#183A2A]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 p-1.5 -ml-1 rounded-xl text-[#A8B5AE] hover:text-white hover:bg-[#0A100D] transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#00E676]" />
          <span className="text-xs font-bold">Retour au profil</span>
        </button>

        <h2 className="text-sm sm:text-base font-extrabold text-white text-center">
          Paramètres & Confidentialité
        </h2>

        <div className="w-8" />
      </div>

      {/* Categories Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-[#183A2A]/60">
        <button
          onClick={() => setActiveSection('account')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'account'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Mon compte</span>
        </button>

        <button
          onClick={() => setActiveSection('privacy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'privacy'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Confidentialité</span>
        </button>

        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'notifications'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveSection('appearance')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'appearance'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Apparence & Langue</span>
        </button>

        <button
          onClick={() => setActiveSection('help')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'help'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Assistance</span>
        </button>

        <button
          onClick={() => setActiveSection('export_apk')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'export_apk'
              ? 'bg-[#00E676] text-[#030604] shadow-md shadow-[#00E676]/20'
              : 'bg-[#0A100D] text-[#00E676] hover:text-white border border-[#00E676]/40'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Code Source & APK</span>
        </button>
      </div>

      {/* SECTION 1: MON COMPTE */}
      {activeSection === 'account' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Personal Info Form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#00E676]" />
                Informations Personnelles
              </h3>
              {saveSuccess && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#00E676]">
                  <Check className="w-3.5 h-3.5" /> Enregistré !
                </span>
              )}
            </div>

            <form onSubmit={handleSavePersonalInfo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8B5AE]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Pseudonyme unique (@)</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8B5AE]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8B5AE]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Téléphone</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8B5AE]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Biographie</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Pays de résidence</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Photo de profil (URL)</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676] truncate text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs transition shadow-md shadow-[#00E676]/20 active:scale-95"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          {/* Account Type (Fan / Creator) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A]">
            <h3 className="text-sm font-extrabold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              Type de Compte FanLink
            </h3>
            <p className="text-xs text-[#A8B5AE] mb-4">
              Choisissez votre rôle sur la plateforme. Les créateurs bénéficient des outils de monétisation (80/20) et de diffusion en direct.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => handleAccountTypeToggle('fan')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  userProfile?.accountType === 'fan'
                    ? 'bg-[#00E676]/15 border-[#00E676]'
                    : 'bg-[#030604] border-[#183A2A] hover:border-[#183A2A]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-white">Fan & Supporter</span>
                  {userProfile?.accountType === 'fan' && <Check className="w-4 h-4 text-[#00E676]" />}
                </div>
                <p className="text-[11px] text-[#A8B5AE] leading-relaxed">
                  Accès illimité aux contenus, aux directs, à la boutique FanCoins et aux interactions VIP.
                </p>
              </div>

              <div 
                onClick={() => handleAccountTypeToggle('creator')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  userProfile?.accountType === 'creator' || userProfile?.accountType === 'artist'
                    ? 'bg-[#00E676]/15 border-[#00E676]'
                    : 'bg-[#030604] border-[#183A2A] hover:border-[#183A2A]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-white">Star & Créateur</span>
                  {(userProfile?.accountType === 'creator' || userProfile?.accountType === 'artist') && (
                    <Check className="w-4 h-4 text-[#00E676]" />
                  )}
                </div>
                <p className="text-[11px] text-[#A8B5AE] leading-relaxed">
                  Monétisation de contenus, abonnements payants, cadeaux virtuels et éligibilité à la certification.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                Certification & Badge Officiel
              </h3>
              <p className="text-xs text-[#A8B5AE] mt-0.5">
                {userProfile?.isVerified 
                  ? 'Votre identité est officiellement vérifiée avec le badge bleu FanLink.' 
                  : 'Faites vérifier votre compte pour protéger votre identité et vos abonnés.'}
              </p>
            </div>

            {!userProfile?.isVerified ? (
              <button
                onClick={onOpenVerification}
                className="px-3.5 py-2 rounded-xl bg-[#030604] border border-[#00E676] text-[#00E676] font-bold text-xs hover:bg-[#00E676]/10 transition flex-shrink-0"
              >
                Demander
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-black text-xs border border-[#1877F2]/40 flex-shrink-0">
                Certifié
              </span>
            )}
          </div>

          {/* Password and Security */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00E676]" />
              Sécurité & Mot de passe
            </h3>

            <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white">Réinitialisation du mot de passe</p>
                <p className="text-[11px] text-[#A8B5AE]">
                  Un lien sécurisé sera envoyé à <span className="text-white font-mono">{email}</span>.
                </p>
              </div>
              <button
                onClick={handlePasswordReset}
                className="px-3.5 py-2 rounded-xl bg-[#183A2A] text-white hover:bg-[#183A2A]/80 font-bold text-xs transition flex-shrink-0"
              >
                {passwordResetSent ? 'Lien envoyé !' : 'Envoyer le lien'}
              </button>
            </div>

            {/* Connected Accounts */}
            <div>
              <p className="text-xs font-bold text-white mb-2">Comptes connectés</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030604] border border-[#183A2A]">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="text-xs text-white">Google</span>
                  </div>
                  <span className="text-[11px] text-[#00E676] font-bold">Connecté</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone: Logout and Delete Account */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-red-500/30 space-y-3">
            <h3 className="text-sm font-extrabold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Zone sensible
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={logout}
                className="flex-1 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Se déconnecter
              </button>

              <button
                onClick={() => setIsDeletingAccount(true)}
                className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer définitivement le compte
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: CONFIDENTIALITÉ & SÉCURITÉ */}
      {activeSection === 'privacy' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Account Visibility */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00E676]" />
              Visibilité et Accès au Profil
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
              <div>
                <p className="text-xs font-bold text-white">Compte privé</p>
                <p className="text-[11px] text-[#A8B5AE]">
                  Seuls les utilisateurs approuvés peuvent voir vos vidéos et vos stories.
                </p>
              </div>
              <button
                onClick={() => updateSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, isPrivateAccount: !prev.privacy.isPrivateAccount }
                }))}
                className={`w-11 h-6 rounded-full transition relative ${
                  settings.privacy.isPrivateAccount ? 'bg-[#00E676]' : 'bg-[#183A2A]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition transform ${
                  settings.privacy.isPrivateAccount ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
              <div>
                <p className="text-xs font-bold text-white">Statut en ligne visible</p>
                <p className="text-[11px] text-[#A8B5AE]">
                  Indique aux autres membres si vous êtes connecté sur FanLink.
                </p>
              </div>
              <button
                onClick={() => updateSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showOnlineStatus: !prev.privacy.showOnlineStatus }
                }))}
                className={`w-11 h-6 rounded-full transition relative ${
                  settings.privacy.showOnlineStatus ? 'bg-[#00E676]' : 'bg-[#183A2A]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition transform ${
                  settings.privacy.showOnlineStatus ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Direct Messages Policy */}
            <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
              <p className="text-xs font-bold text-white mb-1.5">Qui peut m'envoyer des messages ?</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['everyone', 'followers', 'none'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => updateSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, directMessagesPolicy: option }
                    }))}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition ${
                      settings.privacy.directMessagesPolicy === option
                        ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]'
                        : 'bg-[#0A100D] border-[#183A2A] text-[#A8B5AE]'
                    }`}
                  >
                    {option === 'everyone' ? 'Tout le monde' : option === 'followers' ? 'Abonnés' : 'Personne'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blocked Users Manager */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00E676]" />
              Utilisateurs Bloqués ({blockedUsersList.length})
            </h3>
            <p className="text-xs text-[#A8B5AE]">
              Les utilisateurs bloqués ne peuvent ni voir votre profil, ni interagir avec vos vidéos, ni vous envoyer de messages.
            </p>

            <form onSubmit={handleAddBlockedUser} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Pseudonyme à bloquer (ex: spammer123)..."
                value={newBlockedUsername}
                onChange={(e) => setNewBlockedUsername(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#183A2A] hover:bg-[#183A2A]/80 text-white font-bold transition"
              >
                Bloquer
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {blockedUsersList.length === 0 ? (
                <p className="text-[11px] text-[#A8B5AE] italic py-2">Aucun utilisateur bloqué.</p>
              ) : (
                blockedUsersList.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#030604] border border-[#183A2A]">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatarUrl} alt={u.displayName} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{u.displayName}</p>
                        <p className="text-[10px] text-[#A8B5AE]">@{u.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblockUser(u.id)}
                      className="px-3 py-1 rounded-lg bg-[#183A2A] hover:bg-[#183A2A]/80 text-xs font-bold text-white transition"
                    >
                      Débloquer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#00E676]" />
              Appareils & Sessions Connectées
            </h3>
            
            <div className="space-y-2">
              {settings.security.activeSessions.map(sess => (
                <div key={sess.id} className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{sess.device}</p>
                      {sess.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-[#00E676]/20 text-[#00E676] text-[9px] font-black">
                          Cet appareil
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A8B5AE] mt-0.5">{sess.browser} • {sess.ipLocation}</p>
                  </div>
                  <span className="text-[10px] text-[#A8B5AE]">{sess.lastActive}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00E676]" />
              Préférences des Notifications Push & E-mail
            </h3>
            <p className="text-xs text-[#A8B5AE] mb-3">
              Personnalisez les alertes que vous souhaitez recevoir sur votre téléphone et par e-mail.
            </p>

            {[
              {
                key: 'newFollowers',
                title: 'Nouveaux abonnés',
                desc: 'Recevoir une alerte quand quelqu\'un commence à vous suivre'
              },
              {
                key: 'likesAndComments',
                title: 'Mentions J\'aime et commentaires',
                desc: 'Alerte lorsqu\'un utilisateur aime ou commente vos publications'
              },
              {
                key: 'mentionsAndReplies',
                title: 'Réponses et mentions (@)',
                desc: 'Alerte lorsqu\'un utilisateur vous cite dans un message ou commentaire'
              },
              {
                key: 'directMessages',
                title: 'Messages privés',
                desc: 'Alerte de réception de nouveaux messages dans votre messagerie'
              },
              {
                key: 'liveBroadcasts',
                title: 'Directs des créateurs suivis',
                desc: 'Alerte instantanée dès qu\'une star que vous suivez démarre un live'
              },
              {
                key: 'securityAlerts',
                title: 'Alertes de sécurité',
                desc: 'Alerte immédiate en cas de nouvelle connexion sur un appareil inconnu'
              },
              {
                key: 'payoutsAndEarnings',
                title: 'Revenus et paiements',
                desc: 'Alerte lors de la réception de FanCoins, cadeaux et virements confirmés'
              }
            ].map(item => {
              const isEnabled = settings.notifications[item.key as keyof typeof settings.notifications];
              return (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
                  <div className="pr-3">
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p className="text-[11px] text-[#A8B5AE]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => updateSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [item.key]: !prev.notifications[item.key as keyof typeof prev.notifications]
                      }
                    }))}
                    className={`w-11 h-6 rounded-full transition relative flex-shrink-0 ${
                      isEnabled ? 'bg-[#00E676]' : 'bg-[#183A2A]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: APPARENCE & LANGUE */}
      {activeSection === 'appearance' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Theme selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#00E676]" />
              Thème Visuel
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => handleThemeToggle('dark')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  settings.appearance.theme === 'dark'
                    ? 'bg-[#00E676]/15 border-[#00E676]'
                    : 'bg-[#030604] border-[#183A2A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-[#00E676]" />
                  <div>
                    <p className="font-bold text-white">Mode Sombre</p>
                    <p className="text-[10px] text-[#A8B5AE]">Noir émeraude officiel</p>
                  </div>
                </div>
                {settings.appearance.theme === 'dark' && <Check className="w-4 h-4 text-[#00E676]" />}
              </div>

              <div
                onClick={() => handleThemeToggle('light')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  settings.appearance.theme === 'light'
                    ? 'bg-[#00E676]/15 border-[#00E676]'
                    : 'bg-[#030604] border-[#183A2A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-bold text-white">Mode Clair</p>
                    <p className="text-[10px] text-[#A8B5AE]">Contraste doux</p>
                  </div>
                </div>
                {settings.appearance.theme === 'light' && <Check className="w-4 h-4 text-[#00E676]" />}
              </div>
            </div>
          </div>

          {/* Language and Currency */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#00E676]" />
              Langue & Devise Locale
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Langue de l'application</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                >
                  <option value="fr">Français (Officiel)</option>
                  <option value="en">English (International)</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Devise d'affichage</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar US ($)</option>
                  <option value="XOF">Franc CFA (FCFA)</option>
                  <option value="GBP">Livre Sterling (£)</option>
                  <option value="ZAR">Rand Sud-Africain (R)</option>
                  <option value="KES">Shilling Kenyan (KSh)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media & Data Saver */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#00E676]" />
              Lecture Vidéo & Données Mobiles
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#030604] border border-[#183A2A]">
              <div>
                <p className="text-xs font-bold text-white">Économiseur de données mobiles</p>
                <p className="text-[11px] text-[#A8B5AE]">
                  Réduit la résolution vidéo pour économiser votre forfait Internet.
                </p>
              </div>
              <button
                onClick={() => updateSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, dataSaver: !prev.appearance.dataSaver }
                }))}
                className={`w-11 h-6 rounded-full transition relative ${
                  settings.appearance.dataSaver ? 'bg-[#00E676]' : 'bg-[#183A2A]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition transform ${
                  settings.appearance.dataSaver ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 5: ASSISTANCE & LÉGAL */}
      {activeSection === 'help' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Support Actions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-2">
            <h3 className="text-sm font-extrabold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00E676]" />
              Centre d'Assistance & Contact
            </h3>

            <button
              onClick={() => setReportModalOpen(true)}
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Signaler un problème technique ou un bogue</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8B5AE]" />
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#00E676]" />
                <span>Signaler un utilisateur, arnaque ou contenu inapproprié</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8B5AE]" />
            </button>

            <a
              href="mailto:support@fanlink.ai"
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00E676]" />
                <span>Contacter le support par e-mail (support@fanlink.ai)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#A8B5AE]" />
            </a>
          </div>

          {/* Legal Documents */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-2">
            <h3 className="text-sm font-extrabold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00E676]" />
              Documents Légaux & Règles de la Plateforme
            </h3>

            <button
              onClick={onOpenTerms}
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-between transition"
            >
              <span>Conditions Générales d'Utilisation (CGU)</span>
              <ChevronRight className="w-4 h-4 text-[#A8B5AE]" />
            </button>

            <button
              onClick={onOpenPrivacy}
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] hover:bg-[#183A2A]/40 text-xs font-bold text-white flex items-center justify-between transition"
            >
              <span>Politique de Confidentialité et Protection des Données</span>
              <ChevronRight className="w-4 h-4 text-[#A8B5AE]" />
            </button>
          </div>

          {/* App Version Card */}
          <div className="p-4 rounded-2xl bg-[#030604] border border-[#183A2A] text-center text-xs space-y-1">
            <p className="font-extrabold text-white">FanLink AI — Global Social Platform</p>
            <p className="text-[11px] text-[#A8B5AE]">Version 2.4.0 (Build 2026.10)</p>
            <p className="text-[10px] text-[#A8B5AE]">Tous droits réservés • Fans • Stars • Together 💚</p>
          </div>

        </div>
      )}

      {/* SECTION 6: EXPORT DU CODE SOURCE & APK ANDROID */}
      {activeSection === 'export_apk' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Architecture Verification Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#00E676]/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#00E676]/20 border border-[#00E676] text-[#00E676] text-[10px] font-black uppercase tracking-wider">
                Vérification d'Architecture
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-[#A8B5AE] text-[10px] font-bold">
                React 19 + Vite + PWA + Express
              </span>
            </div>

            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00E676]" />
              Application Web Full-Stack (Non Expo / Non React Native)
            </h3>

            <p className="text-xs text-[#A8B5AE] leading-relaxed">
              <strong className="text-white">Ce projet n'est pas une application Expo ou React Native.</strong> Il s'agit d'une <strong className="text-[#00E676]">Application Web Moderne Full-Stack (React 19, TypeScript, Tailwind CSS v4, PWA et serveur Express)</strong>.
            </p>
            <p className="text-xs text-[#A8B5AE] leading-relaxed">
              Cette architecture offre le meilleur des deux mondes : elle s'exécute avec fluidité sur le web et s'installe soit directement en <strong className="text-white">WebAPK</strong> sur Android, soit se compile en <strong className="text-[#00E676]">véritable fichier .APK Android autonome</strong> via <strong className="text-white">Capacitor</strong> ou <strong className="text-white">PWABuilder</strong> sans réécrire le code.
            </p>
          </div>

          {/* Download Source Code Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#00E676]" />
              Téléchargement du Code Source Complet
            </h3>

            <p className="text-xs text-[#A8B5AE] leading-relaxed">
              L'archive ZIP comprend l'intégralité du projet FanLink AI (composants, écrans, serveur Node.js, assets officiels, règles Firebase, documentation et fichier de configuration Android <code className="text-[#00E676] font-mono">capacitor.config.json</code>).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="/fanlink-ai-source.zip"
                download="fanlink-ai-source.zip"
                className="flex-1 p-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs flex items-center justify-center gap-3 transition shadow-lg shadow-[#00E676]/25"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-black text-xs uppercase tracking-wide">Télécharger l'Archive (.ZIP)</div>
                  <div className="text-[10px] font-semibold text-[#030604]/80">57 fichiers prêts pour Android & PC (2.8 Mo)</div>
                </div>
              </a>

              <a
                href="/api/download-source"
                download="fanlink-ai-source.zip"
                className="p-3.5 rounded-2xl bg-[#030604] hover:bg-[#183A2A] border border-[#183A2A] text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                title="Lien direct alternatif via le serveur"
              >
                <ExternalLink className="w-4 h-4 text-[#00E676]" />
                <span>Lien Alternatif API</span>
              </a>
            </div>
          </div>

          {/* Android Exploration Tutorial */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#00E676]" />
              Comment Ouvrir et Éditer le Code sur Téléphone Android
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00E676]/20 border border-[#00E676] text-[#00E676] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-white">Téléchargez le fichier sur Android</p>
                  <p className="text-[11px] text-[#A8B5AE]">
                    Appuyez sur le bouton vert ci-dessus. Le fichier <code className="text-[#00E676]">fanlink-ai-source.zip</code> se placera dans votre dossier <code className="text-white font-mono">Téléchargements</code> (Downloads).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00E676]/20 border border-[#00E676] text-[#00E676] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-white">Extraire l'archive ZIP</p>
                  <p className="text-[11px] text-[#A8B5AE]">
                    Ouvrez l'application <strong className="text-white">Files by Google</strong> (ou l'application gratuite <strong className="text-white">ZArchiver</strong> sur le Play Store), touchez l'archive et choisissez <strong className="text-white">Extraire</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00E676]/20 border border-[#00E676] text-[#00E676] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-white">Inspecter et modifier le code sur mobile</p>
                  <p className="text-[11px] text-[#A8B5AE]">
                    Installez l'application Android gratuite <strong className="text-[#00E676]">Acode - code editor</strong> ou <strong className="text-[#00E676]">Spck Code Editor</strong> sur le Google Play Store pour ouvrir le dossier, éditer vos composants et exécuter du code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Android APK Compilation Pathways */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A100D] border border-[#183A2A] space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#00E676]" />
              Méthodes pour Générer le Fichier APK Android (.apk)
            </h3>

            {/* Method 1: Capacitor */}
            <div className="p-3.5 rounded-xl bg-[#030604] border border-[#183A2A] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00E676]" />
                  Méthode 1 : Capacitor (APK Natif Hors-Ligne Recommandé)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00E676]/20 text-[#00E676] font-bold">
                  Configuré
                </span>
              </div>

              <p className="text-[11px] text-[#A8B5AE] leading-relaxed">
                Le fichier <code className="text-[#00E676] font-mono">capacitor.config.json</code> est déjà préconfiguré avec l'ID officiel <code className="text-white font-mono">ai.fanlink.app</code>.
              </p>

              <div className="p-3 rounded-lg bg-black/80 font-mono text-[11px] text-[#00E676] border border-[#183A2A] space-y-1 relative group">
                <p># 1. Compiler les assets web</p>
                <p className="text-white">npm run build</p>
                <p># 2. Ajouter la plateforme Android native</p>
                <p className="text-white">npm i @capacitor/core @capacitor/android</p>
                <p className="text-white">npx cap add android</p>
                <p># 3. Compiler le véritable fichier APK</p>
                <p className="text-white">cd android && ./gradlew assembleDebug</p>
                <p className="text-[#A8B5AE] pt-1">
                  → APK généré : <span className="text-white font-bold">android/app/build/outputs/apk/debug/app-debug.apk</span>
                </p>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('npm run build && npm i @capacitor/core @capacitor/android && npx cap add android && cd android && ./gradlew assembleDebug');
                    setCopiedCommand('cap');
                    setTimeout(() => setCopiedCommand(null), 2500);
                  }}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-[#183A2A] hover:bg-[#00E676] hover:text-[#030604] text-[#A8B5AE] text-[10px] font-bold flex items-center gap-1 transition"
                >
                  {copiedCommand === 'cap' ? <Check className="w-3 h-3 text-[#030604]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommand === 'cap' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>

            {/* Method 2: PWABuilder */}
            <div className="p-3.5 rounded-xl bg-[#030604] border border-[#183A2A] space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                Méthode 2 : PWABuilder (Création d'APK en ligne sans ordinateur)
              </span>
              <p className="text-[11px] text-[#A8B5AE] leading-relaxed">
                Le manifeste PWA de FanLink AI est prêt. Rendez-vous sur <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-[#00E676] underline">PWABuilder.com</a>, saisissez l'URL de l'application, et téléchargez directement le paquet APK / AAB généré pour Android.
              </p>
            </div>

            {/* Method 3: Direct WebAPK */}
            <div className="p-3.5 rounded-xl bg-[#030604] border border-[#183A2A] space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Méthode 3 : Installation Immédiate sur Android (WebAPK)
              </span>
              <p className="text-[11px] text-[#A8B5AE] leading-relaxed">
                Sur votre téléphone Android dans Google Chrome, appuyez sur le menu (3 points) puis <strong className="text-white">« Installer l'application »</strong>. Android crée instantanément un exécutable natif avec l'icône FanLink AI, notifications et affichage plein écran.
              </p>
            </div>

          </div>

          {/* Guide Documentation link */}
          <div className="p-4 rounded-2xl bg-[#030604] border border-[#183A2A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#00E676]" />
              <div>
                <p className="text-xs font-bold text-white">Guide Complet Documenté</p>
                <p className="text-[11px] text-[#A8B5AE]">Consultez <code className="text-[#00E676]">docs/ANDROID_APK_GUIDE.md</code> inclus dans l'archive</p>
              </div>
            </div>
            <a
              href="/fanlink-ai-source.zip"
              download="fanlink-ai-source.zip"
              className="px-3 py-1.5 rounded-xl bg-[#183A2A] hover:bg-[#00E676] hover:text-[#030604] text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger</span>
            </a>
          </div>

        </div>
      )}

      {/* REPORT ISSUE / USER MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 sm:p-6 shadow-2xl text-white">
            <h3 className="font-black text-sm text-white mb-1">Signaler un problème ou un contenu</h3>
            <p className="text-[11px] text-[#A8B5AE] mb-4">
              Notre équipe de sécurité et de modération traite les signalements 24/7.
            </p>

            {reportSubmitted ? (
              <div className="py-8 text-center">
                <Check className="w-12 h-12 text-[#00E676] mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Signalement transmis !</p>
                <p className="text-[11px] text-[#A8B5AE]">Merci pour votre aide à maintenir FanLink sécurisé.</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Motif</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                  >
                    <option value="bug">Bogue ou dysfonctionnement technique</option>
                    <option value="scam">Arnaque ou tentative de phishing</option>
                    <option value="harassment">Harcèlement ou propos haineux</option>
                    <option value="copyright">Violation de droits d'auteur</option>
                    <option value="other">Autre problème</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#A8B5AE] mb-1">Description détaillée</label>
                  <textarea
                    rows={4}
                    required
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Expliquez ce qui s'est produit avec le plus de précisions possible..."
                    className="w-full p-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#183A2A] text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00E676] text-[#030604] font-black"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ACCOUNT MODAL */}
      {isDeletingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-red-500/50 p-6 shadow-2xl text-white">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="font-black text-base text-white mb-1">Suppression définitive du compte</h3>
            <p className="text-xs text-[#A8B5AE] mb-4 leading-relaxed">
              Attention : Cette action est irréversible. Vos vidéos, vos FanCoins restants, vos abonnements et messages seront définitivement supprimés de nos serveurs.
            </p>

            <div className="space-y-3 text-xs mb-5">
              <label className="block font-semibold text-white">
                Tapez <strong className="text-red-400 font-mono">SUPPRIMER</strong> pour confirmer :
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full p-2.5 rounded-xl bg-[#030604] border border-red-500/40 text-red-400 font-bold focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsDeletingAccount(false); setDeleteConfirmationText(''); }}
                className="px-4 py-2 rounded-xl bg-[#183A2A] text-white font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== 'SUPPRIMER'}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white font-black transition"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
