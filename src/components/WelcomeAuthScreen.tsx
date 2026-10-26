import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  AtSign, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  Star,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountType } from '../types';
import { FanLinkLogo } from './FanLinkLogo';

export const WelcomeAuthScreen: React.FC = () => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    resetPassword, 
    continueAsGuest 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'reset'>('register');
  const [accountType, setAccountType] = useState<AccountType>('fan');

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet et votre pseudonyme.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await registerWithEmail(email, password, displayName.trim(), username.trim(), accountType);
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Cette adresse e-mail est déjà associée à un compte existant. Connectez-vous ci-dessous.');
        setActiveTab('login');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Le mot de passe est trop faible. Minimum 6 caractères.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Format d\'adresse e-mail invalide.');
      } else {
        setErrorMessage(err.message || 'Erreur lors de la création du compte. Vérifiez votre connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Veuillez renseigner votre e-mail et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithEmail(email.trim(), password);
    } catch (err: any) {
      console.error('Login failed:', err);
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential'
      ) {
        setErrorMessage('Adresse e-mail ou mot de passe incorrect.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Trop de tentatives infructueuses. Veuillez patienter un instant.');
      } else {
        setErrorMessage(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Veuillez entrer votre adresse e-mail.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible d\'envoyer l\'e-mail de réinitialisation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google sign-in warning:', err);
      setErrorMessage('La connexion Google n\'est pas disponible directement dans cette vue. Utilisez l\'e-mail et mot de passe ou le mode découverte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030604] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#00E676] selection:text-black">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#00E676]/15 via-[#00B86B]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-block hover:scale-105 transition-transform duration-300">
            <FanLinkLogo size="lg" showWordmark={true} showTagline={true} />
          </div>

          <h1 className="mt-4 text-xl sm:text-2xl font-black tracking-tight text-white">
            {activeTab === 'register' ? 'Rejoignez la communauté' :
             activeTab === 'login' ? 'Bon retour sur FanLink' :
             'Récupération de compte'}
          </h1>
          <p className="mt-1 text-xs text-[#A8B5AE] font-medium max-w-xs mx-auto">
            {activeTab === 'register' 
              ? 'Créez votre compte officiel en 30 secondes et recevez 150 FanCoins offerts !'
              : activeTab === 'login'
              ? 'Connectez-vous pour retrouver vos stars, vos messages et vos FanCoins.'
              : 'Entrez votre adresse e-mail pour réinitialiser votre mot de passe.'}
          </p>
        </div>

        {/* Tab Switcher (Register vs Login) */}
        {activeTab !== 'reset' && (
          <div className="grid grid-cols-2 p-1 bg-[#0A100D] border border-[#183A2A] rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#00E676] text-[#030604] shadow-lg shadow-[#00E676]/20'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Créer mon compte</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-[#00E676] text-[#030604] shadow-lg shadow-[#00E676]/20'
                  : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Se connecter</span>
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Card Body */}
        <div className="bg-[#0A100D]/90 border border-[#183A2A] rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          
          {resetSent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-[#00E676] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">E-mail envoyé avec succès !</h3>
              <p className="text-xs text-[#A8B5AE] mb-5">
                Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
              </p>
              <button
                type="button"
                onClick={() => { setResetSent(false); setActiveTab('login'); }}
                className="w-full py-2.5 rounded-xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition"
              >
                Retour à la connexion
              </button>
            </div>
          ) : activeTab === 'register' ? (
            
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Account Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#A8B5AE] mb-1.5 uppercase tracking-wider">
                  Je m'inscris en tant que :
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccountType('fan')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      accountType === 'fan'
                        ? 'bg-[#00E676]/15 border-[#00E676] text-white shadow-inner'
                        : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#183A2A]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-white">Fan & Supporter</span>
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-[#A8B5AE]">Lives, pronostics, stars & 150 FanCoins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('creator')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      accountType === 'creator'
                        ? 'bg-[#00E676]/15 border-[#00E676] text-white shadow-inner'
                        : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#183A2A]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-white">Star / Créateur</span>
                      <Star className="w-3.5 h-3.5 text-[#00E676]" />
                    </div>
                    <span className="text-[10px] text-[#A8B5AE]">Monétisation, badge & communauté</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Justin Chigwati"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                </div>
              </div>

              {/* Username (@) */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Pseudonyme unique</label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="justin_star"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white font-mono focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Mot de passe (min. 6 caractères)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B5AE] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00B86B] text-[#030604] font-black text-xs hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-[#00E676]/25 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création de votre compte en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Créer mon compte FanLink</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-[10px] text-[#A8B5AE]">
                  En créant un compte, vous recevez automatiquement <strong>150 FanCoins</strong> de bienvenue !
                </p>
              </div>

            </form>

          ) : activeTab === 'login' ? (

            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#A8B5AE]">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('reset'); setErrorMessage(null); }}
                    className="text-[11px] text-[#00E676] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B5AE] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00B86B] text-[#030604] font-black text-xs hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-[#00E676]/25 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Se connecter à mon compte</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

            </form>

          ) : (

            /* RESET PASSWORD FORM */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Votre adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/40 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition shadow-lg shadow-[#00E676]/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Envoyer le lien de réinitialisation</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                className="w-full text-center text-xs text-[#A8B5AE] hover:text-white pt-2"
              >
                Annuler et revenir à la connexion
              </button>
            </form>

          )}

          {/* Alternative Quick Options */}
          {activeTab !== 'reset' && (
            <div className="mt-5 pt-4 border-t border-[#183A2A]/80 space-y-2.5">
              
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#030604] hover:bg-[#121c16] border border-[#183A2A] text-xs font-bold flex items-center justify-center gap-2.5 transition text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              {/* Guest Discovery Mode */}
              <button
                type="button"
                onClick={continueAsGuest}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#183A2A]/40 border border-[#183A2A] text-xs font-medium text-[#A8B5AE] hover:text-white transition flex items-center justify-center gap-2"
              >
                <span>Explorer l'application sans compte (Mode Invité)</span>
              </button>

            </div>
          )}

        </div>

        {/* Footer Security Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#A8B5AE]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Sécurisé Firebase SSL</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Fans & Stars Réunis</span>
          </div>
        </div>

      </div>

    </div>
  );
};
