import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ESokoLogo } from './ESokoLogo';
import {
  X,
  Store,
  ShieldCheck,
  Package,
  Clock,
  Layers,
  LogOut,
  BadgeAlert,
  LogIn,
  UserPlus,
  Sliders,
  ShoppingCart,
  User as UserIcon,
  Sun,
  Moon,
  ChevronRight,
  Eye,
  AlertCircle,
  Tag,
  ShoppingBag,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onOpenCart,
  selectedCategory,
  setSelectedCategory,
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    cartCount,
    isDarkMode,
    toggleDarkMode,
    activeView,
    setActiveView,
    users,
    categories,
    disputes,
    switchDemoUser,
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when hamburger drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const pendingSellersCount = users.filter((u) => u.sellerStatus === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  const handleNavigate = (view: any) => {
    setActiveView(view);
    onClose();
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveView('catalog');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex" id="hamburger-menu-container">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <aside
        id="hamburger-drawer"
        className={`relative z-10 w-full max-w-sm sm:max-w-md h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-left ${
          isDarkMode ? 'bg-[#151522] text-white border-r border-slate-800' : 'bg-white text-slate-900 border-r border-slate-200'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal de navigation"
      >
        {/* Drawer Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#0E0E18] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <ESokoLogo size="sm" variant="horizontal" showSlogan={false} isDark={isDarkMode} />
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                currentUser.role === 'admin'
                  ? 'bg-red-500/10 text-[#CE1126] border border-red-500/30'
                  : currentUser.role === 'seller'
                  ? 'bg-emerald-500/10 text-[#1EB53A] border border-emerald-500/30'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
              }`}
            >
              {currentUser.role === 'admin'
                ? 'Espace Admin'
                : currentUser.role === 'seller'
                ? 'Espace Vendeur'
                : 'Espace Client'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDarkMode
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card Profile in Drawer */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80">
          {isAuthenticated ? (
            <div
              className={`p-3.5 rounded-2xl border transition ${
                currentUser.role === 'admin'
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/60 dark:border-red-900/40'
                  : currentUser.role === 'seller'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${
                    currentUser.role === 'admin'
                      ? 'bg-[#CE1126]'
                      : currentUser.role === 'seller'
                      ? 'bg-[#1EB53A]'
                      : 'bg-blue-600'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck size={22} />
                  ) : currentUser.role === 'seller' ? (
                    <Store size={22} />
                  ) : (
                    <UserIcon size={22} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm truncate">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        currentUser.role === 'admin'
                          ? 'bg-red-600 text-white'
                          : currentUser.role === 'seller'
                          ? currentUser.sellerStatus === 'approved'
                            ? 'bg-[#1EB53A] text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}
                    >
                      {currentUser.role === 'admin' && 'Administrateur'}
                      {currentUser.role === 'seller' &&
                        (currentUser.sellerStatus === 'approved'
                          ? 'Vendeur Agréé'
                          : 'Vendeur (Validation en attente)')}
                      {currentUser.role === 'buyer' && 'Compte Acheteur'}
                    </span>
                    {currentUser.phone && (
                      <span className="text-[10px] text-slate-400 truncate">{currentUser.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-center">
              <div className="text-xs font-black text-slate-900 dark:text-white mb-1">
                Bienvenue sur E-Soko Burundi
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Achetez et vendez facilement avec Lumicash et EcoCash.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('signin');
                  }}
                  className="py-2 px-3 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <LogIn size={14} />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('signup');
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <UserPlus size={14} />
                  <span>S'inscrire</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* ==================================================== */}
          {/* 1. ROLE ADMINISTRATEUR - MENUS HAMBURGER DÉDIÉS     */}
          {/* ==================================================== */}
          {currentUser.role === 'admin' && (
            <div className="space-y-4">
              <div>
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Supervision Administrative</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_dashboard'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className={activeView === 'admin_dashboard' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Tableau de bord Général</div>
                        <div className={`text-[10px] ${activeView === 'admin_dashboard' ? 'text-red-100' : 'text-slate-400'}`}>
                          Indicateurs nationaux, GMV & volume
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_sellers')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_sellers'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store size={18} className={activeView === 'admin_sellers' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Vendeurs & Dossiers KYC</div>
                        <div className={`text-[10px] ${activeView === 'admin_sellers' ? 'text-red-100' : 'text-slate-400'}`}>
                          Validation marchands, NIF & conformité
                        </div>
                      </div>
                    </div>
                    {pendingSellersCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#1EB53A] text-white text-[10px] font-black">
                        {pendingSellersCount} en attente
                      </span>
                    ) : (
                      <ChevronRight size={14} className="opacity-70" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_products')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_products'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={18} className={activeView === 'admin_products' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Modération des Produits</div>
                        <div className={`text-[10px] ${activeView === 'admin_products' ? 'text-red-100' : 'text-slate-400'}`}>
                          Catalogue national & retraits motivés
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_orders')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_orders'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package size={18} className={activeView === 'admin_orders' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Finances & Transactions</div>
                        <div className={`text-[10px] ${activeView === 'admin_orders' ? 'text-red-100' : 'text-slate-400'}`}>
                          Flux Lumicash, EcoCash & commissions
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_disputes')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_disputes'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BadgeAlert size={18} className={activeView === 'admin_disputes' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Litiges & Modération Avis</div>
                        <div className={`text-[10px] ${activeView === 'admin_disputes' ? 'text-red-100' : 'text-slate-400'}`}>
                          Arbitrage réclamations & remboursements
                        </div>
                      </div>
                    </div>
                    {openDisputesCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                        {openDisputesCount} litige(s)
                      </span>
                    ) : (
                      <ChevronRight size={14} className="opacity-70" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_settings')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_settings'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sliders size={18} className={activeView === 'admin_settings' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Paramètres & Nouveaux Admins</div>
                        <div className={`text-[10px] ${activeView === 'admin_settings' ? 'text-red-100' : 'text-slate-400'}`}>
                          Commission, catégories & habilitations
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('admin_audit')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'admin_audit'
                        ? 'bg-[#CE1126] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={18} className={activeView === 'admin_audit' ? 'text-white' : 'text-[#CE1126]'} />
                      <div>
                        <div className="leading-tight">Journal d'Audit Administratif</div>
                        <div className={`text-[10px] ${activeView === 'admin_audit' ? 'text-red-100' : 'text-slate-400'}`}>
                          Traçabilité légale & historique des actions
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>
                </div>
              </div>

              {/* Public Marketplace shortcut */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Accès Public
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('catalog')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye size={16} className="text-slate-400" />
                    <span>Aperçu Marketplace (Catalogue Public)</span>
                  </div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. ROLE VENDEUR - MENUS HAMBURGER DÉDIÉS             */}
          {/* ==================================================== */}
          {currentUser.role === 'seller' && (
            <div className="space-y-4">
              <div>
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-[#1EB53A] mb-2 flex items-center gap-1.5">
                  <Store size={14} />
                  <span>Gestion de la Boutique</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavigate('seller_dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'seller_dashboard'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store size={18} className={activeView === 'seller_dashboard' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Tableau de Bord Vendeur</div>
                        <div className={`text-[10px] ${activeView === 'seller_dashboard' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Chiffre d'affaires & ventes du jour
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('seller_orders')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'seller_orders'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package size={18} className={activeView === 'seller_orders' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Commandes Reçues</div>
                        <div className={`text-[10px] ${activeView === 'seller_orders' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Commandes à préparer & retraits clients
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('seller_products')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'seller_products'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={18} className={activeView === 'seller_products' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Mes Produits en Vente</div>
                        <div className={`text-[10px] ${activeView === 'seller_products' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Ajouter des articles, stocks & prix en FBu
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('seller_shop_settings')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'seller_shop_settings'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sliders size={18} className={activeView === 'seller_shop_settings' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Paramètres de la Boutique</div>
                        <div className={`text-[10px] ${activeView === 'seller_shop_settings' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Adresse de retrait, horaires & Mobile Money
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>
                </div>
              </div>

              {/* Secondary links for Seller */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Espace Personnel & Marché
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalog')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} className="text-[#1EB53A]" />
                    <span>Voir la Marketplace publique</span>
                  </div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('buyer_orders')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Package size={16} className="text-slate-400" />
                    <span>Mes Achats personnels</span>
                  </div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('buyer_profile')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <UserIcon size={16} className="text-slate-400" />
                    <span>Mon Profil</span>
                  </div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. ROLE ACHETEUR / CLIENT - MENUS HAMBURGER DÉDIÉS   */}
          {/* ==================================================== */}
          {currentUser.role === 'buyer' && (
            <div className="space-y-4">
              <div>
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                  <ShoppingBag size={14} />
                  <span>Achats & Marketplace</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavigate('catalog')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'catalog'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={18} className={activeView === 'catalog' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Catalogue des Produits</div>
                        <div className={`text-[10px] ${activeView === 'catalog' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Explorez tous les articles du Burundi
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={18} className="text-[#1EB53A]" />
                      <div>
                        <div className="leading-tight">Mon Panier d'Achats</div>
                        <div className="text-[10px] text-slate-400">
                          {cartCount > 0 ? `${cartCount} article(s) prêts à payer` : 'Panier actuellement vide'}
                        </div>
                      </div>
                    </div>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#CE1126] text-white text-[10px] font-black">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        onClose();
                        openAuthModal('signin');
                      } else {
                        handleNavigate('buyer_orders');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'buyer_orders'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package size={18} className={activeView === 'buyer_orders' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Mes Commandes & Suivi</div>
                        <div className={`text-[10px] ${activeView === 'buyer_orders' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Codes de retrait, statuts & reçus
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        onClose();
                        openAuthModal('signin');
                      } else {
                        handleNavigate('buyer_profile');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      activeView === 'buyer_profile'
                        ? 'bg-[#1EB53A] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserIcon size={18} className={activeView === 'buyer_profile' ? 'text-white' : 'text-[#1EB53A]'} />
                      <div>
                        <div className="leading-tight">Mon Profil & Coordonnées</div>
                        <div className={`text-[10px] ${activeView === 'buyer_profile' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Numéro Lumicash / EcoCash & adresse
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-70" />
                  </button>
                </div>
              </div>

              {/* Categories list in Hamburger Menu */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Tag size={13} />
                  <span>Rayons & Catégories</span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#1EB53A] font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Tous les produits</span>
                    {selectedCategory === 'all' && <CheckCircle2 size={14} />}
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#1EB53A] font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {selectedCategory === cat.id && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Seller Callout */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      onClose();
                      openAuthModal('signup', 'seller');
                    } else {
                      handleNavigate('apply_seller');
                    }
                  }}
                  className="w-full p-3 rounded-2xl bg-linear-to-r from-[#1EB53A]/15 to-[#007A3D]/10 border border-[#1EB53A]/30 text-left group hover:border-[#1EB53A] transition"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <Store size={18} className="text-[#1EB53A]" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Ouvrir ma boutique E-Soko
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Vendez à des milliers d'acheteurs au Burundi sans frais d'entrée.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Switcher inside Hamburger Menu */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>Changer de rôle (Démonstration)</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 px-1">
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('buyer');
                  onClose();
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                  currentUser.role === 'buyer'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Acheteur
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('seller');
                  onClose();
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                  currentUser.role === 'seller' && currentUser.sellerStatus === 'approved'
                    ? 'bg-[#1EB53A] text-white border-[#1EB53A]'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Vendeur
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('admin');
                  onClose();
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                  currentUser.role === 'admin'
                    ? 'bg-[#CE1126] text-white border-[#CE1126]'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer (Theme & Logout) */}
        <div
          className={`p-3 border-t space-y-2 ${
            isDarkMode ? 'bg-[#0E0E18] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-slate-600" />
              )}
              <span>{isDarkMode ? 'Mode Sombre activé' : 'Mode Clair activé'}</span>
            </div>
            <span className="text-[10px] text-slate-400">Basculer</span>
          </button>

          {/* Logout if authenticated */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition border border-red-200 dark:border-red-900/40"
            >
              <LogOut size={15} />
              <span>Se déconnecter</span>
            </button>
          )}

          {/* Burundi National Footer Signature */}
          <div className="pt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-1.5 bg-[#1EB53A] rounded-xs inline-block" />
              <span className="w-2.5 h-1.5 bg-white border border-slate-300 rounded-xs inline-block" />
              <span className="w-2.5 h-1.5 bg-[#CE1126] rounded-xs inline-block" />
              <span className="font-semibold text-slate-500 dark:text-slate-400">E-Soko Burundi</span>
            </div>
            <span>Bujumbura • Paiements Lumicash & EcoCash</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
