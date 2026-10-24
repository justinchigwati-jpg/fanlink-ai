import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  increment 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  Post, 
  Comment, 
  UserProfile, 
  VirtualGift, 
  VerificationRequest, 
  ReportItem, 
  TransactionRecord,
  Conversation,
  Message,
  UserSettings,
  UserActivityItem,
  BadgeInfo 
} from '../types';

// Pre-configured official virtual gifts
export const VIRTUAL_GIFTS: VirtualGift[] = [
  {
    id: 'gift_rose',
    name: 'Rose Émeraude',
    icon: '🌹',
    coinsCost: 10,
    fiatApproxEur: 0.20,
    description: 'Une marque d\'affection discrète et élégante'
  },
  {
    id: 'gift_star',
    name: 'Étoile FanLink',
    icon: '⭐',
    coinsCost: 50,
    fiatApproxEur: 1.00,
    description: 'Faites briller votre créateur préféré'
  },
  {
    id: 'gift_flame',
    name: 'Flamme d\'Or',
    icon: '🔥',
    coinsCost: 200,
    fiatApproxEur: 4.00,
    description: 'Allumez le live avec une énergie débordante'
  },
  {
    id: 'gift_trophy',
    name: 'Trophée Champion',
    icon: '🏆',
    coinsCost: 500,
    fiatApproxEur: 10.00,
    description: 'Pour les performances d\'exception'
  },
  {
    id: 'gift_crown',
    name: 'Couronne VIP Royale',
    icon: '👑',
    coinsCost: 1000,
    fiatApproxEur: 20.00,
    description: 'Le summum du statut fan : message épinglé 5 min'
  }
];

// Curated Star Creators matching reference image mockup
export const SEED_CREATORS: UserProfile[] = [
  {
    id: 'sarah_queen',
    email: 'sarah.queen@fanlink.ai',
    displayName: 'Sarah Queen',
    username: 'sarah_queen',
    accountType: 'creator',
    bio: 'Lifestyle, Music & Positive Vibes ✨ | FanLink Ambassador 💚 | Paris / Kinshasa',
    country: 'France',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 842000,
    followingCount: 142,
    postsCount: 284,
    coinsBalance: 12500,
    creatorEarningsEur: 5240.00,
    pendingEarningsEur: 850.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'EUR',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'mr_k',
    email: 'mrk@fanlink.ai',
    displayName: 'Mr. K',
    username: 'mrk_officiel',
    accountType: 'artist',
    bio: 'Créateur • Music • Dreamer | FanLink Family 💚 | Goma, RDC 🇨🇩',
    country: 'RDC',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 1200000,
    followingCount: 252,
    postsCount: 318,
    coinsBalance: 24000,
    creatorEarningsEur: 9800.00,
    pendingEarningsEur: 1420.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-01-05T12:00:00.000Z'
  },
  {
    id: 'fally_ipupa',
    email: 'fally@fanlink.ai',
    displayName: 'Fally Ipupa',
    username: 'fallyipupa',
    accountType: 'artist',
    bio: 'Artiste International 🎵 | Tokooos Music World | Nouveau single disponible sur FanLink !',
    country: 'RDC',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 3400000,
    followingCount: 48,
    postsCount: 520,
    coinsBalance: 45000,
    creatorEarningsEur: 28400.00,
    pendingEarningsEur: 3200.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'gaz_mawete',
    email: 'gaz.mawete@fanlink.ai',
    displayName: 'Gaz Mawete',
    username: 'gaz_mawete',
    accountType: 'artist',
    bio: 'Chanteur, auteur-compositeur & performer 🎤 | En direct tous les mercredis avec la communauté.',
    country: 'RDC',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 980000,
    followingCount: 85,
    postsCount: 195,
    coinsBalance: 9800,
    creatorEarningsEur: 4200.00,
    pendingEarningsEur: 680.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-01-15T14:00:00.000Z'
  },
  {
    id: 'nana_b',
    email: 'nana.b@fanlink.ai',
    displayName: 'Nana B.',
    username: 'nana_b',
    accountType: 'creator',
    bio: 'Mode, Beauté & Tendance Fashion Week 💄 | Directs backstage & styling exclusifs.',
    country: 'Côte d\'Ivoire',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 750000,
    followingCount: 130,
    postsCount: 412,
    coinsBalance: 15400,
    creatorEarningsEur: 6300.00,
    pendingEarningsEur: 920.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'XOF',
    createdAt: '2026-01-20T16:00:00.000Z'
  },
  {
    id: 'lamine_yamal',
    email: 'lamine.yamal@fanlink.ai',
    displayName: 'Lamine Yamal',
    username: 'lamine_yamal',
    accountType: 'athlete',
    bio: 'Footballeur Professionnel FC Barcelone & Espagne ⚽ | Visca Barça ! ❤️💙',
    country: 'Espagne',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 18500000,
    followingCount: 94,
    postsCount: 142,
    coinsBalance: 82000,
    creatorEarningsEur: 45000.00,
    pendingEarningsEur: 5000.00,
    preferredLanguage: 'es',
    preferredCurrency: 'EUR',
    createdAt: '2026-01-02T10:00:00.000Z'
  }
];

