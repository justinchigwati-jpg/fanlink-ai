import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface TermsPrivacyModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-zinc-100 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'terms' ? (
              <FileText className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="font-extrabold text-base text-zinc-100">
              {type === 'terms' ? 'Conditions Générales d\'Utilisation (CGU)' : 'Politique de Confidentialité & Protection des Données'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed pr-2">
          
          {type === 'terms' ? (
            <>
              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">1. Objet de la Plateforme</h4>
                <p>
                  FanLink AI est une plateforme sociale internationale mettant en relation des fans, artistes, sportifs et créateurs de contenu. L'accès et l'utilisation de nos services impliquent l'acceptation pleine et entière des présentes conditions.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">2. Modèle Économique & Rémunération Créateur</h4>
                <p>
                  Conformément à nos engagements de transparence, FanLink AI applique une commission fixe de 20% sur les revenus générés par les créateurs (cadeaux virtuels, abonnements VIP et messages payants), laissant 80% net au créateur sous réserve des frais de transaction des passerelles bancaires locales.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">3. Badges Officiels & Vérification</h4>
                <p>
                  Le badge officiel Star Vérifiée n'est jamais automatique. Il exige la présentation de pièces d'identité authentiques et la validation explicite par notre équipe de modération. Toute usurpation entraîne la fermeture immédiate du compte.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">4. Protection des Mineurs & Contenus Prohibés</h4>
                <p>
                  FanLink AI interdit formellement les contenus haineux, violents, pornographiques ou préjudiciables aux mineurs. Des filtres automatisés et une équipe de modération humaine 24/7 examinent tous les signalements.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">1. Données Collectées & Minimisation</h4>
                <p>
                  FanLink AI applique le principe de minimisation des données (RGPD / CCPA). Nous ne collectons que les informations strictement nécessaires au fonctionnement de l'application : identifiants d'authentification Firebase, adresse e-mail, pseudonyme et préférences d'affichage.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">2. Sécurité des Données Financières</h4>
                <p>
                  Aucune coordonnée bancaire sensible n'est enregistrée sur nos serveurs. Les transactions transitent exclusivement via des prestataires certifiés PCI-DSS (Orange Money, MTN MoMo, Airtel, M-Pesa, Stripe et PayPal) à l'aide de jetons chiffrés.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">3. Utilisation de l'Intelligence Artificielle</h4>
                <p>
                  Les fonctionnalités d'assistance créative sont traitées côté serveur via des instances sécurisées de Google Gemini. Aucune donnée personnelle d'utilisateur n'est vendue à des tiers ou réutilisée pour entraîner des modèles publics non sollicités.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-emerald-400 mb-1">4. Droits des Utilisateurs</h4>
                <p>
                  Vous disposez d'un droit d'accès, de rectification et de suppression totale de votre compte et de vos données personnelles à tout moment depuis votre page Profil.
                </p>
              </section>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
          >
            J'ai compris
          </button>
        </div>

      </div>
    </div>
  );
};
