import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ESokoLogo } from './ESokoLogo';
import { HamburgerMenu } from './HamburgerMenu';
import {
  Menu,
  ShoppingCart,
  Moon,
  Sun,
  User as UserIcon,
  Store,
  ShieldCheck,
  Package,
  Clock,
  Layers,
  LogOut,
  ChevronDown,
  Search,
  BadgeAlert,
  LogIn,
  UserPlus,
  Sliders,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  searchQuery,
  setSearchQuery,
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
  } = useApp();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pendingSellersCount = users.filter((u) => u.sellerStatus === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  const hasAdminAlerts = currentUser.role === 'admin' && (pendingSellersCount > 0 || openDisputesCount > 0);

  return (
    <>
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-[#151522]/95 border-slate-800 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
      >
        {/* Top micro-bar with Slogan & quick auth status */}
        <div
          className={`px-4 py-1.5 text-xs border-b flex items-center justify-between transition-colors ${
            isDarkMode ? 'bg-[#0E0E18] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-black text-[11px] text-slate-900 dark:text-slate-100">
              « Le marché du Burundi, en un clic »
            </span>
            <span className="hidden md:inline-block text-slate-400 dark:text-slate-600">•</span>
            <span className="hidden md:inline-block text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Paiements 100% Lumicash & EcoCash • Retrait direct chez le vendeur
            </span>
          </div>

          {/* Micro-bar right actions */}
          <div className="flex items-center gap-3 relative">
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="btn-auth-signin"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1EB53A] hover:bg-[#199931] text-white transition shadow-2xs"
                >
                  <LogIn size={13} />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  id="btn-auth-signup"
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <UserPlus size={13} />
                  <span>Créer un compte</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  id="btn-user-profile-menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition border ${
                    currentUser.role === 'admin'
                      ? 'bg-[#CE1126]/10 text-[#CE1126] border-[#CE1126]/30'
                      : currentUser.role === 'seller'
                      ? 'bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/30'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {currentUser.role === 'admin' && <ShieldCheck size={13} />}
                  {currentUser.role === 'seller' && <Store size={13} />}
                  {currentUser.role === 'buyer' && <UserIcon size={13} />}
                  <span className="truncate max-w-[120px]">{currentUser.name}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    (
                    {currentUser.role === 'admin'
                      ? 'Admin'
                      : currentUser.role === 'seller'
                      ? currentUser.sellerStatus === 'pending'
                        ? 'En attente'
                        : 'Vendeur'
                      : 'Acheteur'}
                    )
                  </span>
                  <ChevronDown size={12} />
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className={`absolute right-0 top-full mt-1.5 w-60 rounded-xl shadow-xl border py-2 z-50 animate-in fade-in zoom-in-95 ${
                      isDarkMode ? 'bg-[#1A1A2E] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-xs truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveView('buyer_profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <UserIcon size={14} /> Mon Profil Acheteur
                      </button>

                      <button
                        onClick={() => {
                          setActiveView('buyer_orders');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Package size={14} /> Mes Commandes
                      </button>

                      {currentUser.role === 'seller' && (
                        <button
                          onClick={() => {
                            setActiveView('seller_dashboard');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#1EB53A] flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Store size={14} /> Espace Boutique Vendeur
                        </button>
                      )}

                      {currentUser.role === 'buyer' && (
                        <button
                          onClick={() => {
                            setActiveView('apply_seller');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#1EB53A] flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Store size={14} /> Ouvrir ma boutique E-Soko
                        </button>
                      )}

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setActiveView('admin_dashboard');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#CE1126] flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ShieldCheck size={14} /> Supervision Administrateur
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <LogOut size={14} /> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              aria-label="Changer de thème"
            >
              {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {/* Main Bar with Hamburger, Logo, Search, and Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left section: Hamburger Button + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Hamburger Button for All Account Types */}
            <button
              type="button"
              id="btn-hamburger-menu"
              onClick={() => setIsHamburgerOpen(true)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition border ${
                currentUser.role === 'admin'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-[#CE1126] border-red-500/30'
                  : currentUser.role === 'seller'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-[#1EB53A] border-emerald-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
              }`}
              title="Ouvrir le menu de navigation"
              aria-label="Ouvrir le menu principal"
            >
              <Menu size={18} className="shrink-0" />
              <span className="hidden sm:inline font-bold">Menu</span>
              
              {/* Alert dot on hamburger if admin has pending tasks */}
              {hasAdminAlerts && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#CE1126] absolute -top-1 -right-1 animate-ping" />
              )}
              {hasAdminAlerts && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#CE1126] absolute -top-1 -right-1" />
              )}
            </button>

            {/* Official Brand Logo */}
            <button
              onClick={() => {
                if (currentUser.role === 'admin') setActiveView('admin_dashboard');
                else if (currentUser.role === 'seller') setActiveView('seller_dashboard');
                else setActiveView('catalog');
              }}
              className="flex items-center text-left focus:outline-hidden group"
              id="btn-nav-home"
            >
              <ESokoLogo size="md" variant="horizontal" showSlogan={true} isDark={isDarkMode} />
            </button>
          </div>

          {/* Global Search Bar (Only for Buyer role / Catalog view) */}
          {currentUser.role === 'buyer' && (
            <div className="flex-1 max-w-lg hidden md:flex items-center gap-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit, café de Kayanza, pagne, smartphone..."
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs transition focus:outline-hidden focus:ring-2 focus:ring-[#1EB53A]/30 focus:border-[#1EB53A] ${
                    isDarkMode
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400'
                      : 'bg-slate-100/80 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Category filter select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <option value="all">Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active View Quick Indicator and Shortcuts */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Context Pill / Current View Badge */}
            <div className="hidden lg:flex items-center">
              {currentUser.role === 'admin' && (
                <div className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#CE1126] text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>
                    {activeView === 'admin_dashboard' && 'Supervision'}
                    {activeView === 'admin_sellers' && 'Vendeurs & KYC'}
                    {activeView === 'admin_products' && 'Produits'}
                    {activeView === 'admin_orders' && 'Finances'}
                    {activeView === 'admin_disputes' && 'Litiges & Avis'}
                    {activeView === 'admin_settings' && 'Paramètres'}
                    {activeView === 'admin_audit' && 'Audit'}
                    {activeView === 'catalog' && 'Aperçu Boutique'}
                  </span>
                  {pendingSellersCount > 0 && activeView !== 'admin_sellers' && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#1EB53A] text-white text-[10px] font-black">
                      {pendingSellersCount} KYC
                    </span>
                  )}
                  {openDisputesCount > 0 && activeView !== 'admin_disputes' && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                      {openDisputesCount} litige(s)
                    </span>
                  )}
                </div>
              )}

              {currentUser.role === 'seller' && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#1EB53A] text-xs font-bold flex items-center gap-1.5">
                  <Store size={14} />
                  <span>
                    {activeView === 'seller_dashboard' && 'Tableau de bord Vendeur'}
                    {activeView === 'seller_orders' && 'Commandes reçues'}
                    {activeView === 'seller_products' && 'Mes Produits'}
                    {activeView === 'seller_shop_settings' && 'Ma Boutique'}
                    {activeView === 'catalog' && 'Aperçu Marketplace'}
                  </span>
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger (For buyer or when browsing catalog) */}
            <button
              id="btn-cart-trigger"
              onClick={onOpenCart}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1EB53A]/10 text-[#1EB53A] hover:bg-[#1EB53A] hover:text-white transition font-bold flex items-center gap-1.5"
              aria-label="Voir le panier"
              title="Mon panier d'achats"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-xs">Panier</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-[#CE1126] text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Button to Open Full Hamburger Menu */}
            <button
              type="button"
              onClick={() => setIsHamburgerOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Afficher tous les menus de navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Hamburger Menu Drawer for Every Account Type */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        onOpenCart={onOpenCart}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </>
  );
};

