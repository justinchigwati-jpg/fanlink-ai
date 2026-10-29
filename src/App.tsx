import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyLangProvider } from './context/CurrencyLangContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/FeedView';
import { StarsView } from './components/StarsView';
import { MessagesView } from './components/MessagesView';
import { LiveView } from './components/LiveView';
import { MonetizationView } from './components/MonetizationView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { EvolutionDashboardView } from './components/EvolutionDashboardView';
import { ActivityCenterView } from './components/ActivityCenterView';
import { PostCommentsModal } from './components/PostCommentsModal';
import { ShareModal } from './components/ShareModal';
import { CreatePostModal } from './components/CreatePostModal';
import { WalletModal } from './components/WalletModal';
import { AIStudioPanel } from './components/AIStudioPanel';
import { AuthModal } from './components/AuthModal';
import { VerificationModal } from './components/VerificationModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MatchCenterView } from './components/MatchCenterView';
import { Loader2, Sparkles } from 'lucide-react';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { FanLinkLogo } from './components/FanLinkLogo';
import { 
  INITIAL_POSTS, 
  SEED_CREATORS,
  subscribeToPosts,
  createPostInFirestore,
  toggleLikePostInFirestore,
  addCommentInFirestore,
  submitVerificationRequest,
  submitContentReport
} from './services/dataService';
import { Post, Comment, UserProfile, VerificationRequest } from './types';
import { testFirestoreConnection } from './firebase';

