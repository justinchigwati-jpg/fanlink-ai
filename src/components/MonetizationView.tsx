import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Gift, 
  Crown, 
  MessageSquare, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Smartphone,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';

interface MonetizationViewProps {
  onRequestVerification: () => void;
}

export const MonetizationView: React.FC<MonetizationViewProps> = ({ onRequestVerification }) => {
  const { userProfile, updateProfileData } = useAuth();
  const { formatCurrency, currency } = useCurrencyLang();

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100');
  const [payoutMethod, setPayoutMethod] = useState('orange_money');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  const availableBalanceEur = userProfile?.creatorEarningsEur || 1450.00;
  const pendingBalanceEur = userProfile?.pendingEarningsEur || 320.00;

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    setPayoutStatus('processing');

    const amountNum = parseFloat(payoutAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutError('Veuillez entrer un montant valide.');
      setPayoutStatus(null);
      return;
    }

    if (amountNum > availableBalanceEur) {
      setPayoutError('Le montant demandé dépasse votre solde disponible.');
      setPayoutStatus(null);
      return;
    }

    try {
      const res = await fetch('/api/payments/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: userProfile?.id,
          amountEur: amountNum,
          payoutMethod,
          destinationAccount,
          isVerified: userProfile?.isVerified || false
        })
      });

      const data = await res.json();
      if (data.success) {
        setPayoutStatus('success');
        updateProfileData({
          creatorEarningsEur: Math.max(0, availableBalanceEur - amountNum),
          pendingEarningsEur: pendingBalanceEur + data.netCreatorAmount
        });
      } else {
        setPayoutError(data.error || 'Erreur lors du traitement de la demande.');
        setPayoutStatus(null);
      }
    } catch {
      setPayoutError('Erreur réseau lors de la communication avec le serveur.');
      setPayoutStatus(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pb-28 pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" /> Tableau de Bord Monétisation
          </h2>
          <p className="text-xs text-zinc-400">
            Rémunération transparente basée sur les transactions réelles : 80% créateur / 20% plateforme.
          </p>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition self-start"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Demander un virement</span>
        </button>
      </div>

      {/* KYC Notice if account not verified */}
      {!userProfile?.isVerified && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-300 mb-1">
              Vérification de compte requise pour les retraits
            </p>
            <p className="text-amber-200/80 leading-relaxed mb-2">
              Conformément à la réglementation financière internationale contre le blanchiment d'argent (AML/KYC), les créateurs doivent posséder un compte vérifié pour effectuer des retraits de fonds.
            </p>
            <button
              onClick={onRequestVerification}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition"
            >
              Faire vérifier mon compte
            </button>
          </div>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        
        {/* Available Balance */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Solde Disponible</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-emerald-400">
            {formatCurrency(availableBalanceEur)}
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1">Prêt pour transfert immédiat</p>
        </div>

        {/* Pending Clearance */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>En attente de compensation</span>
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-amber-300">
            {formatCurrency(pendingBalanceEur)}
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1">Délai bancaire : 48h</p>
        </div>

        {/* 80/20 Platform Split */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Partage des Revenus</span>
            <span className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">80% / 20%</h3>
          <p className="text-[11px] text-zinc-400 mt-1">80% au créateur net de plateforme</p>
        </div>

      </div>

      {/* Revenue Breakdown by Source */}
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 mb-6 shadow-xl">
        <h3 className="font-bold text-sm text-zinc-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Répartition des Sources de Revenus
        </h3>

        <div className="space-y-4">
          
          {/* Virtual Gifts */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Gift className="w-3.5 h-3.5 text-amber-400" /> Cadeaux Virtuels en Live (55%)
              </span>
              <span className="text-emerald-400 font-bold">{formatCurrency(availableBalanceEur * 0.55)}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '55%' }} />
            </div>
          </div>

          {/* VIP Subscriptions */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Crown className="w-3.5 h-3.5 text-emerald-400" /> Abonnements VIP Récurrents (30%)
              </span>
              <span className="text-emerald-400 font-bold">{formatCurrency(availableBalanceEur * 0.30)}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Paid Exclusive Messages */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Messages Payants & Audios Exclusifs (15%)
              </span>
              <span className="text-emerald-400 font-bold">{formatCurrency(availableBalanceEur * 0.15)}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" /> Demande de Retrait
              </h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            {payoutStatus === 'success' ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-zinc-100 mb-1">Demande enregistrée !</h4>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                  Votre demande de virement a été transmise au service financier. Vous recevrez les fonds sous 2 à 3 jours ouvrés.
                </p>
                <button
                  onClick={() => {
                    setShowPayoutModal(false);
                    setPayoutStatus(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                
                {payoutError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
                    {payoutError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Montant du retrait (EUR) — Min 50 €
                  </label>
                  <input
                    type="number"
                    min="50"
                    max={availableBalanceEur}
                    step="10"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Solde disponible : {formatCurrency(availableBalanceEur)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mode de versement local
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="orange_money">Orange Money (Afrique de l'Ouest / Centrale)</option>
                    <option value="mtn_momo">MTN Mobile Money (Afrique)</option>
                    <option value="airtel_money">Airtel Money (Afrique de l'Est / Centrale)</option>
                    <option value="mpesa">Vodacom M-Pesa (Kenya, Tanzanie, RDC)</option>
                    <option value="bank_transfer">Virement Bancaire SEPA / SWIFT International</option>
                    <option value="paypal">PayPal International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Numéro de compte / Téléphone Mobile Money / IBAN
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                    placeholder="+225 07..., +221 77... ou FR76 3000..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs"
                  >
                    Valider le retrait
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