// Rich Posts matching reference mockups
export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_sarah_01',
    authorId: 'sarah_queen',
    authorName: 'Sarah Queen',
    authorUsername: 'sarah_queen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'star_verified',
    authorVerified: true,
    content: 'La vie est belle quand on fait ce qu\'on aime... 💚🔥 #FanLink #FansStarsTogether #PositiveVibes',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    tags: ['FanLink', 'GoodVibes', 'MusicLife', 'Creator'],
    likesCount: 128600,
    commentsCount: 3842,
    isExclusive: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likedByCurrentUser: true,
    savedByCurrentUser: true
  },
  {
    id: 'post_mrk_01',
    authorId: 'mr_k',
    authorName: 'Mr. K',
    authorUsername: 'mrk_officiel',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'star_verified',
    authorVerified: true,
    content: 'Coulisses du tournage à Goma 🇨🇩 ! Un nouveau projet musical exceptionnel qui unit nos forces. Merci à toute la FanLink Family pour l\'amour inconditionnel !',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    tags: ['Musique', 'Goma', 'FanLinkFamily', 'AfricaRising'],
    likesCount: 95400,
    commentsCount: 2150,
    isExclusive: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    likedByCurrentUser: false
  },
  {
    id: 'post_fally_01',
    authorId: 'fally_ipupa',
    authorName: 'Fally Ipupa',
    authorUsername: 'fallyipupa',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'star_verified',
    authorVerified: true,
    content: 'Concert géant en préparation ! ⚡ Session live acoustique exclusive réservée aux membres VIP FanLink ce vendredi soir. Wapi team FanLink ? 🔥',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    tags: ['Tokooos', 'LiveConcert', 'FanLinkVIP', 'Musique'],
    likesCount: 245000,
    commentsCount: 6120,
    isExclusive: true,
    exclusivePriceCoins: 50,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    likedByCurrentUser: false
  },
  {
    id: 'post_lamine_01',
    authorId: 'lamine_yamal',
    authorName: 'Lamine Yamal',
    authorUsername: 'lamine_yamal',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'star_verified',
    authorVerified: true,
    content: 'Focus total pour le prochain choc du week-end. Le travail et la passion ne s\'arrêtent jamais. Visca Barça ! ❤️💙',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
    tags: ['FCBarcelona', 'LaLiga', 'Football', 'LamineYamal'],
    likesCount: 3100000,
    commentsCount: 42100,
    isExclusive: false,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    likedByCurrentUser: true
  }
];

// Active Live sessions matching reference mockup
export interface LiveSession {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  viewers: string;
  viewersCount: number;
  category: string;
  title: string;
  thumbnail: string;
}

