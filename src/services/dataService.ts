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
import { getApiUrl } from './apiConfig';

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

// Curated Realistic Community Starters
export const SEED_CREATORS: UserProfile[] = [
  {
    id: 'fanlink_official',
    email: 'contact@fanlink.ai',
    displayName: 'FanLink AI Officiel',
    username: 'fanlink',
    accountType: 'creator',
    bio: 'Compte officiel de la plateforme FanLink AI ⚡ La communauté des passionnés de musique, sport et créateurs.',
    country: 'International',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 18,
    followingCount: 3,
    postsCount: 1,
    coinsBalance: 500,
    creatorEarningsEur: 0,
    pendingEarningsEur: 0,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-01-01T10:00:00.000Z'
  },
  {
    id: 'sarah_music',
    email: 'sarah@fanlink.ai',
    displayName: 'Sarah Queen',
    username: 'sarah_queen',
    accountType: 'artist',
    bio: 'Passionnée de chant & vibes acoustiques 🎵 | Kinshasa 🇨🇩',
    country: 'RDC',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    isVerified: false,
    badge: 'active_fan',
    followersCount: 12,
    followingCount: 8,
    postsCount: 1,
    coinsBalance: 200,
    creatorEarningsEur: 0,
    pendingEarningsEur: 0,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'mr_k',
    email: 'mrk@fanlink.ai',
    displayName: 'Mr. K',
    username: 'mrk_officiel',
    accountType: 'creator',
    bio: 'Créateur de contenu vidéo • Goma 🇨🇩',
    country: 'RDC',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    isVerified: false,
    badge: 'none',
    followersCount: 9,
    followingCount: 5,
    postsCount: 1,
    coinsBalance: 150,
    creatorEarningsEur: 0,
    pendingEarningsEur: 0,
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    createdAt: '2026-02-10T12:00:00.000Z'
  }
];

// Authentic Starter Community Posts
export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_fanlink_welcome',
    authorId: 'fanlink_official',
    authorName: 'FanLink AI Officiel',
    authorUsername: 'fanlink',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'star_verified',
    authorVerified: true,
    content: 'Bienvenue sur FanLink AI ! 💚 Connectez-vous avec vos créateurs préférés, publiez vos moments forts et profitez de l\'espace pronostics et directs.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    tags: ['FanLink', 'Bienvenue', 'Communaute'],
    likesCount: 5,
    commentsCount: 1,
    isExclusive: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likedByCurrentUser: false,
    savedByCurrentUser: false
  },
  {
    id: 'post_sarah_01',
    authorId: 'sarah_music',
    authorName: 'Sarah Queen',
    authorUsername: 'sarah_queen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'none',
    authorVerified: false,
    content: 'Session acoustique au studio aujourd\'hui ! Qu\'aimeriez-vous écouter lors du prochain direct ? 🎵',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    tags: ['Musique', 'Acoustique', 'Studio'],
    likesCount: 3,
    commentsCount: 1,
    isExclusive: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likedByCurrentUser: false,
    savedByCurrentUser: false
  }
];

// Active Live sessions
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
    id: 'live_sarah',
    creatorId: 'sarah_music',
    creatorName: 'Sarah Queen',
    creatorUsername: 'sarah_queen',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    viewers: '5 spectateurs',
    viewersCount: 5,
    category: 'Musique',
    title: 'Session Live Acoustique & Échange',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
  }
];

// Discover Trending Grid Items matching community exploration
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
    views: '124 vues',
    title: 'Découvertes acoustiques en direct',
    creatorName: 'Sarah Queen',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_2',
    category: 'Sport',
    views: '88 vues',
    title: 'Entraînement et préparation de match',
    creatorName: 'FanLink Sport',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_3',
    category: 'Gaming',
    views: '54 vues',
    title: 'Session découverte nouveaux jeux',
    creatorName: 'Community Play',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'disc_4',
    category: 'Mode',
    views: '76 vues',
    title: 'Tendances et styles de la semaine',
    creatorName: 'Créateurs Mode',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
  }
];

