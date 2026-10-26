import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  CreditCard, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';
import { getApiUrl } from '../services/apiConfig';

interface WalletModalProps {
  onClose: () => void;
}

interface CoinPackage {
  id: string;
  coins: number;
  fiatEur: number;
  bonus?: string;
  popular?: boolean;
}

const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pkg_1', coins: 100, fiatEur: 2.00 },
  { id: 'pkg_2', coins: 300, fiatEur: 5.00, bonus: '+20 gratuits' },
  { id: 'pkg_3', coins: 700, fiatEur: 10.00, popular: true, bonus: '+100 gratuits' },
  { id: 'pkg_4', coins: 1800, fiatEur: 25.00, bonus: '+300 gratuits' }
];

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { userProfile, addCoins } = useAuth();
  const { formatCurrency, currency } = useCurrencyLang();

  const [selectedPkg, setSelectedPkg] = useState<CoinPackage>(COIN_PACKAGES[2]);
  const [selectedProvider, setSelectedProvider] = useState<string>('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successTx, setSuccessTx] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const idempotencyKey = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const res = await fetch(getApiUrl('/api/payments/deposit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          userId: userProfile?.id,
          amountFiat: selectedPkg.fiatEur,
          currency,
          provider: selectedProvider,
          coinPackage: selectedPkg
        })
      });

      const data = await res.json();
      if (data.success) {
        addCoins(selectedPkg.coins);
        setSuccessTx(data.transaction);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMsg(data.error || 'Erreur lors du paiement.');
      }
    } catch {
      setErrorMsg('Erreur réseau lors de la transaction sécurisée.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#0A100D] border border-[#183A2A] p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#183A2A] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Recharger en FanCoins</h3>
              <p className="text-[11px] text-[#A8B5AE]">Pour soutenir les créateurs, débloquer du contenu et envoyer des cadeaux</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#A8B5AE] hover:text-white hover:bg-[#183A2A]/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successTx ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#00E676]/20 text-[#00E676] flex items-center justify-center mx-auto mb-3 border border-[#00E676]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Recharge Réussie !</h4>
            <p className="text-xs text-[#A8B5AE] mb-4">
              +{selectedPkg.coins} FanCoins ont été crédités sur votre compte.
            </p>
            <div className="p-3 rounded-xl bg-[#030604] border border-[#183A2A] text-[11px] text-[#A8B5AE] font-mono mb-5 text-left">
              <p>Réf: {successTx.id}</p>
              <p>Montant: {formatCurrency(selectedPkg.fiatEur)} ({currency})</p>
              <p>Moyen: {selectedProvider}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-extrabold text-xs shadow-lg shadow-[#00E676]/25 transition"
            >
              Terminer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-5">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Choose Package */}
            <div>
              <label className="block text-xs font-bold text-white mb-2">
                1. Choisissez votre pack de FanCoins :
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {COIN_PACKAGES.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`relative p-3.5 rounded-2xl border text-center cursor-pointer transition ${
                      selectedPkg.id === pkg.id
                        ? 'bg-amber-500/15 border-amber-400 shadow-md'
                        : 'bg-[#030604] border-[#183A2A] hover:border-[#00E676]/50'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase">
                        Populaire
                      </span>
                    )}
                    <h4 className="text-base font-extrabold text-amber-300">{pkg.coins} Coins</h4>
                    <p className="text-xs font-bold text-white mt-1">{formatCurrency(pkg.fiatEur)}</p>
                    {pkg.bonus && (
                      <span className="text-[10px] text-[#00E676] font-semibold">{pkg.bonus}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Choose Payment Method */}
            <div>
              <label className="block text-xs font-bold text-white mb-2">
                2. Moyen de paiement sécurisé :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                <button
                  type="button"
                  onClick={() => setSelectedProvider('orange_money')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'orange_money' ? 'bg-orange-500/20 border-orange-400 text-orange-200' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="font-bold text-white">Orange Money</p>
                    <p className="text-[10px] text-[#A8B5AE]">CI, SN, CM, ML, BF</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('mtn_momo')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'mtn_momo' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="font-bold text-white">MTN Mobile Money</p>
                    <p className="text-[10px] text-[#A8B5AE]">GH, UG, RW, CM, ZA</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('airtel_money')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'airtel_money' ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="font-bold text-white">Airtel Money</p>
                    <p className="text-[10px] text-[#A8B5AE]">KE, TZ, CD, MG</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('mpesa')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'mpesa' ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#00E676]" />
                  <div>
                    <p className="font-bold text-white">Vodacom M-Pesa</p>
                    <p className="text-[10px] text-[#A8B5AE]">KE, TZ, MZ, CD</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('card')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'card' ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#00E676]" />
                  <div>
                    <p className="font-bold text-white">Carte Visa / Mastercard</p>
                    <p className="text-[10px] text-[#A8B5AE]">International</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('paypal')}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                    selectedProvider === 'paypal' ? 'bg-blue-500/20 border-blue-400 text-blue-200' : 'bg-[#030604] border-[#183A2A] text-[#A8B5AE] hover:border-[#00E676]/40'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-bold text-white">PayPal</p>
                    <p className="text-[10px] text-[#A8B5AE]">EUR, USD, GBP</p>
                  </div>
                </button>

              </div>
            </div>

            {selectedProvider !== 'paypal' && selectedProvider !== 'card' && (
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">
                  Numéro de téléphone Mobile Money :
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+225 07 00 00 00 ou +254 700 000..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] font-mono"
                />
              </div>
            )}

            {selectedProvider === 'card' && (
              <div>
                <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">
                  Numéro de carte bancaire :
                </label>
                <input
                  type="text"
                  required
                  placeholder="4532 •••• •••• 8821"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white focus:outline-none focus:border-[#00E676] font-mono"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-[#A8B5AE] bg-[#030604] p-2.5 rounded-xl border border-[#183A2A]">
              <ShieldCheck className="w-4 h-4 text-[#00E676] flex-shrink-0" />
              <span>Chiffrement TLS 256-bit & Protection anti-double dépense active.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#34FF96] text-black font-black text-xs shadow-xl shadow-[#00E676]/25 flex items-center justify-center gap-2 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validation bancaire en cours...</span>
                </>
              ) : (
                <span>Confirmer et payer {formatCurrency(selectedPkg.fiatEur)}</span>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