export const ACTIVE_LIVES: LiveSession[] = [
  {
    id: 'live_nana',
    creatorId: 'nana_b',
    creatorName: 'Nana B.',
    creatorUsername: 'nana_b',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    viewers: '25,4K',
    viewersCount: 25400,
    category: 'Mode & Lifestyle',
    title: 'Backstage Fashion Week & Tendance 2026',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'live_fally',
    creatorId: 'fally_ipupa',
    creatorName: 'Fally Ipupa',
    creatorUsername: 'fallyipupa',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    viewers: '12,1K',
    viewersCount: 12100,
    category: 'Musique',
    title: 'Répétition live au studio avec les musiciens',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'live_gaz',
    creatorId: 'gaz_mawete',
    creatorName: 'Gaz Mawete',
    creatorUsername: 'gaz_mawete',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    viewers: '8,9K',
    viewersCount: 8900,
    category: 'Musique',
    title: 'Session Q&A & Écoute de prods inédites',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  }
];

// Discover Trending Grid Items matching mockup Screen 4
export interface DiscoverTrendingItem {
  id: string;
  category: 'Musique' | 'Sport' | 'Gaming' | 'Mode';
  views: string;
  title: string;
  creatorName: string;
  imageUrl: string;
}

export const DISCOVER_TRENDING_ITEMS: DiscoverTrendingItem[] = [
  {
    id: 'disc_1',
    category: 'Musique',
    views: '2,4M',
    title: 'Concert Fally & Tokooos Band Live',
    creatorName: 'Fally Ipupa',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_2',
    category: 'Sport',
    views: '3,1M',
    title: 'Lamine Yamal dribbles et buts légendaires',
    creatorName: 'Lamine Yamal',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_3',
    category: 'Gaming',
    views: '890K',
    title: 'Finales Coupe d\'Afrique E-Sport',
    creatorName: 'Tiago Stream',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_4',
    category: 'Mode',
    views: '1,2M',
    title: 'Défilé Haute Couture & Afro-Futurisme',
    creatorName: 'Nana B.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
  }
];

// Conversations matching reference image 2 Screen 6
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_sarah',
    participantId: 'sarah_queen',
    participantName: 'Sarah Queen',
    participantUsername: 'sarah_queen',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Merci beaucoup 💚',
    lastMessageTime: '2 min',
    unreadCount: 1
  },
  {
    id: 'conv_fally',
    participantId: 'fally_ipupa',
    participantName: 'Fally Ipupa',
    participantUsername: 'fallyipupa',
    participantAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Wapi team FanLink ? 🔥',
    lastMessageTime: '15 min',
    unreadCount: 0
  },
  {
    id: 'conv_gaz',
    participantId: 'gaz_mawete',
    participantName: 'Gaz Mawete',
    participantUsername: 'gaz_mawete',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Trop fort frèro !',
    lastMessageTime: '32 min',
    unreadCount: 0
  },
  {
    id: 'conv_innocent',
    participantId: 'innocent_star',
    participantName: 'Innocent',
    participantUsername: 'innocent_music',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'On se voit demain',
    lastMessageTime: '2 h',
    unreadCount: 0
  },
  {
    id: 'conv_nana',
    participantId: 'nana_baby',
    participantName: 'Nana Baby',
    participantUsername: 'nana_baby',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Cool 💚',
    lastMessageTime: '5 h',
    unreadCount: 0
  },
  {
    id: 'conv_lamine',
    participantId: 'lamine_yamal',
    participantName: 'Lamine Yamal',
    participantUsername: 'lamine_yamal',
    participantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Visca Barça ! ❤️💙',
    lastMessageTime: '1 j',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_sarah: [
    {
      id: 'm_s1',
      conversationId: 'conv_sarah',
      senderId: 'sarah_queen',
      senderName: 'Sarah Queen',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'Coucou ! Merci pour ton soutien sur mon dernier post vidéo ✨',
      createdAt: '2026-10-23T18:00:00.000Z'
    },
    {
      id: 'm_s2',
      conversationId: 'conv_sarah',
      senderId: 'demo_fan_101',
      senderName: 'Moi',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: 'Tu mérites tellement, le son est incroyable ! Hâte du prochain direct.',
      createdAt: '2026-10-23T18:05:00.000Z'
    },
    {
      id: 'm_s3',
      conversationId: 'conv_sarah',
      senderId: 'sarah_queen',
      senderName: 'Sarah Queen',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'Merci beaucoup 💚',
      createdAt: '2026-10-23T19:15:00.000Z'
    },
    {
      id: 'm_s4',
      conversationId: 'conv_sarah',
      senderId: 'sarah_queen',
      senderName: 'Sarah Queen',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: '🎧 Extrait vocal exclusif de mon nouveau refrain acoustique en avant-première mondiale.',
      isPaid: true,
      priceCoins: 30,
      isUnlocked: false,
      createdAt: '2026-10-23T20:00:00.000Z'
    }
  ],
  conv_fally: [
    {
      id: 'm_f1',
      conversationId: 'conv_fally',
      senderId: 'fally_ipupa',
      senderName: 'Fally Ipupa',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      text: 'Wapi team FanLink ? 🔥 Préparez-vous pour le concert !',
      createdAt: '2026-10-23T18:30:00.000Z'
    }
  ]
};

