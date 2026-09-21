import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BuyerCatalog } from './components/buyer/BuyerCatalog';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { BuyerProfile } from './components/buyer/BuyerProfile';
import { ShopPublicPage } from './components/buyer/ShopPublicPage';
import { CartDrawer } from './components/buyer/CartDrawer';
import { ProductDetailModal } from './components/buyer/ProductDetailModal';
import { MessagingModal } from './components/buyer/MessagingModal';
import { MobileMoneyModal } from './components/MobileMoneyModal';
import { AuthModal } from './components/AuthModal';
import { ApplySellerForm } from './components/seller/ApplySellerForm';
import { SellerStatusPending } from './components/seller/SellerStatusPending';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { SellerOrders } from './components/seller/SellerOrders';
import { SellerProducts } from './components/seller/SellerProducts';
import { SellerShopSettings } from './components/seller/SellerShopSettings';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSellers } from './components/admin/AdminSellers';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminDisputes } from './components/admin/AdminDisputes';
import { AdminAudit } from './components/admin/AdminAudit';
import { Product } from './types';

const MainContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    isDarkMode,
    isAuthModalOpen,
    closeAuthModal,
  } = useApp();

  // Navigation and modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [chatShopId, setChatShopId] = useState<string | null>(null);
  const [chatSubOrderId, setChatSubOrderId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handlers
  const handleOpenShop = (shopId: string) => {
    setSelectedShopId(shopId);
  };

  const handleOpenChat = (shopId: string, subOrderId?: string) => {
    setChatShopId(shopId);
    setChatSubOrderId(subOrderId);
  };

  const handleProceedToPayment = () => {
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setActiveView('buyer_orders');
  };

  // Render view
  const renderCurrentView = () => {
    // If viewing a public shop page
    if (selectedShopId) {
      return (
        <ShopPublicPage
          shopId={selectedShopId}
          onBack={() => setSelectedShopId(null)}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onOpenChat={(shopId) => handleOpenChat(shopId)}
        />
      );
    }

    switch (activeView) {
      // Buyer Views
      case 'catalog':
        return (
          <BuyerCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onOpenShop={(shopId) => handleOpenShop(shopId)}
          />
        );

      case 'buyer_orders':
        return (
          <BuyerOrders
            onOpenChat={(shopId, subOrderId) => handleOpenChat(shopId, subOrderId)}
            onOpenShop={(shopId) => handleOpenShop(shopId)}
          />
        );

      case 'buyer_profile':
        return (
          <BuyerProfile
            onApplySeller={() => setActiveView('apply_seller')}
          />
        );

      case 'apply_seller':
        return (
          <ApplySellerForm
            onSuccess={() => setActiveView('seller_dashboard')}
          />
        );

      // Seller Views
      case 'seller_dashboard':
        if (currentUser.sellerStatus === 'pending' || currentUser.sellerStatus === 'rejected') {
          return <SellerStatusPending />;
        }
        return <SellerDashboard onNavigateTab={(tab) => setActiveView(tab as any)} />;

      case 'seller_orders':
        return (
          <SellerOrders
            onOpenChat={(shopId, subOrderId) => handleOpenChat(shopId, subOrderId)}
          />
        );

      case 'seller_products':
        return <SellerProducts />;

      case 'seller_shop_settings':
        return <SellerShopSettings />;

      // Admin Views
      case 'admin_dashboard':
        return <AdminDashboard onNavigateTab={(tab) => setActiveView(tab as any)} />;

      case 'admin_sellers':
        return <AdminSellers />;

      case 'admin_products':
        return <AdminProducts />;

      case 'admin_orders':
        return <AdminOrders />;

      case 'admin_settings':
        return <AdminSettings />;

      case 'admin_disputes':
        return <AdminDisputes />;

      case 'admin_audit':
        return <AdminAudit />;

      default:
        return (
          <BuyerCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onOpenShop={(shopId) => handleOpenShop(shopId)}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? 'dark bg-[#0E0E18] text-slate-100' : 'bg-[#FAFAFB] text-slate-900'
      }`}
      id="esoko-app-root"
    >
      {/* Top Main Navigation Bar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      <MobileMoneyModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenShop={(shopId) => {
          setSelectedProduct(null);
          handleOpenShop(shopId);
        }}
        onOpenChat={(shopId) => {
          setSelectedProduct(null);
          handleOpenChat(shopId);
        }}
      />

      {chatShopId && (
        <MessagingModal
          isOpen={!!chatShopId}
          onClose={() => {
            setChatShopId(null);
            setChatSubOrderId(undefined);
          }}
          shopId={chatShopId}
          subOrderId={chatSubOrderId}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
