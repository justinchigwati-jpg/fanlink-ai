import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Hash, 
  Lightbulb, 
  Globe2, 
  BarChart2, 
  Copy, 
  Check, 
  Loader2, 
  Send,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../services/apiConfig';

interface AIStudioPanelProps {
  onClose: () => void;
}

export const AIStudioPanel: React.FC<AIStudioPanelProps> = ({ onClose }) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'caption' | 'hashtags' | 'ideas' | 'translate' | 'discover'>('caption');
  
  const [promptInput, setPromptInput] = useState('');
  const [niche, setNiche] = useState(userProfile?.accountType === 'artist' ? 'Musique' : 'Général');
  const [tone, setTone] = useState('enthousiaste et moderne');
  const [targetLang, setTargetLang] = useState('anglais');

  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAiResult(null);

    try {
      if (activeTab === 'discover') {
        const res = await fetch(getApiUrl('/api/ai/match-creators'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interests: promptInput ? promptInput.split(',') : ['musique', 'sport', 'art'],
            userCountry: userProfile?.country || 'International'
          })
        });
        const data = await res.json();
        setAiResult(data.recommendation || 'Explorez les catégories Musique et Sport en tête de liste !');
      } else {
        const res = await fetch(getApiUrl('/api/ai/creator-assistant'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: activeTab,
            prompt: promptInput,
            niche,
            tone,
            targetLang
          })
        });
        const data = await res.json();
        if (data.success && data.output) {
          setAiResult(data.output);
        } else {
          setErrorMsg(data.error || 'Erreur lors de la génération IA.');
        }
      }
    } catch {
      setErrorMsg('Erreur de connexion au serveur FanLink AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!aiResult) return;
    try {
      await navigator.clipboard.writeText(aiResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#183A2A] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center border border-[#00E676]/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">FanLink AI Studio</h3>
                <span className="px-1.5 py-0.5 rounded bg-[#00E676]/20 text-[#00E676] text-[10px] font-black border border-[#00E676]/40">
                  GEMINI 3.8 FLASH
                </span>
              </div>
              <p className="text-[11px] text-[#A8B5AE]">Assistant créatif et multilingue pour créateurs et fans</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#A8B5AE] hover:text-white hover:bg-[#183A2A] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => { setActiveTab('caption'); setAiResult(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'caption' ? 'bg-[#00E676] text-[#030604] font-bold' : 'bg-[#030604] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Légendes
          </button>

          <button
            onClick={() => { setActiveTab('hashtags'); setAiResult(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'hashtags' ? 'bg-[#00E676] text-[#030604] font-bold' : 'bg-[#030604] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
            }`}
          >
            <Hash className="w-3.5 h-3.5" /> Hashtags Viraux
          </button>

          <button
            onClick={() => { setActiveTab('ideas'); setAiResult(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'ideas' ? 'bg-[#00E676] text-[#030604] font-bold' : 'bg-[#030604] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Idées de Contenu
          </button>

          <button
            onClick={() => { setActiveTab('translate'); setAiResult(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'translate' ? 'bg-[#00E676] text-[#030604] font-bold' : 'bg-[#030604] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" /> Traduction
          </button>

          <button
            onClick={() => { setActiveTab('discover'); setAiResult(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'discover' ? 'bg-[#00E676] text-[#030604] font-bold' : 'bg-[#030604] text-[#A8B5AE] hover:text-white border border-[#183A2A]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Découverte
          </button>
        </div>

        {/* Dynamic Inputs depending on Tab */}
        <div className="space-y-3 mb-4">
          
          {activeTab === 'caption' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Domaine / Niche :</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                >
                  <option value="Musique & Concerts">Musique & Concerts</option>
                  <option value="Sport & Athlétisme">Sport & Athlétisme</option>
                  <option value="Cinéma & Backstage">Cinéma & Backstage</option>
                  <option value="Gaming & E-Sport">Gaming & E-Sport</option>
                  <option value="Mode & Lifestyle">Mode & Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#A8B5AE] mb-1">Ton éditorial :</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
                >
                  <option value="enthousiaste et chaleureux">Enthousiaste & Chaleureux</option>
                  <option value="mystérieux avec teaser">Mystérieux (Teaser exclusif)</option>
                  <option value="professionnel et inspirant">Inspirant & Professionnel</option>
                  <option value="direct et convivial">Direct & Convivial</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="text-xs">
              <label className="block font-semibold text-[#A8B5AE] mb-1">Langue cible :</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#030604] border border-[#183A2A] text-white focus:outline-none focus:border-[#00E676]"
              >
                <option value="anglais">Anglais (International)</option>
                <option value="espagnol">Espagnol</option>
                <option value="portugais">Portugais</option>
                <option value="swahili">Swahili</option>
                <option value="arabe">Arabe</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#A8B5AE] mb-1">
              {activeTab === 'caption' ? 'De quoi parle votre publication ?' :
               activeTab === 'hashtags' ? 'Mots-clés ou thème de votre post :' :
               activeTab === 'ideas' ? 'Précisez votre niche ou objectif d\'engagement :' :
               activeTab === 'translate' ? 'Texte à traduire pour vos fans internationaux :' :
               'Vos centres d\'intérêt (ex: rap ivoirien, football sénégalais, art 3D) :'}
            </label>
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={
                activeTab === 'caption' ? 'ex: Sortie de mon nouveau clip vidéo vendredi soir à Abidjan' :
                activeTab === 'hashtags' ? 'ex: Afrobeat, album studio, tournée africaine' :
                activeTab === 'ideas' ? 'ex: Stimuler les abonnements VIP et les cadeaux en live' :
                activeTab === 'translate' ? 'Collez votre publication ici...' :
                'ex: Football, musique afro, streaming gaming'
              }
              className="w-full p-3 rounded-xl bg-[#030604] border border-[#183A2A] text-xs text-white placeholder-[#A8B5AE]/50 focus:outline-none focus:border-[#00E676] leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00B86B] text-[#030604] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00E676]/20 transition active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération par FanLink AI en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Générer avec FanLink AI</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* AI Output Display */}
        {aiResult && (
          <div className="p-4 rounded-2xl bg-[#030604] border border-[#00E676]/40 relative animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#00E676] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Résultat généré par FanLink AI
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-[#0A100D] hover:bg-[#183A2A] text-[#A8B5AE] hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-[#183A2A] transition"
              >
                {copied ? <Check className="w-3 h-3 text-[#00E676]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            <p className="text-xs text-white leading-relaxed whitespace-pre-line font-normal">
              {aiResult}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
