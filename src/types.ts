export type AccountType = 'fan' | 'creator' | 'artist' | 'athlete';

export type UserBadge = 'none' | 'active_fan' | 'vip' | 'star_verified';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'XOF' | 'ZAR' | 'KES';

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'pt';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  displayName: string;
  username: string;
  accountType: AccountType;
  bio: string;
  country: string;
  avatarUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  badge: UserBadge;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  coinsBalance: number;
  creatorEarningsEur: number;
  pendingEarningsEur: number;
  preferredLanguage: SupportedLanguage;
  preferredCurrency: CurrencyCode;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge: UserBadge;
  authorVerified: boolean;
  content: string;
  mediaType: 'none' | 'image' | 'video';
  mediaUrl?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  isExclusive: boolean;
  exclusivePriceCoins?: number;
  createdAt: string;
  likedByCurrentUser?: boolean;
  savedByCurrentUser?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: UserBadge;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  isPaid?: boolean;
  priceCoins?: number;
  isUnlocked?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar: string;
  participantBadge: UserBadge;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coinsCost: number;
  fiatApproxEur: number;
  description: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  creatorId?: string;
  creatorName?: string;
  type: 'deposit' | 'gift' | 'payout' | 'paid_message' | 'subscription';
  amountCoins?: number;
  amountFiat?: number;
  currency: string;
  provider: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  stageName: string;
  category: string;
  country: string;
  socialProof: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'user' | 'message';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'wallet';
  supportedCurrencies: CurrencyCode[];
  eligibleCountries: string[];
  icon: string;
  requiresPhone: boolean;
  status: 'active' | 'maintenance';
}

export interface NotificationSettings {
  newFollowers: boolean;
  likesAndComments: boolean;
  mentionsAndReplies: boolean;
  directMessages: boolean;
  liveBroadcasts: boolean;
  securityAlerts: boolean;
  payoutsAndEarnings: boolean;
}

export interface PrivacySettings {
  isPrivateAccount: boolean;
  directMessagesPolicy: 'everyone' | 'followers' | 'none';
  showOnlineStatus: boolean;
  allowStoryViewHistory: boolean;
  blockedUsers: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  }[];
}

export interface AppearanceSettings {
  theme: 'dark' | 'light';
  language: SupportedLanguage;
  autoplayVideo: 'always' | 'wifi' | 'never';
  dataSaver: boolean;
  soundOnByDefault: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    activeSessions: {
      id: string;
      device: string;
      browser: string;
      ipLocation: string;
      lastActive: string;
      isCurrent: boolean;
    }[];
  };
}

export interface UserActivityItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'post' | 'gift' | 'wallet' | 'profile_update' | 'security';
  title: string;
  description: string;
  targetId?: string;
  targetTitle?: string;
  targetImage?: string;
  timestamp: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  icon: string;
  category: 'fan' | 'creator' | 'system';
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface FootballMatch {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  currentMinute?: string;
  aiPrediction?: string;
  aiProbabilityHome?: number;
  aiProbabilityDraw?: number;
  aiProbabilityAway?: number;
  totalPredictions?: number;
}

export interface PredictionEntry {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  predictedHome: number;
  predictedAway: number;
  wagerCoins: number;
  status: 'pending' | 'won' | 'lost';
  pointsAwarded?: number;
  createdAt: string;
}