export const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'verif_01',
    userId: 'mr_k',
    fullName: 'Christian Kazadi',
    stageName: 'Mr. K',
    category: 'Musique & Art',
    country: 'RDC',
    socialProof: 'Spotify: 1.2M auditeurs | Instagram: @mrk_officiel (850k)',
    documentType: 'Passeport & Contrat Maison de Disque',
    status: 'approved',
    submittedAt: '2026-02-01T10:00:00.000Z',
    reviewedAt: '2026-02-02T12:00:00.000Z'
  },
  {
    id: 'verif_02',
    userId: 'user_req_99',
    fullName: 'Sarah Kanza',
    stageName: 'Sarah Queen',
    category: 'Influence & Créatrice',
    country: 'France',
    socialProof: 'TikTok: 1.5M abonnés | YouTube: 620k abonnés',
    documentType: 'Carte Nationale d\'Identité',
    status: 'approved',
    submittedAt: '2026-10-22T14:20:00.000Z'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_01',
    reporterId: 'demo_fan_101',
    reporterName: 'Thomas Lemoine',
    targetType: 'post',
    targetId: 'post_fake_33',
    reason: 'Suspicion d\'usurpation d\'identité et faux liens de billetterie.',
    status: 'pending',
    createdAt: '2026-10-23T08:30:00.000Z'
  }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  notifications: {
    newFollowers: true,
    likesAndComments: true,
    mentionsAndReplies: true,
    directMessages: true,
    liveBroadcasts: true,
    securityAlerts: true,
    payoutsAndEarnings: true
  },
  privacy: {
    isPrivateAccount: false,
    directMessagesPolicy: 'everyone',
    showOnlineStatus: true,
    allowStoryViewHistory: true,
    blockedUsers: []
  },
  appearance: {
    theme: 'dark',
    language: 'fr',
    autoplayVideo: 'wifi',
    dataSaver: false,
    soundOnByDefault: true
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
    activeSessions: [
      {
        id: 'sess_current',
        device: 'Smartphone Android (Pixel / Samsung)',
        browser: 'Chrome Mobile 128',
        ipLocation: 'Paris, France (Actuel)',
        lastActive: 'À l\'instant',
        isCurrent: true
      },
      {
        id: 'sess_prev',
        device: 'Ordinateur Portable (MacBook Pro)',
        browser: 'Safari 17.5',
        ipLocation: 'Paris, France',
        lastActive: 'Il y a 3 jours',
        isCurrent: false
      }
    ]
  }
};

