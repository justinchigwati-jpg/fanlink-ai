import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Radio, 
  Clock, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  ChevronRight, 
  Activity,
  Bot,
  Zap,
  Star,
  Users,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FootballMatch, PredictionEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCurrencyLang } from '../context/CurrencyLangContext';

interface MatchCenterViewProps {
  onOpenLiveRoom: (matchTitle: string) => void;
  onOpenWallet: () => void;
}

export const SEED_MATCHES: FootballMatch[] = [
  {
    id: 'match_ucl_01',
    league: 'UEFA Champions League • Quart de finale',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    awayLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    matchTime: 'Ce soir • 21:00',
    status: 'live',
    homeScore: 2,
    awayScore: 2,
    currentMinute: "74'",
    aiPrediction: 'Match ultra-offensif : avantage Real Madrid en contre-attaque rapide via Vinicius Jr. Probabilité de prolongation élevée.',
    aiProbabilityHome: 42,
    aiProbabilityDraw: 26,
    aiProbabilityAway: 32,
    totalPredictions: 4820
  },
  {
    id: 'match_ucl_02',
    league: 'UEFA Champions League • Quart de finale',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Bayern Munich',
    homeLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&auto=format&fit=crop&q=80',
    awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=120&auto=format&fit=crop&q=80',
    matchTime: 'Demain • 21:00',
    status: 'upcoming',
    aiPrediction: 'Duel au sommet au Parc des Princes. Le PSG capitalise sur sa vitesse en transition, mais la rigueur du Bayern impose un rythme élevé.',
    aiProbabilityHome: 38,
    aiProbabilityDraw: 30,
    aiProbabilityAway: 32,
    totalPredictions: 3150
  },
  {
    id: 'match_can_03',
    league: 'Coupe d\'Afrique des Nations • Choc Continental',
    homeTeam: 'RD Congo 🇨🇩',
    awayTeam: 'Côte d\'Ivoire 🇨🇮',
    homeLogo: 'https://images.unsplash.com/photo-1489944445337-617868955864?w=120&auto=format&fit=crop&q=80',
    awayLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
    matchTime: 'Dimanche • 20:00',
    status: 'upcoming',
    aiPrediction: 'Solidité défensive des Léopards face au collectif des Éléphants. Les coups de pied arrêtés feront la différence décisive.',
    aiProbabilityHome: 35,
    aiProbabilityDraw: 35,
    aiProbabilityAway: 30,
    totalPredictions: 5920
  },
  {
    id: 'match_pl_04',
    league: 'Premier League Anglaise • Choc du Dimanche',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    awayLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    matchTime: 'Dimanche • 17:30',
    status: 'upcoming',
    aiPrediction: 'Arsenal domine territorialement à l\'Emirates Stadium. Chelsea reste menaçant sur les transitions rapides d\'aile.',
    aiProbabilityHome: 52,
    aiProbabilityDraw: 26,
    aiProbabilityAway: 22,
    totalPredictions: 2410
  }
];

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Karim PronoStar', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', points: 4320, accuracy: '86%', badge: '👑 Grand Maître' },
  { rank: 2, name: 'Aïcha SportRDC', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', points: 3890, accuracy: '81%', badge: '⭐ Élite' },
  { rank: 3, name: 'Lucas Tactique', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', points: 3410, accuracy: '78%', badge: '🔥 Expert' },
  { rank: 4, name: 'Samuel B.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', points: 2950, accuracy: '74%', badge: '⚡ Actif' },
  { rank: 5, name: 'David Léopard', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', points: 2640, accuracy: '70%', badge: '⚡ Actif' }
];

export const MatchCenterView: React.FC<MatchCenterViewProps> = ({
  onOpenLiveRoom,
  onOpenWallet
}) => {
  const { userProfile, deductCoins, addCoins } = useAuth();
  const { formatCurrency } = useCurrencyLang();

  const [activeTab, setActiveTab] = useState<'matches' | 'tactics' | 'leaderboard' | 'myPredictions'>('matches');
  const [matches, setMatches] = useState<FootballMatch[]>(SEED_MATCHES);
  const [selectedMatchForTactics, setSelectedMatchForTactics] = useState<FootballMatch | null>(SEED_MATCHES[0]);

  // Scores inputs map: matchId -> { home: number, away: number }
  const [scoresInput, setScoresInput] = useState<Record<string, { home: number; away: number }>>({
    match_ucl_01: { home: 3, away: 2 },
    match_ucl_02: { home: 2, away: 1 },
    match_can_03: { home: 2, away: 0 },
    match_pl_04: { home: 2, away: 1 }
  });

  // Wager coins map: matchId -> number
  const [wagers, setWagers] = useState<Record<string, number>>({
    match_ucl_01: 20,
    match_ucl_02: 20,
    match_can_03: 20,
    match_pl_04: 20
  });

  // User submitted predictions
  const [myPredictions, setMyPredictions] = useState<PredictionEntry[]>([
    {
      id: 'pred_init_1',
      matchId: 'match_ucl_01',
      userId: userProfile?.id || 'demo_fan_101',
      userName: userProfile?.displayName || 'Moi',
      predictedHome: 3,
      predictedAway: 2,
      wagerCoins: 20,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleScoreChange = (matchId: string, team: 'home' | 'away', delta: number) => {
    setScoresInput(prev => {
      const current = prev[matchId] || { home: 0, away: 0 };
      const nextVal = Math.max(0, Math.min(9, current[team] + delta));
      return {
        ...prev,
        [matchId]: {
          ...current,
          [team]: nextVal
        }
      };
    });
  };

  const handleWagerChange = (matchId: string, amount: number) => {
    setWagers(prev => ({ ...prev, [matchId]: amount }));
  };

  const handleSubmitPrediction = (match: FootballMatch) => {
    const input = scoresInput[match.id] || { home: 0, away: 0 };
    const wager = wagers[match.id] || 10;

    // Check coins if wager > 0
    if (wager > 0 && (userProfile?.coinsBalance || 0) < wager) {
      alert(`Solde insuffisant ! Vous avez ${userProfile?.coinsBalance || 0} FanCoins. Rechargez votre portefeuille.`);
      onOpenWallet();
      return;
    }

    if (wager > 0) {
      deductCoins(wager);
    }

    const newPred: PredictionEntry = {
      id: `pred_${Date.now()}`,
      matchId: match.id,
      userId: userProfile?.id || 'demo_fan_101',
      userName: userProfile?.displayName || 'Moi',
      userAvatar: userProfile?.avatarUrl,
      predictedHome: input.home,
      predictedAway: input.away,
      wagerCoins: wager,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setMyPredictions(prev => [newPred, ...prev]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00E676', '#10B981', '#ffffff', '#FFD700']
      });
    } catch (e) {
      console.warn(e);
    }

    setNotification(`Pronostic validé pour ${match.homeTeam} ${input.home} - ${input.away} ${match.awayTeam} ! (+50 pts bonus FanLink)`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062414] via-[#0A160F] to-[#040C07] border border-[#183A2A] p-4.5 sm:p-5 mb-4 shadow-xl">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-[11px] font-bold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Ligue des Pronostics FanLink AI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Match Center & Pronos ⚽
            </h2>
            <p className="text-xs text-[#A8B5AE] mt-1 max-w-sm">
              Pronostiquez les scores, gagnez des FanCoins et défiez la communauté de supporters !
            </p>
          </div>

          <button 
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/40 text-[#00E676] text-xs font-black shadow-inner hover:bg-[#00E676]/20 transition"
          >
            <Coins className="w-4 h-4" />
            <span>{userProfile?.coinsBalance || 0} Coins</span>
          </button>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#00E676]/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="mb-3.5 p-3 rounded-2xl bg-[#00E676]/20 border border-[#00E676]/40 text-[#00E676] text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00E676]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Subtabs Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0A100D] border border-[#183A2A] mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'matches'
              ? 'bg-[#00E676] text-black shadow-md'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Matchs ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tactics')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'tactics'
              ? 'bg-[#00E676] text-black shadow-md'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Tactique IA</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'leaderboard'
              ? 'bg-[#00E676] text-black shadow-md'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Classement</span>
        </button>

        <button
          onClick={() => setActiveTab('myPredictions')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'myPredictions'
              ? 'bg-[#00E676] text-black shadow-md'
              : 'text-[#A8B5AE] hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Mes Pronos ({myPredictions.length})</span>
        </button>
      </div>

      {/* 1. MATCHS LIST & PREDICTION CARDS */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matches.map(match => {
            const currentScore = scoresInput[match.id] || { home: 0, away: 0 };
            const selectedWager = wagers[match.id] || 20;
            const hasPredicted = myPredictions.some(p => p.matchId === match.id);

            return (
              <div 
                key={match.id}
                className="rounded-3xl bg-[#0A100D] border border-[#183A2A] hover:border-[#00E676]/40 p-4 sm:p-5 transition-all shadow-md relative overflow-hidden"
              >
                {/* League and status header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#183A2A]/80 mb-3.5">
                  <span className="text-[11px] font-semibold text-[#A8B5AE] flex items-center gap-1">
                    <span>{match.league}</span>
                  </span>
                  {match.status === 'live' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      LIVE {match.currentMinute}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-[#00E676] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {match.matchTime}
                    </span>
                  )}
                </div>

                {/* Teams Row with Interactive Score */}
                <div className="flex items-center justify-between my-2">
                  {/* Home Team */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <img 
                      src={match.homeLogo} 
                      alt={match.homeTeam}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#183A2A] p-0.5 mb-1.5 shadow" 
                    />
                    <span className="font-bold text-xs sm:text-sm text-white max-w-[100px] sm:max-w-none truncate">
                      {match.homeTeam}
                    </span>
                    <span className="text-[10px] text-[#A8B5AE]">Domicile</span>
                  </div>

                  {/* Score Controls */}
                  <div className="flex flex-col items-center px-2">
                    {match.status === 'live' ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-white">{match.homeScore}</span>
                        <span className="text-sm font-bold text-red-500 animate-pulse">:</span>
                        <span className="text-2xl font-black text-white">{match.awayScore}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 my-1">
                        {/* Home Score Adjust */}
                        <div className="flex items-center bg-[#030604] border border-[#183A2A] rounded-xl px-1.5 py-1">
                          <button 
                            onClick={() => handleScoreChange(match.id, 'home', -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-sm font-black text-[#A8B5AE] hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-white text-base">
                            {currentScore.home}
                          </span>
                          <button 
                            onClick={() => handleScoreChange(match.id, 'home', 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-sm font-black text-[#00E676]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-black text-white/50 text-sm">VS</span>

                        {/* Away Score Adjust */}
                        <div className="flex items-center bg-[#030604] border border-[#183A2A] rounded-xl px-1.5 py-1">
                          <button 
                            onClick={() => handleScoreChange(match.id, 'away', -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-sm font-black text-[#A8B5AE] hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-white text-base">
                            {currentScore.away}
                          </span>
                          <button 
                            onClick={() => handleScoreChange(match.id, 'away', 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-sm font-black text-[#00E676]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-[#A8B5AE] mt-1">
                      {match.totalPredictions?.toLocaleString()} pronostics
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <img 
                      src={match.awayLogo} 
                      alt={match.awayTeam}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#183A2A] p-0.5 mb-1.5 shadow" 
                    />
                    <span className="font-bold text-xs sm:text-sm text-white max-w-[100px] sm:max-w-none truncate">
                      {match.awayTeam}
                    </span>
                    <span className="text-[10px] text-[#A8B5AE]">Extérieur</span>
                  </div>
                </div>

                {/* AI Probability Bar */}
                <div className="mt-3 bg-[#030604] rounded-xl p-2 border border-[#183A2A]/50">
                  <div className="flex items-center justify-between text-[10px] text-[#A8B5AE] mb-1 font-semibold">
                    <span className="text-[#00E676]">{match.homeTeam} ({match.aiProbabilityHome}%)</span>
                    <span>Nul ({match.aiProbabilityDraw}%)</span>
                    <span className="text-emerald-400">{match.awayTeam} ({match.aiProbabilityAway}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#183A2A] flex overflow-hidden">
                    <div style={{ width: `${match.aiProbabilityHome}%` }} className="bg-[#00E676]" />
                    <div style={{ width: `${match.aiProbabilityDraw}%` }} className="bg-yellow-400" />
                    <div style={{ width: `${match.aiProbabilityAway}%` }} className="bg-sky-400" />
                  </div>
                </div>

                {/* Quick Wager Selector & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#183A2A]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Wager presets */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <span className="text-[10px] text-[#A8B5AE] font-bold">Mise :</span>
                    {[0, 10, 25, 50].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleWagerChange(match.id, amt)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                          selectedWager === amt
                            ? 'bg-[#00E676] text-black shadow-sm'
                            : 'bg-[#030604] text-[#A8B5AE] border border-[#183A2A]'
                        }`}
                      >
                        {amt === 0 ? 'Gratuit' : `${amt} 🪙`}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* View AI Tactics */}
                    <button
                      onClick={() => {
                        setSelectedMatchForTactics(match);
                        setActiveTab('tactics');
                      }}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[#030604] hover:bg-[#183A2A]/40 border border-[#183A2A] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition"
                    >
                      <Bot className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Analyse IA</span>
                    </button>

                    {/* Validate prediction button */}
                    <button
                      onClick={() => handleSubmitPrediction(match)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-lg active:scale-95 ${
                        hasPredicted
                          ? 'bg-[#183A2A] text-[#00E676] border border-[#00E676]/40'
                          : 'bg-[#00E676] hover:bg-[#34FF96] text-black shadow-[#00E676]/20'
                      }`}
                    >
                      {hasPredicted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Prono Déjà Validé</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Parier ce score</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Join live fan room */}
                <div className="mt-3">
                  <button
                    onClick={() => onOpenLiveRoom(`${match.homeTeam} vs ${match.awayTeam}`)}
                    className="w-full py-1.5 rounded-xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Radio className="w-3 h-3 text-[#00E676] animate-pulse" />
                    <span>Rejoindre le Salon des Supporters en Direct</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 2. TACTICAL AI ANALYSIS */}
      {activeTab === 'tactics' && selectedMatchForTactics && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#0A100D] border border-[#183A2A] p-5 shadow-lg">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#183A2A] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Analyse Tactique FanLink AI</h3>
                  <p className="text-[10px] text-[#A8B5AE]">{selectedMatchForTactics.homeTeam} vs {selectedMatchForTactics.awayTeam}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#00E676]/10 text-[#00E676] text-[10px] font-bold border border-[#00E676]/30">
                IA 3.8 Flash
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030604] border border-[#183A2A] text-xs text-white leading-relaxed mb-4">
              <p className="font-bold text-[#00E676] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Synthèse Stratégique :
              </p>
              <p className="text-[#A8B5AE]">{selectedMatchForTactics.aiPrediction}</p>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#030604] border border-[#183A2A]">
                <span className="text-[10px] text-[#A8B5AE] font-semibold block mb-1">Forces {selectedMatchForTactics.homeTeam}</span>
                <ul className="text-xs text-white space-y-1 list-disc list-inside">
                  <li>Attaque rapide en transition</li>
                  <li>Pressing haut à domicile</li>
                  <li>Excellente finition aérienne</li>
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-[#030604] border border-[#183A2A]">
                <span className="text-[10px] text-[#A8B5AE] font-semibold block mb-1">Forces {selectedMatchForTactics.awayTeam}</span>
                <ul className="text-xs text-white space-y-1 list-disc list-inside">
                  <li>Maîtrise de la possession</li>
                  <li>Stabilité du milieu de terrain</li>
                  <li>Danger constant sur coups de pied arrêtés</li>
                </ul>
              </div>
            </div>

            {/* Key matchup */}
            <div className="p-3.5 rounded-2xl bg-[#062414] border border-[#00E676]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-[#00E676] tracking-wider block">Duel Clé du Match</span>
                <p className="text-xs font-bold text-white mt-0.5">Ailier Vedette vs Défenseur Central</p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-[#00E676] text-black text-xs font-black">
                Impact 94%
              </span>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('matches')}
                className="text-xs text-[#A8B5AE] hover:text-white font-bold"
              >
                ← Retour aux Matchs
              </button>
              <button
                onClick={() => handleSubmitPrediction(selectedMatchForTactics)}
                className="px-4 py-2 rounded-xl bg-[#00E676] text-black font-black text-xs shadow-md hover:bg-[#34FF96] transition"
              >
                Parier sur ce match
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-[#0A100D] border border-[#183A2A] shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#183A2A] mb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Classement Général des Supporters</span>
              </h3>
              <span className="text-[10px] text-[#00E676] font-bold">Semaine 42</span>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_USERS.map((usr, idx) => (
                <div 
                  key={usr.name}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition border ${
                    idx === 0 
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : idx === 1
                      ? 'bg-slate-400/10 border-slate-400/30'
                      : idx === 2
                      ? 'bg-amber-600/10 border-amber-600/30'
                      : 'bg-[#030604] border-[#183A2A]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black text-xs ${
                      idx === 0 ? 'text-yellow-400 font-extrabold text-sm' :
                      idx === 1 ? 'text-slate-300' :
                      idx === 2 ? 'text-amber-500' : 'text-[#A8B5AE]'
                    }`}>
                      #{usr.rank}
                    </span>

                    <img 
                      src={usr.avatar} 
                      alt={usr.name} 
                      className="w-9 h-9 rounded-full object-cover border border-[#183A2A]"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{usr.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#183A2A] text-[#00E676] font-semibold">
                          {usr.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A8B5AE]">Précision : {usr.accuracy}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-xs text-[#00E676] block">{usr.points} pts</span>
                    <span className="text-[9px] text-[#A8B5AE]">Saison 2026</span>
                  </div>
                </div>
              ))}

              {/* Current user's row */}
              <div className="mt-3 pt-3 border-t border-[#183A2A] flex items-center justify-between p-2.5 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-xs text-[#00E676]">#42</span>
                  <img 
                    src={userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                    alt="Moi" 
                    className="w-9 h-9 rounded-full object-cover border border-[#00E676]"
                  />
                  <div>
                    <span className="font-bold text-xs text-white">{userProfile?.displayName || 'Moi'} (Vous)</span>
                    <p className="text-[10px] text-[#A8B5AE]">En progression continue !</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs text-[#00E676]">850 pts</span>
                  <span className="text-[9px] text-white/60">Top 15%</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. MY PREDICTIONS */}
      {activeTab === 'myPredictions' && (
        <div className="space-y-3">
          {myPredictions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#0A100D] border border-[#183A2A] text-center">
              <Zap className="w-8 h-8 text-[#00E676] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-white">Aucun pronostic en cours</p>
              <p className="text-xs text-[#A8B5AE] mt-1 mb-4">Faites vos premiers pronostics sur les matchs du jour !</p>
              <button 
                onClick={() => setActiveTab('matches')}
                className="px-4 py-2 rounded-xl bg-[#00E676] text-black font-black text-xs"
              >
                Voir les matchs
              </button>
            </div>
          ) : (
            myPredictions.map(pred => {
              const match = matches.find(m => m.id === pred.matchId);
              return (
                <div 
                  key={pred.id}
                  className="p-4 rounded-3xl bg-[#0A100D] border border-[#183A2A] shadow-md flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-[#A8B5AE] font-semibold block mb-0.5">
                      {match?.league || 'UEFA Champions League'}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-white">
                      {match?.homeTeam || 'Équipe 1'} vs {match?.awayTeam || 'Équipe 2'}
                    </h4>
                    <p className="text-xs text-[#00E676] font-bold mt-1">
                      Votre score : {pred.predictedHome} - {pred.predictedAway}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-black inline-block mb-1">
                      En attente
                    </span>
                    <span className="text-[10px] text-[#A8B5AE] block">
                      Mise : {pred.wagerCoins} Coins
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