function MainApp() {
  const { currentUser, userProfile, isAdmin, loading, isGuestSession } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [feedSubTab, setFeedSubTab] = useState<'forYou' | 'following' | 'stars'>('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [creatorToView, setCreatorToView] = useState<UserProfile | null>(null);
  const [targetConversationId, setTargetConversationId] = useState<string | null>(null);

  // Core Data State
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('fanlink_posts_v3');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [creators, setCreators] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fanlink_creators_v3');
    return saved ? JSON.parse(saved) : SEED_CREATORS;
  });

  // Comments per post state
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    post_sarah_01: [
      {
        id: 'c_init_1',
        postId: 'post_sarah_01',
        authorId: 'demo_fan_101',
        authorName: 'Thomas Lemoine',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        content: 'Tellement fan de ton énergie Sarah ! Le nouveau clip est magnifique 💚',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  });

  // Active Modals
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Initial connection test and real-time posts listener
  useEffect(() => {
    testFirestoreConnection().catch(console.warn);
    const unsubscribe = subscribeToPosts((livePosts) => {
      setPosts(livePosts);
    });
    return () => unsubscribe();
  }, []);

  // Native Android Hardware Back Button Support (Capacitor)
  useEffect(() => {
    let removeListener: (() => void) | null = null;
    CapacitorApp.addListener('backButton', () => {
      if (activeCommentsPost) { setActiveCommentsPost(null); return; }
      if (activeSharePost) { setActiveSharePost(null); return; }
      if (isCreateOpen) { setIsCreateOpen(false); return; }
      if (isWalletOpen) { setIsWalletOpen(false); return; }
      if (isAIOpen) { setIsAIOpen(false); return; }
      if (isAuthOpen) { setIsAuthOpen(false); return; }
      if (isVerificationOpen) { setIsVerificationOpen(false); return; }
      if (legalModalType) { setLegalModalType(null); return; }

      if (creatorToView) { setCreatorToView(null); return; }
      if (currentTab !== 'feed') { setCurrentTab('feed'); return; }

      // Exit/minimize app if on root feed with no modals open
      CapacitorApp.minimizeApp().catch(() => {});
    }).then(handler => {
      removeListener = () => handler.remove();
    }).catch(err => {
      console.warn('Capacitor backButton not supported on web:', err);
    });

    return () => {
      if (removeListener) removeListener();
    };
  }, [
    activeCommentsPost,
    activeSharePost,
    isCreateOpen,
    isWalletOpen,
    isAIOpen,
    isAuthOpen,
    isVerificationOpen,
    legalModalType,
    creatorToView,
    currentTab
  ]);

  // Handlers
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.likedByCurrentUser;
        toggleLikePostInFirestore(postId, isLiked);
        return {
          ...p,
          likedByCurrentUser: isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      postId,
      authorId: userProfile?.id || 'demo_fan_101',
      authorName: userProfile?.displayName || 'Membre FanLink',
      authorAvatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      authorBadge: userProfile?.badge || 'none',
      content: text,
      createdAt: new Date().toISOString()
    };

    addCommentInFirestore(postId, newComment);

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, commentsCount: p.commentsCount + 1 };
      }
      return p;
    }));
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    createPostInFirestore(newPost);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleSelectCreator = (creator: UserProfile) => {
    setCreatorToView(creator);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMessageWithCreator = (creator: UserProfile) => {
    setTargetConversationId(creator.id === 'sarah_queen' ? 'conv_sarah' : 'conv_fally');
    setCurrentTab('messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030604] flex flex-col items-center justify-center p-6 text-white text-center">
        <FanLinkLogo size="lg" showWordmark={true} showTagline={true} />
        <div className="mt-6 flex items-center gap-2 text-xs text-[#00E676] font-bold">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement sécurisé de FanLink AI...</span>
        </div>
      </div>
    );
  }

  // Welcome / Authentication Gate: if user is not logged in and not in guest exploration
  if (!currentUser && !isGuestSession && !userProfile) {
    return <WelcomeAuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#030604] text-white flex flex-col font-sans selection:bg-[#00E676] selection:text-black">
      
      {/* Offline Alert Indicator */}
      <OfflineIndicator />

      {/* Guest Mode Discovery Bar */}
      {isGuestSession && !currentUser && (
        <div className="bg-gradient-to-r from-[#00E676]/20 via-[#0A100D] to-[#00E676]/10 border-b border-[#00E676]/30 px-3 py-2 text-xs text-white flex items-center justify-between gap-2 z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E676] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-[#A8B5AE]">
              Mode Découverte : <strong className="text-white">Créez votre compte officiel</strong> pour conserver vos FanCoins et interagir avec les stars.
            </span>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-3 py-1 rounded-full bg-[#00E676] text-[#030604] font-black text-[11px] hover:bg-[#00B86B] transition shadow flex-shrink-0"
          >
            Créer mon compte
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        feedSubTab={feedSubTab}
        onSelectFeedSubTab={(sub) => setFeedSubTab(sub)}
        onOpenLive={() => {
          setCurrentTab('live');
          setCreatorToView(null);
        }}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setCreatorToView(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body Router */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {currentTab === 'feed' && (
          <FeedView
            posts={posts}
            creators={creators}
            feedSubTab={feedSubTab}
            onLikePost={handleLikePost}
            onOpenComments={(post) => setActiveCommentsPost(post)}
            onOpenShare={(post) => setActiveSharePost(post)}
            onSelectCreator={handleSelectCreator}
            onOpenLive={() => setCurrentTab('live')}
            onOpenCreate={() => setIsCreateOpen(true)}
            searchQuery={searchQuery}
          />
        )}

        {currentTab === 'matches' && (
          <MatchCenterView
            onOpenLiveRoom={(roomTitle) => {
              setCurrentTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        )}

        {currentTab === 'discover' && (
          <StarsView
            creators={creators}
            onSelectCreator={handleSelectCreator}
            onOpenGift={(creator) => {
              setIsWalletOpen(true);
            }}
            onRequestVerification={() => setIsVerificationOpen(true)}
          />
        )}

        {currentTab === 'messages' && (
          <MessagesView
            onOpenWallet={() => setIsWalletOpen(true)}
            onReportUser={(targetId, reason) => {
              submitContentReport({
                reporterId: userProfile?.id,
                targetType: 'user',
                targetId,
                reason
              });
            }}
            targetConversationId={targetConversationId}
          />
        )}

        {currentTab === 'live' && (
          <LiveView
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        )}

        {currentTab === 'monetization' && (
          <MonetizationView
            onRequestVerification={() => setIsVerificationOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            posts={posts}
            onDeletePost={handleDeletePost}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            creatorToView={creatorToView}
            onBack={creatorToView ? () => setCreatorToView(null) : undefined}
            onOpenWallet={() => setIsWalletOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenTerms={() => setLegalModalType('terms')}
            onOpenPrivacy={() => setLegalModalType('privacy')}
            onOpenMonetization={() => setCurrentTab('monetization')}
            onOpenAdmin={() => setCurrentTab('admin')}
            onOpenMessageWithCreator={handleOpenMessageWithCreator}
            onOpenSettings={() => {
              setCurrentTab('settings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEvolution={() => {
              setCurrentTab('evolution');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenActivityCenter={() => {
              setCurrentTab('activity-center');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            posts={posts}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            onBack={() => {
              setCurrentTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVerification={() => setIsVerificationOpen(true)}
            onOpenTerms={() => setLegalModalType('terms')}
            onOpenPrivacy={() => setLegalModalType('privacy')}
            onOpenEvolution={() => {
              setCurrentTab('evolution');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'evolution' && (
          <EvolutionDashboardView
            onBack={() => {
              setCurrentTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            posts={posts}
            creators={creators}
            onSelectCreator={handleSelectCreator}
            onOpenMonetization={() => setCurrentTab('monetization')}
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        )}

        {currentTab === 'activity-center' && (
          <ActivityCenterView
            onBack={() => {
              setCurrentTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            posts={posts}
            onSelectCreator={handleSelectCreator}
          />
        )}
      </main>

      {/* Global Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setCreatorToView(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        unreadMessagesCount={1}
      />

      {/* Global Modals */}
      {activeCommentsPost && (
        <PostCommentsModal
          post={activeCommentsPost}
          comments={commentsMap[activeCommentsPost.id] || []}
          onClose={() => setActiveCommentsPost(null)}
          onAddComment={handleAddComment}
        />
      )}

      {activeSharePost && (
        <ShareModal
          post={activeSharePost}
          onClose={() => setActiveSharePost(null)}
        />
      )}

      {isCreateOpen && (
        <CreatePostModal
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {isWalletOpen && (
        <WalletModal
          onClose={() => setIsWalletOpen(false)}
        />
      )}

      {isAIOpen && (
        <AIStudioPanel
          onClose={() => setIsAIOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {isVerificationOpen && (
        <VerificationModal
          onClose={() => setIsVerificationOpen(false)}
          onSubmit={(req) => {
            submitVerificationRequest({
              ...req,
              userId: userProfile?.id || 'demo_fan_101',
              status: 'pending'
            });
          }}
        />
      )}

      {legalModalType && (
        <TermsPrivacyModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <CurrencyLangProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </CurrencyLangProvider>
  );
}
