import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AtSign, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountType } from '../types';
import { FanLinkLogo } from './FanLinkLogo';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('fan');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onClose();
      } else if (mode === 'register') {
        if (!displayName || !username) {
          setErrorMessage('Veuillez renseigner votre nom et votre pseudonyme.');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName, username, accountType);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Adresse e-mail ou mot de passe incorrect.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Cette adresse e-mail est déjà associée à un compte.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      } else {
        setErrorMessage(err.message || 'Une erreur est survenue lors de l\'authentification.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la connexion Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-[#183A2A] p-6 sm:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#183A2A] mb-5">
          <div className="flex items-center gap-2.5">
            <FanLinkLogo size="md" showWordmark={false} />
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {mode === 'login' ? 'Connexion FanLink AI' :
                 mode === 'register' ? 'Créer un Compte' : 'Réinitialiser le mot de passe'}
              </h3>
              <p className="text-[10px] text-[#A8B5AE] font-medium">Fans • Stars • Together</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#A8B5AE] hover:text-white hover:bg-[#183A2A] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {resetSent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-[#00E676] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">E-mail de récupération envoyé !</h4>
            <p className="text-xs text-[#A8B5AE] mb-5">
              Consultez votre boîte de réception pour réinitialiser votre mot de passe en toute sécurité.
            </p>
            <button
              onClick={() => { setResetSent(false); setMode('login'); }}
              className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition shadow-lg shadow-[#00E676]/20"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Google Fast Auth */}
            {mode !== 'reset' && (
              <>
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

                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-[#183A2A]"></div>
                  <span className="px-3 text-[10px] text-[#A8B5AE] uppercase tracking-widest font-mono">ou avec e-mail</span>
                  <div className="flex-1 border-t border-[#183A2A]"></div>
                </div>
              </>
            )}

            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1.5">
                    Type de compte
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAccountType('fan')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        accountType === 'fan'
                          ? 'bg-[#00E676]/15 border-[#00E676] text-[#00E676] font-bold'
                          : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE]'
                      }`}
                    >
                      Fan & Supporter
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('creator')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        accountType === 'creator'
                          ? 'bg-[#00E676]/15 border-[#00E676] text-[#00E676] font-bold'
                          : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE]'
                      }`}
                    >
                      Star / Créateur
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Pseudonyme unique (@)</label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="jean_star99"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] font-mono placeholder:text-[#A8B5AE]/50"
                    />
                  </div>
                </div>
              </>
            )}

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] placeholder:text-[#A8B5AE]/50"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#A8B5AE]">Mot de passe</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] text-[#00E676] hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AE]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] font-mono placeholder:text-[#A8B5AE]/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs shadow-lg shadow-[#00E676]/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>
                  {mode === 'login' ? 'Se connecter' :
                   mode === 'register' ? 'Créer mon compte' : 'Envoyer le lien'}
                </span>
              )}
            </button>

            {/* Toggle Modes */}
            <div className="text-center pt-2 text-xs text-[#A8B5AE]">
              {mode === 'login' ? (
                <p>
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-[#00E676] font-bold hover:underline"
                  >
                    Inscrivez-vous gratuitement
                  </button>
                </p>
              ) : (
                <p>
                  Déjà membre ?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#00E676] font-bold hover:underline"
                  >
                    Connectez-vous
                  </button>
                </p>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
