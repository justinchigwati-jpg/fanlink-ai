import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VerificationRequest } from '../types';

interface VerificationModalProps {
  onClose: () => void;
  onSubmit: (request: Partial<VerificationRequest>) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSubmit }) => {
  const { userProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [stageName, setStageName] = useState(userProfile?.displayName || '');
  const [category, setCategory] = useState('Musique');
  const [country, setCountry] = useState(userProfile?.country || 'France');
  const [socialProof, setSocialProof] = useState('');
  const [documentType, setDocumentType] = useState('Passeport international / Carte d\'identité');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !stageName || !socialProof) return;

    onSubmit({
      fullName,
      stageName,
      category,
      country,
      socialProof,
      documentType,
      status: 'pending'
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">Demande de Badge Vérifié</h3>
              <p className="text-[11px] text-zinc-400">Pour artistes, sportifs, créateurs et personnalités publiques</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-zinc-100 mb-2">Demande reçue avec succès !</h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
              Votre dossier a été transmis au comité de modération FanLink AI. Le badge officiel n'est jamais attribué automatiquement : un administrateur vérifiera vos justificatifs sous 48 à 72 heures ouvrées.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Notice regarding strict rules */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Règle de sécurité :</strong> Le badge officiel FanLink AI requiert une vérification d'identité réelle et une notoriété avérée. Les déclarations frauduleuses entraînent la suspension immédiate du compte.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom légal complet</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Jean-Marc Kouassi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom de scène / Marque</label>
                <input
                  type="text"
                  required
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  placeholder="ex: Kémi AfroPulse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Musique">Musique & Chant</option>
                  <option value="Sport">Sport & Athlétisme</option>
                  <option value="Cinéma">Cinéma & Télévision</option>
                  <option value="Influence">Influence & Lifestyle</option>
                  <option value="Gaming">Gaming & E-Sport</option>
                  <option value="Art">Art & Design Digital</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Pays de résidence</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Type de justificatif d'identité</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Passeport international">Passeport international</option>
                  <option value="Carte nationale d'identité">Carte nationale d'identité</option>
                  <option value="Permis de conduire">Permis de conduire officiel</option>
                  <option value="KBIS / Registre du commerce">Registre officiel / Contrat d'artiste</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Liens de notoriété et preuves publiques
              </label>
              <textarea
                rows={3}
                required
                value={socialProof}
                onChange={(e) => setSocialProof(e.target.value)}
                placeholder="Liens vers Spotify, YouTube, Instagram vérifié, articles de presse, palmarès sportif..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Soumettre le dossier
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