// Conversations matching reference image 2 Screen 6
// Authentic Official Conversations
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_fanlink_team',
    participantId: 'fanlink_official',
    participantName: 'Équipe FanLink AI',
    participantUsername: 'fanlink_team',
    participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    participantBadge: 'star_verified',
    lastMessage: 'Bienvenue sur FanLink AI ! Nous sommes ravis de vous compter parmi nous 💚',
    lastMessageTime: 'À l\'instant',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_fanlink_team: [
    {
      id: 'm_welcome_1',
      conversationId: 'conv_fanlink_team',
      senderId: 'fanlink_official',
      senderName: 'Équipe FanLink AI',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      text: 'Bienvenue sur FanLink AI ! 💚 Notre communauté réunit passionnés, fans et créateurs. Si vous avez la moindre question, écrivez-nous ici.',
      createdAt: new Date().toISOString()
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

// --- REAL-TIME FIRESTORE SERVICES ---

import { onSnapshot, writeBatch } from 'firebase/firestore';

/**
 * Real-time listener for posts across all devices with automatic seeding fallback
 */
export const subscribeToPosts = (onUpdate: (posts: Post[]) => void): (() => void) => {
  const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
  
  const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
    if (!snapshot.empty) {
      const livePosts = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Post[];
      onUpdate(livePosts);
    } else {
      // Seed initial posts if Firestore collection is fresh
      try {
        const batch = writeBatch(db);
        INITIAL_POSTS.forEach(p => {
          const docRef = doc(db, 'posts', p.id);
          batch.set(docRef, p);
        });
        await batch.commit();
        onUpdate(INITIAL_POSTS);
      } catch (err) {
        console.warn('Initial seeding fallback to memory:', err);
        onUpdate(INITIAL_POSTS);
      }
    }
  }, (error) => {
    console.warn('Firestore posts subscription error:', error);
    onUpdate(INITIAL_POSTS);
  });

  return unsubscribe;
};

/**
 * Creates a new post in Firestore
 */
export const createPostInFirestore = async (post: Post): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', post.id);
    await setDoc(postRef, {
      id: post.id,
      authorId: post.authorId,
      authorName: post.authorName,
      authorUsername: post.authorUsername,
      authorAvatar: post.authorAvatar,
      authorBadge: post.authorBadge,
      authorVerified: Boolean(post.authorVerified),
      content: post.content,
      mediaType: post.mediaType,
      mediaUrl: post.mediaUrl || '',
      tags: post.tags,
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      isExclusive: Boolean(post.isExclusive),
      exclusivePriceCoins: post.exclusivePriceCoins || 0,
      createdAt: post.createdAt
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `posts/${post.id}`);
  }
};

/**
 * Toggles like count on a post in Firestore
 */
export const toggleLikePostInFirestore = async (postId: string, isLiked: boolean): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likesCount: increment(isLiked ? 1 : -1)
    });
  } catch (err) {
    console.warn('Like sync fallback:', err);
  }
};

/**
 * Adds comment to a post in Firestore
 */
export const addCommentInFirestore = async (postId: string, comment: Comment): Promise<void> => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', comment.id);
    await setDoc(commentRef, comment);
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: increment(1)
    });
  } catch (err) {
    console.warn('Comment sync error:', err);
  }
};

/**
 * Real-time listener for comments of a post
 */
export const subscribeToPostComments = (postId: string, onUpdate: (comments: Comment[]) => void): (() => void) => {
  const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(100));
  return onSnapshot(commentsQuery, (snapshot) => {
    const list = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as Comment[];
    onUpdate(list);
  }, (err) => {
    console.warn('Comments subscription warning:', err);
  });
};

/**
 * Submits a creator verification request to Firestore
 */
export const submitVerificationRequest = async (request: Partial<VerificationRequest>): Promise<void> => {
  try {
    const id = request.id || `verif_${Date.now()}`;
    const reqRef = doc(db, 'verificationRequests', id);
    await setDoc(reqRef, {
      ...request,
      id,
      submittedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Verification request save fallback:', err);
  }
};

/**
 * Submits content/user report to server and Firestore
 */
export const submitContentReport = async (report: Partial<ReportItem>): Promise<void> => {
  try {
    const id = report.id || `rep_${Date.now()}`;
    await fetch(getApiUrl('/api/reports'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reporterId: report.reporterId || 'anonymous_fan',
        targetType: report.targetType || 'post',
        targetId: report.targetId || 'unknown',
        reason: report.reason || 'Non précisé'
      })
    });
  } catch (err) {
    console.warn('Report submission fallback:', err);
  }
};