export const INITIAL_ACTIVITIES: UserActivityItem[] = [
  {
    id: 'act_1',
    userId: 'demo_fan_101',
    type: 'like',
    title: 'Mention J\'aime',
    description: 'Vous avez aimé la vidéo de Sarah Queen',
    targetId: 'post_sarah_01',
    targetTitle: 'La vie est belle quand on fait ce qu\'on aime... 💚🔥',
    targetImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'act_2',
    userId: 'demo_fan_101',
    type: 'comment',
    title: 'Commentaire publié',
    description: '« Tellement fan de ton énergie Sarah ! Le nouveau clip est magnifique 💚 »',
    targetId: 'post_sarah_01',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'act_3',
    userId: 'demo_fan_101',
    type: 'follow',
    title: 'Nouvel abonnement',
    description: 'Vous avez commencé à suivre Fally Ipupa',
    targetId: 'fally_ipupa',
    targetTitle: 'Fally Ipupa (@fallyipupa)',
    targetImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'act_4',
    userId: 'demo_fan_101',
    type: 'gift',
    title: 'Cadeau virtuel envoyé',
    description: 'Vous avez offert une Étoile FanLink (50 FanCoins) à Kémi AfroPulse en direct',
    targetId: 'demo_creator_202',
    targetTitle: 'Kémi AfroPulse',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'act_5',
    userId: 'demo_fan_101',
    type: 'wallet',
    title: 'Recharge FanCoins',
    description: 'Recharge confirmée de 500 FanCoins (+50 bonus) via Carte Bancaire',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'act_6',
    userId: 'demo_fan_101',
    type: 'security',
    title: 'Connexion sécurisée',
    description: 'Nouvelle connexion réussie depuis Chrome Mobile (Android)',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export const SYSTEM_BADGES: BadgeInfo[] = [
  {
    id: 'badge_first_member',
    name: 'Pionnier FanLink',
    icon: '🚀',
    category: 'system',
    description: 'A rejoint FanLink lors de la phase de lancement officielle mondiale.',
    isUnlocked: true,
    unlockedAt: '2026-02-15T12:00:00.000Z'
  },
  {
    id: 'badge_active_supporter',
    name: 'Fan Actif 🟢',
    icon: '⚡',
    category: 'fan',
    description: 'A aimé plus de 25 publications et commenté avec bienveillance.',
    isUnlocked: true,
    unlockedAt: '2026-03-01T15:30:00.000Z'
  },
  {
    id: 'badge_generous_giver',
    name: 'Mécène Live ⭐',
    icon: '🎁',
    category: 'fan',
    description: 'A soutenu un créateur lors d\'un concert ou session live avec un cadeau virtuel.',
    isUnlocked: true,
    unlockedAt: '2026-04-10T21:00:00.000Z'
  },
  {
    id: 'badge_music_explorer',
    name: 'Explorateur Culturel 🎧',
    icon: '🌍',
    category: 'fan',
    description: 'Suit des artistes et créateurs de plus de 3 pays différents.',
    isUnlocked: true,
    unlockedAt: '2026-05-02T09:45:00.000Z'
  },
  {
    id: 'badge_verified_creator',
    name: 'Star Officielle 🛡️',
    icon: '💎',
    category: 'creator',
    description: 'Identité officielle validée par l\'équipe sécurité et administration FanLink.',
    isUnlocked: false
  },
  {
    id: 'badge_monetized_pro',
    name: 'Créateur Élite 80/20',
    icon: '💰',
    category: 'creator',
    description: 'Programme de monétisation activé avec plus de 1 000 abonnés réguliers.',
    isUnlocked: false
  }
];

// Helper functions for settings & activities
export const getStoredUserSettings = (): UserSettings => {
  try {
    const saved = localStorage.getItem('fanlink_user_settings_v1');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_USER_SETTINGS;
};

export const saveStoredUserSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem('fanlink_user_settings_v1', JSON.stringify(settings));
  } catch (e) {
    console.warn(e);
  }
};

export const getStoredUserActivities = (): UserActivityItem[] => {
  try {
    const saved = localStorage.getItem('fanlink_user_activities_v1');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return INITIAL_ACTIVITIES;
};

export const addStoredUserActivity = (activity: UserActivityItem): void => {
  try {
    const current = getStoredUserActivities();
    const updated = [activity, ...current.slice(0, 49)];
    localStorage.setItem('fanlink_user_activities_v1', JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }
};

