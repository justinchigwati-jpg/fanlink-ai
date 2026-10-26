import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, AccountType } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isGuestSession: boolean;
  continueAsGuest: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, username: string, type: AccountType) => Promise<void>;
  loginAsGuest: (name: string, username: string, type?: AccountType) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  deductCoins: (amount: number) => boolean;
  isDemoMode: boolean;
  setDemoUser: (persona: 'fan' | 'creator' | 'admin') => void;
}

export const DEMO_USERS: Record<string, UserProfile> = {
  fan: {
    id: 'demo_fan_101',
    email: 'fan.paris@fanlink.ai',
    displayName: 'Thomas Lemoine',
    username: 'thomas_fan92',
    accountType: 'fan',
    bio: 'Passionné de musique Afrobeat, de football et de nouvelles technos IA ⚡ Membre actif FanLink.',
    country: 'France',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    isVerified: false,
    badge: 'active_fan',
    followersCount: 142,
    followingCount: 38,
    postsCount: 12,
    coinsBalance: 450,
    creatorEarningsEur: 0,
    pendingEarningsEur: 0,
    preferredLanguage: 'fr',
    preferredCurrency: 'EUR',
    createdAt: new Date().toISOString()
  },
  creator: {
    id: 'demo_creator_202',
    email: 'kemi.sounds@fanlink.ai',
    displayName: 'Kémi AfroPulse',
    username: 'kemi_pulse',
    accountType: 'artist',
    bio: 'Chanteuse & Productrice Afro-Fusion 🎵 | 2x Disque d\'Or | Prochain live exclusif vendredi 20h !',
    country: 'Côte d\'Ivoire',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 84200,
    followingCount: 114,
    postsCount: 164,
    coinsBalance: 2800,
    creatorEarningsEur: 1450.00,
    pendingEarningsEur: 320.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'XOF',
    createdAt: new Date().toISOString()
  },
  admin: {
    id: 'demo_admin_303',
    email: 'justinchigwati@gmail.com',
    displayName: 'Justin Chigwati (Admin)',
    username: 'admin_justin',
    accountType: 'creator',
    bio: 'Super Administrateur & Responsable Sécurité FanLink AI.',
    country: 'International',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    isVerified: true,
    badge: 'star_verified',
    followersCount: 12500,
    followingCount: 12,
    postsCount: 45,
    coinsBalance: 9999,
    creatorEarningsEur: 4200.00,
    pendingEarningsEur: 150.00,
    preferredLanguage: 'fr',
    preferredCurrency: 'EUR',
    createdAt: new Date().toISOString()
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  // Real user profile: only restore valid saved profiles that are not the hardcoded demo placeholder
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fanlink_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'demo_fan_101') {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isGuestSession, setIsGuestSession] = useState<boolean>(() => {
    return localStorage.getItem('fanlink_guest_mode') === 'true';
  });

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        setIsDemoMode(false);
        setIsGuestSession(false);
        localStorage.removeItem('fanlink_guest_mode');
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setUserProfile(data);
            localStorage.setItem('fanlink_user_profile', JSON.stringify(data));
          } else {
            // New user registration profile initialization
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Utilisateur FanLink',
              username: `fan_${firebaseUser.uid.substring(0, 6)}`,
              accountType: 'fan',
              bio: 'Bienvenue sur mon profil FanLink AI !',
              country: 'International',
              avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
              isVerified: firebaseUser.email === 'justinchigwati@gmail.com',
              badge: firebaseUser.email === 'justinchigwati@gmail.com' ? 'star_verified' : 'active_fan',
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
              coinsBalance: 150, // Welcome gift of 150 FanCoins!
              creatorEarningsEur: 0,
              pendingEarningsEur: 0,
              preferredLanguage: 'fr',
              preferredCurrency: 'EUR',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile).catch(console.warn);
            setUserProfile(newProfile);
            localStorage.setItem('fanlink_user_profile', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Firestore initial fetch fallback:', err);
        }
      } else {
        // If not in an active guest session, userProfile is null (shows Auth Gate)
        const isGuest = localStorage.getItem('fanlink_guest_mode') === 'true';
        if (!isGuest) {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const continueAsGuest = () => {
    const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
    const guestProfile: UserProfile = {
      id: guestId,
      email: 'invite@fanlink.ai',
      displayName: 'Invité Découverte',
      username: `fan_${Math.floor(Math.random() * 9000 + 1000)}`,
      accountType: 'fan',
      bio: 'Visiteur en mode découverte sur FanLink AI.',
      country: 'France',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      isVerified: false,
      badge: 'active_fan',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      coinsBalance: 50,
      creatorEarningsEur: 0,
      pendingEarningsEur: 0,
      preferredLanguage: 'fr',
      preferredCurrency: 'EUR',
      createdAt: new Date().toISOString()
    };
    setUserProfile(guestProfile);
    setIsGuestSession(true);
    localStorage.setItem('fanlink_guest_mode', 'true');
    localStorage.setItem('fanlink_user_profile', JSON.stringify(guestProfile));
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      setIsGuestSession(false);
      localStorage.removeItem('fanlink_guest_mode');
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setIsGuestSession(false);
      localStorage.removeItem('fanlink_guest_mode');
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, username: string, type: AccountType) => {
    try {
      setIsGuestSession(false);
      localStorage.removeItem('fanlink_guest_mode');
      
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = cred.user.uid;
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const newProfile: UserProfile = {
        id: uid,
        email,
        displayName: name,
        username: cleanUsername,
        accountType: type,
        bio: type === 'creator' || type === 'artist' || type === 'athlete' 
          ? 'Créateur certifiable sur FanLink AI.' 
          : 'Membre passionné de la communauté FanLink.',
        country: 'France',
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=200&auto=format&fit=crop&q=80`,
        bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        isVerified: email === 'justinchigwati@gmail.com',
        badge: email === 'justinchigwati@gmail.com' ? 'star_verified' : (type === 'creator' ? 'none' : 'active_fan'),
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        coinsBalance: 150, // Welcome gift of 150 FanCoins
        creatorEarningsEur: 0,
        pendingEarningsEur: 0,
        preferredLanguage: 'fr',
        preferredCurrency: 'EUR',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', uid), newProfile);
      } catch (firestoreErr) {
        console.warn('Firestore setDoc user profile warning:', firestoreErr);
      }

      setUserProfile(newProfile);
      localStorage.setItem('fanlink_user_profile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginAsGuest = async (name: string, username: string, type: AccountType = 'fan') => {
    try {
      let uid = `user_${Date.now()}`;
      try {
        const cred = await signInAnonymously(auth);
        uid = cred.user.uid;
      } catch (authErr) {
        console.warn('Anonymous auth fallback:', authErr);
      }

      const cleanUsername = (username || `fan_${uid.substring(0, 6)}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
      const newProfile: UserProfile = {
        id: uid,
        email: `${cleanUsername}@fanlink.ai`,
        displayName: name || 'Supporter FanLink',
        username: cleanUsername,
        accountType: type,
        bio: 'Supporter & Membre actif FanLink AI ⚡',
        country: 'France',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
        isVerified: false,
        badge: 'active_fan',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        coinsBalance: 150,
        creatorEarningsEur: 0,
        pendingEarningsEur: 0,
        preferredLanguage: 'fr',
        preferredCurrency: 'EUR',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', uid), newProfile);
      } catch (e) {
        console.warn('User profile doc set warning:', e);
      }

      setUserProfile(newProfile);
      localStorage.setItem('fanlink_user_profile', JSON.stringify(newProfile));
    } catch (err) {
      console.error('Guest login failed:', err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
    setCurrentUser(null);
    setUserProfile(null);
    setIsGuestSession(false);
    setIsDemoMode(false);
    localStorage.removeItem('fanlink_user_profile');
    localStorage.removeItem('fanlink_guest_mode');
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    localStorage.setItem('fanlink_user_profile', JSON.stringify(updated));

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch (e) {
        console.warn('Update firestore error:', e);
      }
    }
  };

  const addCoins = async (amount: number) => {
    if (!userProfile) return;
    const updated = { ...userProfile, coinsBalance: (userProfile.coinsBalance || 0) + amount };
    setUserProfile(updated);
    localStorage.setItem('fanlink_user_profile', JSON.stringify(updated));
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), { coinsBalance: updated.coinsBalance }, { merge: true });
      } catch (err) {
        console.warn('Could not sync coins:', err);
      }
    }
  };

  const deductCoins = (amount: number): boolean => {
    if (!userProfile || (userProfile.coinsBalance || 0) < amount) {
      return false;
    }
    const updated = { ...userProfile, coinsBalance: (userProfile.coinsBalance || 0) - amount };
    setUserProfile(updated);
    localStorage.setItem('fanlink_user_profile', JSON.stringify(updated));
    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.uid), { coinsBalance: updated.coinsBalance }, { merge: true }).catch(console.warn);
    }
    return true;
  };

  const setDemoUser = (persona: 'fan' | 'creator' | 'admin') => {
    setIsDemoMode(true);
    const chosen = DEMO_USERS[persona] || DEMO_USERS.fan;
    setUserProfile(chosen);
    localStorage.setItem('fanlink_user_profile', JSON.stringify(chosen));
  };

  const isAdmin = (userProfile?.email === 'justinchigwati@gmail.com') || (currentUser?.email === 'justinchigwati@gmail.com') || (userProfile?.id === 'demo_admin_303');

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isAdmin,
      isGuestSession,
      continueAsGuest,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      loginAsGuest,
      resetPassword,
      logout,
      updateProfileData,
      addCoins,
      deductCoins,
      isDemoMode,
      setDemoUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
