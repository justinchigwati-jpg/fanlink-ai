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
  CheckCircle2,
  Phone,
  MessageSquare,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountType } from '../types';
import { FanLinkLogo } from './FanLinkLogo';

const COUNTRY_PREFIXES = [
  { code: '+243', country: 'RD Congo', flag: '🇨🇩' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+242', country: 'Congo-Brazzaville', flag: '🇨🇬' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
];

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    loginOrRegisterWithPhone, 
    resetPassword, 
    loginAsGuest 
  } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('register');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('fan');

  // Phone form
  const [countryCode, setCountryCode] = useState('+243');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [otpCode, setOtpCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
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

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 6) {
      setErrorMessage('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    if (mode === 'register' && (!displayName.trim() || !username.trim())) {
      setErrorMessage('Veuillez renseigner votre nom et votre pseudonyme.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setOtpStep('input_otp');
      setInfoMessage(`Code SMS envoyé au ${countryCode} ${phoneNumber}. (Test rapide : entrez 123456 ou votre code reçu)`);
    }, 700);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMessage('Veuillez saisir le code reçu par SMS.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const fullPhone = `${countryCode}${phoneNumber.replace(/[^0-9]/g, '')}`;
    try {
      await loginOrRegisterWithPhone(fullPhone, displayName.trim(), username.trim(), accountType);
      onClose();
    } catch (err: any) {
      console.error('Phone verification error:', err);
      setErrorMessage(err.message || 'Erreur lors de la validation du code.');
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
      setErrorMessage('Sur Android, Google bloque les fenêtres pop-up. Veuillez utiliser votre e-mail ou téléphone ci-dessus.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#183A2A] mb-4">
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

        {/* Mode Selector */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 p-1 bg-[#030604] border border-[#183A2A] rounded-2xl mb-3">
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(null); setInfoMessage(null); setOtpStep('input_phone'); }}
              className={`py-2 rounded-xl text-xs font-black transition ${
                mode === 'register' ? 'bg-[#00E676] text-[#030604]' : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              Créer mon compte
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(null); setInfoMessage(null); setOtpStep('input_phone'); }}
              className={`py-2 rounded-xl text-xs font-black transition ${
                mode === 'login' ? 'bg-[#00E676] text-[#030604]' : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              Se connecter
            </button>
          </div>
        )}

        {/* Method Selector (Email vs Phone) */}
        {mode !== 'reset' && (
          <div className="flex items-center justify-center gap-2 mb-4 p-1 bg-[#030604] border border-[#183A2A] rounded-xl text-xs">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setErrorMessage(null); setInfoMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                authMethod === 'email' ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30' : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); setErrorMessage(null); setInfoMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                authMethod === 'phone' ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30' : 'text-[#A8B5AE] hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Téléphone (SMS)</span>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 text-xs text-[#00E676] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{infoMessage}</span>
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
              onClick={() => { setResetSent(false); setMode('login'); setAuthMethod('email'); }}
              className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition shadow-lg shadow-[#00E676]/20"
            >
              Retour à la connexion
            </button>
          </div>
        ) : authMethod === 'phone' ? (
          
          /* PHONE FORM */
          <div className="space-y-3.5">
            {mode === 'register' && otpStep === 'input_phone' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Justin Chigwati"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Pseudonyme unique (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="justin_fan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white font-mono focus:outline-none focus:border-[#00E676]"
                  />
                </div>
              </>
            )}

            {otpStep === 'input_phone' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Numéro de téléphone portable</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-32 py-2 px-1.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white"
                    >
                      {COUNTRY_PREFIXES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0A100D]">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ex: 081 234 5678"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00B86B] text-[#030604] font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  <span>Envoyer le code SMS</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Code secret SMS reçu</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-sm text-center tracking-widest text-white font-mono focus:outline-none focus:border-[#00E676]"
                  />
                  <p className="text-[10px] text-[#A8B5AE] text-center mt-1">Code test rapide : <strong>123456</strong></p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#00E676] text-[#030604] font-black text-xs hover:bg-[#00B86B] transition flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Valider et entrer sur FanLink</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* EMAIL FORM */
          <form onSubmit={handleSubmitEmail} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Pseudonyme (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jean_star"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white font-mono focus:outline-none focus:border-[#00E676]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Adresse e-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676]"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00B86B] text-[#030604] font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : 'Réinitialiser'}</span>
            </button>
          </form>
        )}

        {/* Alternative Google Sign In */}
        <div className="mt-4 pt-3 border-t border-[#183A2A]/80">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2 rounded-xl bg-[#030604] hover:bg-[#121c16] border border-[#183A2A] text-xs font-bold flex items-center justify-center gap-2 transition text-white"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuer avec Google</span>
          </button>
        </div>

      </div>
    </div>
  );
};
