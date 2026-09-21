import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Shop,
  Product,
  Category,
  CartItem,
  Order,
  SubOrder,
  Transaction,
  Review,
  AuditLog,
  DirectMessage,
  PlatformSettings,
  PaymentOperator,
  PaymentStatus,
  SubOrderStatus,
  AdminActionLog,
  SettingsHistoryEntry,
  Dispute,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
} from '../data/initialData';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

const GUEST_USER: User = {
  id: '',
  name: 'Visiteur',
  email: '',
  phone: '',
  role: 'buyer',
  status: 'active',
  createdAt: new Date().toISOString(),
};

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Authentication & Current User
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  authLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'buyer' | 'seller';
    address?: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoUser: (role: UserRole | 'pending_seller') => void;
  applyAsSeller: (
    name: string,
    email: string,
    phone: string,
    shopName: string,
    description: string,
    pickupLocation: string,
    pickupHours: string,
    city: string,
    lumicash: string,
    ecocash: string,
    idCardUrl?: string,
    idCardSelfieUrl?: string
  ) => Promise<void>;

  // Auth Modal Controls
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signin' | 'signup', role?: 'buyer' | 'seller') => void;
  closeAuthModal: () => void;

  // Platform Settings
  settings: PlatformSettings;
  updateCommissionRate: (rate: number) => Promise<void>;
  updateSettings: (settings: PlatformSettings) => Promise<void>;
  settingsHistory: SettingsHistoryEntry[];

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => Promise<void>;
  updateProduct: (idOrProduct: string | Product, updates?: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductPublished: (id: string) => Promise<void>;
  unpublishProductWithReason: (productId: string, reason: string) => Promise<void>;

  // Shops
  shops: Shop[];
  updateShop: (idOrShop: string | Shop, updates?: Partial<Shop>) => Promise<void>;
  getShopBySellerId: (sellerId: string) => Shop | undefined;

  // Users Management (Admin)
  users: User[];
  toggleUserStatus: (userId: string) => Promise<void>;
  toggleUserSuspension: (userId: string) => Promise<void>;
  approveSeller: (userId: string) => Promise<void>;
  rejectSeller: (userId: string, reason?: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createAdminAccount: (
    nameOrData:
      | string
      | {
          name: string;
          email: string;
          phone?: string;
          password?: string;
          passwordConfirm?: string;
          currentAdminPasswordConfirmation?: string;
        },
    email?: string,
    currentAdminPasswordConfirmation?: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Disputes & Moderation
  disputes: Dispute[];
  resolveDispute: (disputeId: string, resolutionNote: string) => Promise<void>;
  deleteReviewWithReason: (reviewId: string, reason: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartGroupedByVendor: {
    vendorId: string;
    shop: Shop | undefined;
    items: CartItem[];
    subtotal: number;
  }[];

  // Orders & SubOrders
  orders: Order[];
  updateSubOrderStatus: (subOrderId: string, status: SubOrderStatus, reason?: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;

  // Transactions & Mobile Money
  transactions: Transaction[];
  createOrderWithMobileMoney: (
    operator: PaymentOperator,
    phoneNumber: string
  ) => Promise<{ success: boolean; order?: Order; transaction?: Transaction; error?: string }>;
  refundTransaction: (transactionId: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;
  replyToReview: (reviewId: string, reply: string) => Promise<void>;

  // Audit & Admin Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string, severity?: 'info' | 'warning' | 'critical') => Promise<void>;
  adminActionLogs: AdminActionLog[];
  logAdminAction: (action: string, target: string, details: string) => Promise<void>;

  // Messaging
  messages: DirectMessage[];
  sendMessage: (shopId: string, recipientId: string, text: string, subOrderId?: string) => Promise<void>;
  markMessagesAsRead: (shopId: string) => Promise<void>;

  // Active View / Navigation State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('esoko_theme');
    return saved ? saved === 'dark' : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('esoko_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Synchronize 'dark' class on root html document for Tailwind dark variant
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

// Root Administrator Profile constants
const ROOT_ADMIN_USER: User = {
  id: 'admin_esoko_root',
  name: 'Administrateur Général E-Soko',
  email: 'admin@esoka.com',
  phone: '+257 69 00 00 00',
  role: 'admin',
  status: 'active',
  sellerStatus: 'approved',
  address: 'Bujumbura Mairie, Burundi',
  createdAt: '2026-09-21T06:00:00.000Z',
};

const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === 'admin@esoka.com' ||
    normalized === 'admin@esoko.com' ||
    normalized === 'ttrfamilypro@gmail.com'
  );
};

  // Auth State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedAdmin = localStorage.getItem('esoko_admin_session');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        if (parsed && parsed.role === 'admin') {
          return parsed;
        }
      }
    } catch {}
    return GUEST_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('esoko_admin_session');
    } catch {
      return false;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ mode: 'signin' | 'signup'; role: 'buyer' | 'seller' }>({
    mode: 'signin',
    role: 'buyer',
  });

  // Navigation State
  const [activeView, setActiveView] = useState<string>('catalog');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Firestore Real-Time Collections State
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminActionLogs, setAdminActionLogs] = useState<AdminActionLog[]>([]);
  const [settingsHistory, setSettingsHistory] = useState<SettingsHistoryEntry[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  // Cart (Local Client Storage for immediate UX)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('esoko_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('esoko_cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Firebase Authentication State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      // If a local administrator session exists, maintain it
      const savedAdmin = localStorage.getItem('esoko_admin_session');
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          if (parsed && parsed.role === 'admin') {
            setCurrentUser(parsed);
            setIsAuthenticated(true);
            setAuthLoading(false);
            return;
          }
        } catch {}
      }

      if (!fbUser) {
        if (!localStorage.getItem('esoko_admin_session')) {
          setCurrentUser(GUEST_USER);
          setIsAuthenticated(false);
        }
        setAuthLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        const isSuperAdminEmail = isAdminEmail(fbUser.email);

        if (userDocSnap.exists()) {
          let userData = userDocSnap.data() as User;
          // Auto-ensure Super Admin rights for designated project administrator
          if (isSuperAdminEmail && userData.role !== 'admin') {
            userData = { ...userData, role: 'admin' };
            await updateDoc(userDocRef, { role: 'admin' }).catch(console.warn);
            await setDoc(doc(db, 'admins', fbUser.uid), { email: fbUser.email, role: 'admin', assignedAt: new Date().toISOString() }).catch(console.warn);
          }
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else {
          // Initialize fresh user profile
          const defaultRole: UserRole = isSuperAdminEmail ? 'admin' : 'buyer';
          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || (isSuperAdminEmail ? 'Super Administrateur E-Soko' : fbUser.email?.split('@')[0] || 'Utilisateur E-Soko'),
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '+257 69 00 00 00',
            role: defaultRole,
            status: 'active',
            sellerStatus: isSuperAdminEmail ? 'approved' : 'none',
            avatarUrl: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };

          await setDoc(userDocRef, newUser).catch(console.warn);
          if (isSuperAdminEmail) {
            await setDoc(doc(db, 'admins', fbUser.uid), { email: fbUser.email, role: 'admin', assignedAt: new Date().toISOString() }).catch(console.warn);
          }
          setCurrentUser(newUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error fetching user profile from Firestore:', err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore Listeners
  useEffect(() => {
    // Platform Settings Listener
    const unsubSettings = onSnapshot(
      doc(db, 'platform_settings', 'global'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as PlatformSettings);
        } else {
          // Auto-seed default settings
          setDoc(doc(db, 'platform_settings', 'global'), INITIAL_SETTINGS).catch((err) => {
            console.warn('Could not auto-seed settings:', err);
          });
        }
      },
      (error) => {
        console.warn('Settings listener error:', error);
      }
    );

    // Categories Listener
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const catList: Category[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Category, 'id'>),
          }));
          setCategories(catList);
        } else {
          // Auto-seed baseline categories if empty
          INITIAL_CATEGORIES.forEach((cat) => {
            setDoc(doc(db, 'categories', cat.id), cat).catch(console.warn);
          });
          setCategories(INITIAL_CATEGORIES);
        }
      },
      (error) => console.warn('Categories listener error:', error)
    );

    // Products Listener
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const prodList: Product[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Product, 'id'>),
        }));
        setProducts(prodList);
      },
      (error) => console.warn('Products listener error:', error)
    );

    // Shops Listener
    const unsubShops = onSnapshot(
      collection(db, 'shops'),
      (snapshot) => {
        const shopList: Shop[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Shop, 'id'>),
        }));
        setShops(shopList);
      },
      (error) => console.warn('Shops listener error:', error)
    );

    // Orders Listener
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const orderList: Order[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Order, 'id'>),
        }));
        setOrders(orderList);
      },
      (error) => console.warn('Orders listener error:', error)
    );

    // Transactions Listener
    const unsubTransactions = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const txList: Transaction[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Transaction, 'id'>),
        }));
        setTransactions(txList);
      },
      (error) => console.warn('Transactions listener error:', error)
    );

    // Reviews Listener
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        const revList: Review[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Review, 'id'>),
        }));
        setReviews(revList);
      },
      (error) => console.warn('Reviews listener error:', error)
    );

    // Messages Listener
    const unsubMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        const msgList: DirectMessage[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<DirectMessage, 'id'>),
        }));
        setMessages(msgList);
      },
      (error) => console.warn('Messages listener error:', error)
    );

    return () => {
      unsubSettings();
      unsubCategories();
      unsubProducts();
      unsubShops();
      unsubOrders();
      unsubTransactions();
      unsubReviews();
      unsubMessages();
    };
  }, []);

  // 2.b. Real-time Admin-Only Firestore Listeners (Requirement 2.3 & 4.1)
  // Aucune donnée admin n'est chargée tant que le rôle n'est pas confirmé admin
  useEffect(() => {
    if (currentUser.role !== 'admin') {
      setUsers([]);
      setAdminActionLogs([]);
      setSettingsHistory([]);
      setDisputes([]);
      return;
    }

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usrList: User[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<User, 'id'>),
        }));
        setUsers(usrList);
      },
      (error) => console.warn('Admin users listener error:', error)
    );

    const unsubAdminLogs = onSnapshot(
      collection(db, 'admin_logs'),
      (snapshot) => {
        const logList: AdminActionLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AdminActionLog, 'id'>),
        }));
        setAdminActionLogs(
          logList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      },
      (error) => console.warn('Admin logs listener error:', error)
    );

    const unsubSettingsHistory = onSnapshot(
      collection(db, 'settings_history'),
      (snapshot) => {
        const list: SettingsHistoryEntry[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SettingsHistoryEntry, 'id'>),
        }));
        setSettingsHistory(
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      },
      (error) => console.warn('Settings history listener error:', error)
    );

    const unsubDisputes = onSnapshot(
      collection(db, 'disputes'),
      (snapshot) => {
        const list: Dispute[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Dispute, 'id'>),
        }));
        setDisputes(list);
      },
      (error) => console.warn('Disputes listener error:', error)
    );

    const unsubAudit = onSnapshot(
      collection(db, 'audit_logs'),
      (snapshot) => {
        const logList: AuditLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AuditLog, 'id'>),
        }));
        setAuditLogs(
          logList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      },
      (error) => console.warn('Audit logs listener error:', error)
    );

    return () => {
      unsubUsers();
      unsubAdminLogs();
      unsubSettingsHistory();
      unsubDisputes();
      unsubAudit();
    };
  }, [currentUser.role]);

  // Authentication Actions
  const signInWithEmail = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Direct Administrator Credentials Check (admin@esoka.com / ESOKA2026)
    if (normalizedEmail === 'admin@esoka.com' || normalizedEmail === 'admin@esoko.com') {
      if (pass !== 'ESOKA2026') {
        throw new Error('Mot de passe administrateur incorrect. Veuillez saisir ESOKA2026.');
      }

      const adminUser: User = {
        ...ROOT_ADMIN_USER,
        email: normalizedEmail,
      };

      localStorage.setItem('esoko_admin_session', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      setActiveView('admin_dashboard');

      // Sync Firestore admin record in background
      setDoc(doc(db, 'users', adminUser.id), adminUser).catch(console.warn);
      setDoc(doc(db, 'admins', adminUser.id), {
        email: normalizedEmail,
        role: 'admin',
        assignedAt: new Date().toISOString(),
      }).catch(console.warn);

      addAuditLog('CONNEXION_ADMIN', `Connexion réussie de l’administrateur (${normalizedEmail})`).catch(console.warn);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error('La connexion par e-mail direct nécessite l’identifiant administrateur ou la connexion Google.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async ({
    email,
    password,
    name,
    phone,
    role,
    address,
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'buyer' | 'seller';
    address?: string;
  }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isSuperAdmin = isAdminEmail(normalizedEmail);

    if (isSuperAdmin && password === 'ESOKA2026') {
      const adminUser: User = {
        ...ROOT_ADMIN_USER,
        name: name || ROOT_ADMIN_USER.name,
        email: normalizedEmail,
        phone: phone || ROOT_ADMIN_USER.phone,
        address: address || ROOT_ADMIN_USER.address,
      };

      localStorage.setItem('esoko_admin_session', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      setActiveView('admin_dashboard');

      setDoc(doc(db, 'users', adminUser.id), adminUser).catch(console.warn);
      setDoc(doc(db, 'admins', adminUser.id), {
        email: normalizedEmail,
        role: 'admin',
        assignedAt: new Date().toISOString(),
      }).catch(console.warn);

      addAuditLog('INSCRIPTION_ADMIN', `Création/Activation du compte administrateur: ${normalizedEmail}`).catch(console.warn);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const uid = cred.user.uid;

      const newUser: User = {
        id: uid,
        name,
        email: normalizedEmail,
        phone,
        role: isSuperAdmin ? 'admin' : role,
        status: 'active',
        sellerStatus: role === 'seller' ? 'pending' : 'none',
        address,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', uid), newUser);
      if (isSuperAdmin) {
        await setDoc(doc(db, 'admins', uid), { email: normalizedEmail, role: 'admin', assignedAt: new Date().toISOString() });
      }
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      await addAuditLog('INSCRIPTION', `Nouvel utilisateur inscrit: ${name} (${role})`);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        const localId = `usr_${Date.now()}`;
        const newUser: User = {
          id: localId,
          name,
          email: normalizedEmail,
          phone,
          role: isSuperAdmin ? 'admin' : role,
          status: 'active',
          sellerStatus: role === 'seller' ? 'pending' : 'none',
          address,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', localId), newUser).catch(console.warn);
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        await addAuditLog('INSCRIPTION', `Nouvel utilisateur inscrit: ${name} (${role})`);
        return;
      }
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem('esoko_admin_session');
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(GUEST_USER);
    setIsAuthenticated(false);
    setActiveView('catalog');
  };

  // Helper for mock demo fallback
  const switchDemoUser = (targetRole: UserRole | 'pending_seller') => {
    openAuthModal('signin');
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', role: 'buyer' | 'seller' = 'buyer') => {
    setAuthModalConfig({ mode, role });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Centralized Admin Actions Logging (Requirement 4.1, 4.2, 4.3)
  const logAdminAction = async (action: string, target: string, details: string) => {
    if (currentUser.role !== 'admin') return;
    const logId = `admin_log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const logEntry: AdminActionLog = {
      id: logId,
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      action,
      target,
      details,
      timestamp: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'admin_logs', logId), logEntry);
      setAdminActionLogs((prev) => [logEntry, ...prev.filter((l) => l.id !== logId)]);
    } catch (e) {
      console.warn('Could not write to admin_logs:', e);
    }
    try {
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: 'admin',
        action,
        details: `[Cible: ${target}] ${details}`,
        severity: action.includes('REJET') || action.includes('SUSPENSION') || action.includes('SUPPRESSION') ? 'warning' : 'info',
        timestamp: logEntry.timestamp,
      });
    } catch (e) {
      console.warn('Could not write to audit_logs:', e);
    }
  };

  // Create new Admin Account with confirmation (Requirement 1.4 & 3.4 & 3.6)
  const createAdminAccount = async (
    nameOrData:
      | string
      | {
          name: string;
          email: string;
          phone?: string;
          password?: string;
          passwordConfirm?: string;
          currentAdminPasswordConfirmation?: string;
        },
    emailParam?: string,
    currentAdminPasswordConfirmationParam?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Seul un administrateur connecté peut créer un autre administrateur.' };
    }

    let adminName = '';
    let adminEmail = '';
    let adminPhone = '+257 69 00 00 00';

    if (typeof nameOrData === 'object') {
      adminName = nameOrData.name;
      adminEmail = nameOrData.email;
      if (nameOrData.phone) adminPhone = nameOrData.phone;
    } else {
      adminName = nameOrData;
      adminEmail = emailParam || '';
    }

    if (!adminEmail.trim()) {
      return { success: false, error: "L'adresse email est requise." };
    }

    const normalizedEmail = adminEmail.trim().toLowerCase();
    const newAdminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newAdminUser: User = {
      id: newAdminId,
      name: adminName.trim(),
      email: normalizedEmail,
      phone: adminPhone.trim(),
      role: 'admin',
      status: 'active',
      sellerStatus: 'approved',
      address: 'Bujumbura Mairie, Burundi',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', newAdminId), newAdminUser);
      await setDoc(doc(db, 'admins', newAdminId), {
        email: normalizedEmail,
        role: 'admin',
        assignedBy: currentUser.email,
        assignedAt: new Date().toISOString(),
      });
      await logAdminAction(
        'CREATION_ADMIN',
        normalizedEmail,
        `Création du compte administrateur pour ${adminName} (${normalizedEmail}) habilité par ${currentUser.email}.`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de la création du compte administrateur.' };
    }
  };

  // Apply as Seller with mandatory KYC documents (Requirement 3.2)
  const applyAsSeller = async (
    name: string,
    email: string,
    phone: string,
    shopName: string,
    description: string,
    pickupLocation: string,
    pickupHours: string,
    city: string,
    lumicash: string,
    ecocash: string,
    idCardUrl?: string,
    idCardSelfieUrl?: string
  ) => {
    if (!isAuthenticated || !auth.currentUser) {
      openAuthModal('signup', 'seller');
      return;
    }

    const userId = auth.currentUser.uid;
    const shopId = `shop_${Date.now()}`;

    // Le compte reste strictement ACHETEUR (role: 'buyer') tant que l'admin ne l'a pas validé
    const updatedUserData: Partial<User> = {
      role: 'buyer',
      sellerStatus: 'pending',
      sellerApplicationReason: description,
      sellerApplicationDate: new Date().toISOString(),
      idCardUrl: idCardUrl || '',
      idCardSelfieUrl: idCardSelfieUrl || '',
      phone,
      address: `${city}, ${pickupLocation}`,
    };

    const newShop: Shop = {
      id: shopId,
      sellerId: userId,
      sellerName: name,
      name: shopName,
      description,
      logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      pickupLocation,
      pickupHours,
      city,
      phone,
      lumicashNumber: lumicash,
      ecocashNumber: ecocash,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, 'users', userId), updatedUserData);
      await setDoc(doc(db, 'shops', shopId), newShop);
      setCurrentUser((prev) => ({ ...prev, ...updatedUserData }));
      setActiveView('seller_dashboard');
      await addAuditLog(
        'DEMANDE_VENDEUR',
        `Nouvelle demande de boutique: "${shopName}" par ${name} avec pièces CNI et selfie. En attente de validation admin.`,
        'info'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'users/shops');
    }
  };

  // Platform Settings Management with Audit & History (Requirement 3.6 & 4.2)
  const updateCommissionRate = async (rate: number) => {
    const oldRate = settings.commissionRate;
    const historyId = `hist_${Date.now()}`;
    const historyEntry: SettingsHistoryEntry = {
      id: historyId,
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      changedField: 'commissionRate',
      oldValue: `${oldRate}%`,
      newValue: `${rate}%`,
      timestamp: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, 'platform_settings', 'global'), { commissionRate: rate });
      await setDoc(doc(db, 'settings_history', historyId), historyEntry);
      setSettingsHistory((prev) => [historyEntry, ...prev]);
      await logAdminAction(
        'MODIFICATION_COMMISSION',
        'Paramètres Plateforme',
        `Taux de commission ajusté de ${oldRate}% à ${rate}%.`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'platform_settings/global');
    }
  };

  const updateSettings = async (newSettings: PlatformSettings) => {
    try {
      await setDoc(doc(db, 'platform_settings', 'global'), newSettings);
      await addAuditLog('PARAMETRES_PLATEFORME', 'Paramètres nationaux mis à jour.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'platform_settings/global');
    }
  };

  // Categories CRUD
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newCatId = `cat_${Date.now()}`;
    const newCat: Category = { ...cat, id: newCatId };
    try {
      await setDoc(doc(db, 'categories', newCatId), newCat);
      await addAuditLog('AJOUT_CATEGORIE', `Catégorie créée: ${cat.name}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `categories/${newCatId}`);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
      await addAuditLog('MODIFICATION_CATEGORIE', `Catégorie ${id} modifiée.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      await addAuditLog('SUPPRESSION_CATEGORIE', `Catégorie ${id} supprimée.`, 'warning');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  // Products CRUD
  const addProduct = async (p: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    const prodId = `prod_${Date.now()}`;
    const newProd: Product = {
      ...p,
      id: prodId,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'products', prodId), newProd);
      await addAuditLog('AJOUT_PRODUIT', `Produit "${p.name}" mis en vente par ${p.shopName}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${prodId}`);
    }
  };

  const updateProduct = async (idOrProduct: string | Product, updates?: Partial<Product>) => {
    const id = typeof idOrProduct === 'string' ? idOrProduct : idOrProduct.id;
    const data = typeof idOrProduct === 'string' ? updates || {} : idOrProduct;
    try {
      await updateDoc(doc(db, 'products', id), data);
      await addAuditLog('MODIFICATION_PRODUIT', `Produit ${id} mis à jour`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      await addAuditLog('SUPPRESSION_PRODUIT', `Produit ${id} supprimé`, 'warning');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const toggleProductPublished = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    try {
      await updateDoc(doc(db, 'products', id), { isPublished: !prod.isPublished });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  // Moderation: Unpublish product with mandatory reason (Requirement 3.3)
  const unpublishProductWithReason = async (productId: string, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    try {
      await updateDoc(doc(db, 'products', productId), {
        isPublished: false,
        unpublishReason: reason,
      });
      await logAdminAction(
        'DEPUBLICATION_PRODUIT',
        prod.name,
        `Produit "${prod.name}" (Boutique: ${prod.shopName}) dépublié. Motif obligatoire: ${reason}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
    }
  };

  // Moderation: Delete review with mandatory reason (Requirement 3.5)
  const deleteReviewWithReason = async (reviewId: string, reason: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      await logAdminAction(
        'SUPPRESSION_AVIS',
        `Avis ${reviewId}`,
        `Avis supprimé par l’administration. Motif obligatoire: ${reason}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  // Moderation: Resolve Dispute (Requirement 3.5)
  const resolveDispute = async (disputeId: string, resolutionNote: string) => {
    try {
      await updateDoc(doc(db, 'disputes', disputeId), {
        status: 'resolved',
        resolutionNote,
        updatedAt: new Date().toISOString(),
      });
      await logAdminAction(
        'RESOLUTION_LITIGE',
        `Litige #${disputeId.slice(-6)}`,
        `Litige résolu avec la décision: ${resolutionNote}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `disputes/${disputeId}`);
    }
  };

  // Shops CRUD
  const updateShop = async (idOrShop: string | Shop, updates?: Partial<Shop>) => {
    const id = typeof idOrShop === 'string' ? idOrShop : idOrShop.id;
    const data = typeof idOrShop === 'string' ? updates || {} : idOrShop;
    try {
      await updateDoc(doc(db, 'shops', id), data);
      await addAuditLog('MODIFICATION_BOUTIQUE', `Boutique ${id} modifiée`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `shops/${id}`);
    }
  };

  const getShopBySellerId = (sellerId: string) => {
    return shops.find((s) => s.sellerId === sellerId);
  };

  // Users Management (Admin)
  const toggleUserStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await updateDoc(doc(db, 'users', userId), { status: nextStatus });
      await logAdminAction(
        nextStatus === 'suspended' ? 'SUSPENSION_COMPTE' : 'REACTIVATION_COMPTE',
        user.name,
        `Statut du compte utilisateur ${user.email} basculé à "${nextStatus}".`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const toggleUserSuspension = async (userId: string) => {
    await toggleUserStatus(userId);
  };

  // Approve Seller Application (Requirement 3.2)
  const approveSeller = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const shop = shops.find((s) => s.sellerId === userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        sellerStatus: 'approved',
        role: 'seller', // Le rôle passe de 'buyer' à 'seller'
      });
      if (shop) {
        await updateDoc(doc(db, 'shops', shop.id), { isVerified: true });
      }
      await logAdminAction(
        'VALIDATION_VENDEUR',
        user?.name || userId,
        `Demande vendeur approuvée. Statut passé à "approved" et rôle attribué: "seller".`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  // Reject Seller Application with mandatory reason (Requirement 3.2)
  const rejectSeller = async (userId: string, reason?: string) => {
    const user = users.find((u) => u.id === userId);
    const mandatoryReason = reason?.trim() || 'Non conformité des documents d’identité fournis.';
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'buyer', // Le compte reste ACHETEUR
        sellerStatus: 'rejected',
        sellerRejectionReason: mandatoryReason,
      });
      await logAdminAction(
        'REJET_VENDEUR',
        user?.name || userId,
        `Candidature vendeur rejetée. Motif: ${mandatoryReason}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const deleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      await logAdminAction(
        'SUPPRESSION_COMPTE',
        user?.name || userId,
        `Compte utilisateur ${user?.email || userId} définitivement supprimé.`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  // Cart Logic
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(quantity, product.stock),
          vendorId: product.vendorId,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const cartGroupedByVendor = React.useMemo(() => {
    const groups: { [vendorId: string]: CartItem[] } = {};
    cart.forEach((item) => {
      if (!groups[item.vendorId]) {
        groups[item.vendorId] = [];
      }
      groups[item.vendorId].push(item);
    });

    return Object.keys(groups).map((vendorId) => {
      const items = groups[vendorId];
      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const shop = shops.find((s) => s.sellerId === vendorId);
      return {
        vendorId,
        shop,
        items,
        subtotal,
      };
    });
  }, [cart, shops]);

  // Orders & Multi-Vendor Splitting with Mobile Money
  const createOrderWithMobileMoney = async (
    operator: PaymentOperator,
    phoneNumber: string
  ): Promise<{ success: boolean; order?: Order; transaction?: Transaction; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Votre panier est vide' };
    }

    if (!isAuthenticated || !auth.currentUser) {
      openAuthModal('signin');
      return { success: false, error: 'Veuillez vous connecter pour finaliser votre commande.' };
    }

    const orderId = `CMD-${Date.now().toString().slice(-6)}`;
    const txId = `TX-${Date.now().toString().slice(-6)}`;
    const commissionRate = settings.commissionRate / 100;

    const subOrders: SubOrder[] = cartGroupedByVendor.map((group, index) => {
      const vendorSubtotal = group.subtotal;
      const commissionAmount = Math.round(vendorSubtotal * commissionRate);
      const vendorNet = vendorSubtotal - commissionAmount;

      return {
        id: `SUB-${orderId}-${index + 1}`,
        orderId,
        vendorId: group.vendorId,
        shopId: group.shop?.id || 'shop_unknown',
        shopName: group.shop?.name || 'Boutique Partenaire',
        pickupLocation: group.shop?.pickupLocation || 'Point de retrait vendeur',
        pickupHours: group.shop?.pickupHours || '08h00 - 18h00',
        items: group.items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0] || '',
        })),
        vendorSubtotal,
        commissionAmount,
        vendorNet,
        status: 'confirmed' as SubOrderStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    const totalOrderAmount = cartTotal;
    const totalCommission = subOrders.reduce((acc, so) => acc + so.commissionAmount, 0);

    const newOrder: Order = {
      id: orderId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: phoneNumber || currentUser.phone,
      buyerAddress: currentUser.address || 'Bujumbura, Burundi',
      totalAmount: totalOrderAmount,
      platformCommission: totalCommission,
      paymentOperator: operator,
      paymentPhone: phoneNumber,
      paymentStatus: 'successful' as PaymentStatus,
      transactionId: txId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      subOrders,
    };

    const newTransaction: Transaction = {
      id: txId,
      orderId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      amount: totalOrderAmount,
      platformCommission: totalCommission,
      vendorPayouts: subOrders.map((so) => ({
        vendorId: so.vendorId,
        shopName: so.shopName,
        amount: so.vendorNet,
      })),
      operator,
      phoneNumber,
      ussdRef: `${operator.toUpperCase()}-BI-${Date.now().toString().slice(-6)}`,
      status: 'successful' as PaymentStatus,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      await setDoc(doc(db, 'transactions', txId), newTransaction);

      // Decrement stock in Firestore for ordered items
      for (const item of cart) {
        const prodRef = doc(db, 'products', item.product.id);
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await updateDoc(prodRef, { stock: newStock }).catch(console.warn);
      }

      clearCart();

      await addAuditLog(
        'PAIEMENT_MOBILE_MONEY',
        `Paiement ${operator.toUpperCase()} validé pour ${totalOrderAmount.toLocaleString()} FBu. Réf: ${newTransaction.ussdRef}`
      );
      await addAuditLog(
        'SCISSION_COMMANDE',
        `Commande ${orderId} scindée en ${subOrders.length} sous-commandes distinctes. Commission E-Soko: ${totalCommission.toLocaleString()} FBu.`
      );

      return { success: true, order: newOrder, transaction: newTransaction };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders/transactions');
    }
  };

  const refundTransaction = async (transactionId: string) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), { status: 'refunded' as PaymentStatus });
      await addAuditLog('REMBOURSEMENT', `Transaction ${transactionId} marquée comme remboursée.`, 'warning');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${transactionId}`);
    }
  };

  const updateSubOrderStatus = async (subOrderId: string, newStatus: SubOrderStatus, reason?: string) => {
    const order = orders.find((o) => o.subOrders.some((so) => so.id === subOrderId));
    if (!order) return;

    const updatedSubOrders = order.subOrders.map((so) => {
      if (so.id === subOrderId) {
        return {
          ...so,
          status: newStatus,
          cancelReason: reason || so.cancelReason,
          updatedAt: new Date().toISOString(),
        };
      }
      return so;
    });

    const allCompleted = updatedSubOrders.every((so) => so.status === 'completed');
    const allCancelled = updatedSubOrders.every((so) => so.status === 'cancelled');
    const anyReady = updatedSubOrders.some((so) => so.status === 'ready_for_pickup');

    let overallStatus = order.status;
    if (allCompleted) overallStatus = 'completed';
    else if (allCancelled) overallStatus = 'cancelled';
    else if (anyReady) overallStatus = 'partially_ready';

    try {
      await updateDoc(doc(db, 'orders', order.id), {
        subOrders: updatedSubOrders,
        status: overallStatus,
      });
      await addAuditLog('STATUT_SOUS_COMMANDE', `Sous-commande ${subOrderId} passée à: ${newStatus}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${order.id}`);
    }
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
        cancelReason: reason || 'Annulée par l’utilisateur ou l’administrateur',
      });
      await addAuditLog('ANNULATION_COMMANDE', `Commande ${orderId} annulée. Motif: ${reason || 'Non spécifié'}`, 'warning');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Reviews
  const addReview = async (productId: string, rating: number, comment: string) => {
    if (!isAuthenticated || !auth.currentUser) {
      openAuthModal('signin');
      return;
    }

    const product = products.find((p) => p.id === productId);
    const revId = `rev_${Date.now()}`;
    const newRev: Review = {
      id: revId,
      productId,
      productName: product?.name || 'Produit',
      vendorId: product?.vendorId || '',
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      isApproved: true,
    };

    try {
      await setDoc(doc(db, 'reviews', revId), newRev);
      if (product) {
        const prodReviews = [...reviews.filter((r) => r.productId === productId), newRev];
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        await updateDoc(doc(db, 'products', productId), {
          rating: Math.round(avg * 10) / 10,
          reviewsCount: prodReviews.length,
        });
      }
      await addAuditLog('NOUVEL_AVIS', `Avis de ${rating} étoiles déposé sur "${product?.name || productId}"`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${revId}`);
    }
  };

  const replyToReview = async (reviewId: string, reply: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { vendorReply: reply });
      await addAuditLog('REPONSE_AVIS', `Réponse du vendeur à l’avis ${reviewId}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
    }
  };

  // Messaging
  const sendMessage = async (
    shopId: string,
    recipientId: string,
    text: string,
    subOrderId?: string
  ) => {
    if (!isAuthenticated || !auth.currentUser) {
      openAuthModal('signin');
      return;
    }

    const shop = shops.find((s) => s.id === shopId);
    const msgId = `msg_${Date.now()}`;
    const newMsg: DirectMessage = {
      id: msgId,
      subOrderId,
      shopId,
      shopName: shop?.name || 'Boutique E-Soko',
      buyerId: currentUser.role === 'buyer' ? currentUser.id : recipientId,
      buyerName: currentUser.role === 'buyer' ? currentUser.name : 'Acheteur',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'buyer' ? 'buyer' : 'seller',
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      await setDoc(doc(db, 'messages', msgId), newMsg);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `messages/${msgId}`);
    }
  };

  const markMessagesAsRead = async (shopId: string) => {
    const unread = messages.filter((m) => m.shopId === shopId && !m.read);
    for (const msg of unread) {
      updateDoc(doc(db, 'messages', msg.id), { read: true }).catch(console.warn);
    }
  };

  // Audit Logging
  const addAuditLog = async (
    action: string,
    details: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    const logId = `log_${Date.now()}`;
    const newLog: AuditLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      userId: currentUser.id || 'system',
      userName: currentUser.name || 'Système',
      userRole: currentUser.role,
      action,
      details,
      severity,
    };

    try {
      await setDoc(doc(db, 'audit_logs', logId), newLog);
    } catch {
      // Non-blocking log persistence
    }
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        authLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        switchDemoUser,
        applyAsSeller,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        settings,
        updateCommissionRate,
        updateSettings,
        settingsHistory,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductPublished,
        unpublishProductWithReason,
        shops,
        updateShop,
        getShopBySellerId,
        users,
        toggleUserStatus,
        toggleUserSuspension,
        approveSeller,
        rejectSeller,
        deleteUser,
        createAdminAccount,
        disputes,
        resolveDispute,
        deleteReviewWithReason,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartGroupedByVendor,
        orders,
        updateSubOrderStatus,
        cancelOrder,
        transactions,
        createOrderWithMobileMoney,
        refundTransaction,
        reviews,
        addReview,
        replyToReview,
        auditLogs,
        addAuditLog,
        adminActionLogs,
        logAdminAction,
        messages,
        sendMessage,
        markMessagesAsRead,
        activeView,
        setActiveView,
        selectedShopId,
        setSelectedShopId,
        selectedProductId,
        setSelectedProductId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
