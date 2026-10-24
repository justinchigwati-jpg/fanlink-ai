import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, SupportedLanguage } from '../types';

interface CurrencyLangContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatCurrency: (amountEur: number) => string;
  t: (key: string) => string;
}

// Approximate FX conversion rates relative to EUR baseline
const FX_RATES: Record<CurrencyCode, { rate: number; symbol: string; suffix?: boolean }> = {
  EUR: { rate: 1.0, symbol: '€' },
  USD: { rate: 1.08, symbol: '$' },
  GBP: { rate: 0.85, symbol: '£' },
  XOF: { rate: 655.95, symbol: 'FCFA', suffix: true },
  ZAR: { rate: 19.8, symbol: 'R' },
  KES: { rate: 142.5, symbol: 'KSh', suffix: true }
};

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  fr: {
    appName: 'FanLink AI',
    tagline: 'Connecter les fans et les stars',
    feed: 'Accueil',
    stars: 'Stars & Créateurs',
    create: 'Publier',
    messages: 'Messagerie',
    profile: 'Profil',
    live: 'Directs',
    monetization: 'Monétisation',
    admin: 'Modération',
    forYou: 'Pour toi',
    following: 'Abonnements',
    searchPlaceholder: 'Rechercher un créateur, un artiste, un tag...',
    coins: 'FanCoins',
    recharge: 'Recharger',
    follow: 'Suivre',
    followingBtn: 'Abonné',
    subscribeVip: 'Rejoindre VIP',
    sendGift: 'Offrir un cadeau',
    verifiedBadge: 'Certifié officiel',
    activeFanBadge: 'Fan Actif',
    vipBadge: 'Membre VIP',
    liveBroadcast: 'En direct',
    noPosts: 'Aucune publication pour le moment.',
    beFirstPost: 'Soyez le premier à publier !',
    comments: 'Commentaires',
    share: 'Partager',
    exclusiveContent: 'Contenu exclusif',
    unlockFor: 'Débloquer pour',
    requestVerification: 'Demander la certification officielle',
    aiAssistant: 'Assistant FanLink AI',
    creatorEarnings: 'Revenus Créateur (80%)',
    platformFee: 'Frais Plateforme (20%)',
    requestPayout: 'Demander un virement',
    minPayout: 'Minimum de retrait : 50 €',
    language: 'Langue',
    currency: 'Devise locale'
  },
  en: {
    appName: 'FanLink AI',
    tagline: 'Connecting fans and global stars',
    feed: 'Home',
    stars: 'Stars & Creators',
    create: 'Post',
    messages: 'Messages',
    profile: 'Profile',
    live: 'Live Stream',
    monetization: 'Earnings',
    admin: 'Moderation',
    forYou: 'For You',
    following: 'Following',
    searchPlaceholder: 'Search creator, artist, tag...',
    coins: 'FanCoins',
    recharge: 'Buy Coins',
    follow: 'Follow',
    followingBtn: 'Following',
    subscribeVip: 'Join VIP',
    sendGift: 'Send Gift',
    verifiedBadge: 'Officially Verified',
    activeFanBadge: 'Active Fan',
    vipBadge: 'VIP Member',
    liveBroadcast: 'Live Now',
    noPosts: 'No posts yet.',
    beFirstPost: 'Be the first to post!',
    comments: 'Comments',
    share: 'Share',
    exclusiveContent: 'Exclusive Content',
    unlockFor: 'Unlock for',
    requestVerification: 'Request Official Verification',
    aiAssistant: 'FanLink AI Assistant',
    creatorEarnings: 'Creator Share (80%)',
    platformFee: 'Platform Fee (20%)',
    requestPayout: 'Request Payout',
    minPayout: 'Minimum payout: €50',
    language: 'Language',
    currency: 'Local Currency'
  },
  es: {
    appName: 'FanLink AI',
    tagline: 'Conectando fans y estrellas mundiales',
    feed: 'Inicio',
    stars: 'Estrellas',
    create: 'Publicar',
    messages: 'Mensajes',
    profile: 'Perfil',
    live: 'En Vivo',
    monetization: 'Monetización',
    admin: 'Moderación',
    forYou: 'Para ti',
    following: 'Siguiendo',
    searchPlaceholder: 'Buscar creadores, artistas...',
    coins: 'FanCoins',
    recharge: 'Recargar',
    follow: 'Seguir',
    followingBtn: 'Siguiendo',
    subscribeVip: 'Hacerse VIP',
    sendGift: 'Enviar regalo',
    verifiedBadge: 'Verificado oficial',
    activeFanBadge: 'Fan Activo',
    vipBadge: 'Miembro VIP',
    liveBroadcast: 'En vivo',
    noPosts: 'No hay publicaciones aún.',
    beFirstPost: '¡Sé el primero en publicar!',
    comments: 'Comentarios',
    share: 'Compartir',
    exclusiveContent: 'Contenido exclusivo',
    unlockFor: 'Desbloquear por',
    requestVerification: 'Solicitar verificación oficial',
    aiAssistant: 'Asistente FanLink AI',
    creatorEarnings: 'Ganancias del Creador (80%)',
    platformFee: 'Comisión plataforma (20%)',
    requestPayout: 'Solicitar pago',
    minPayout: 'Retiro mínimo: 50 €',
    language: 'Idioma',
    currency: 'Moneda local'
  },
  pt: {
    appName: 'FanLink AI',
    tagline: 'Conectando fãs e estrelas globais',
    feed: 'Início',
    stars: 'Estrelas',
    create: 'Publicar',
    messages: 'Mensagens',
    profile: 'Perfil',
    live: 'Ao Vivo',
    monetization: 'Monetização',
    admin: 'Moderação',
    forYou: 'Para você',
    following: 'Seguindo',
    searchPlaceholder: 'Pesquisar criadores, artistas...',
    coins: 'FanCoins',
    recharge: 'Recarregar',
    follow: 'Seguir',
    followingBtn: 'Seguindo',
    subscribeVip: 'Tornar-se VIP',
    sendGift: 'Enviar presente',
    verifiedBadge: 'Oficialmente Verificado',
    activeFanBadge: 'Fã Ativo',
    vipBadge: 'Membro VIP',
    liveBroadcast: 'Ao vivo',
    noPosts: 'Nenhuma publicação ainda.',
    beFirstPost: 'Seja o primeiro a publicar!',
    comments: 'Comentários',
    share: 'Compartilhar',
    exclusiveContent: 'Conteúdo exclusivo',
    unlockFor: 'Desbloquear por',
    requestVerification: 'Solicitar verificação oficial',
    aiAssistant: 'Assistente FanLink AI',
    creatorEarnings: 'Ganhos do Criador (80%)',
    platformFee: 'Taxa da plataforma (20%)',
    requestPayout: 'Solicitar saque',
    minPayout: 'Saque mínimo: 50 €',
    language: 'Idioma',
    currency: 'Moeda local'
  }
};

const CurrencyLangContext = createContext<CurrencyLangContextType | undefined>(undefined);

export const CurrencyLangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('fanlink_lang') as SupportedLanguage) || 'fr';
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('fanlink_curr') as CurrencyCode) || 'EUR';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('fanlink_lang', lang);
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('fanlink_curr', curr);
  };

  const formatCurrency = (amountEur: number): string => {
    const info = FX_RATES[currency] || FX_RATES.EUR;
    const converted = amountEur * info.rate;
    const formattedNum = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      maximumFractionDigits: info.rate > 100 ? 0 : 2,
      minimumFractionDigits: info.rate > 100 ? 0 : 2,
    }).format(converted);

    if (info.suffix) {
      return `${formattedNum} ${info.symbol}`;
    }
    return `${info.symbol}${formattedNum}`;
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.fr[key] || key;
  };

  return (
    <CurrencyLangContext.Provider value={{ language, setLanguage, currency, setCurrency, formatCurrency, t }}>
      {children}
    </CurrencyLangContext.Provider>
  );
};

export const useCurrencyLang = () => {
  const context = useContext(CurrencyLangContext);
  if (!context) throw new Error('useCurrencyLang must be used within CurrencyLangProvider');
  return context;
};
