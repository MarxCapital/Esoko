import React from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Store,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToPayment,
}) => {
  const {
    cart,
    cartTotal,
    cartCount,
    cartGroupedByVendor,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isDarkMode,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in"
      id="cart-drawer-backdrop"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col border-l transition-colors ${
            isDarkMode
              ? 'bg-[#151522] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
          id="cart-drawer"
        >
          {/* Drawer Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-100 bg-[#F8F9FA]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Mon Panier ({cartCount})
                </h3>
                <p className="text-[11px] text-slate-500">
                  {cartGroupedByVendor.length} vendeur(s) sélectionné(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-red-500 font-bold px-2 py-1 rounded-md"
                  title="Vider le panier"
                >
                  Vider
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Votre panier est vide
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Parcourez les produits de nos vendeurs burundais et ajoutez vos articles favoris.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 py-2 px-4 rounded-xl bg-[#1EB53A] text-white text-xs font-bold hover:bg-[#199931] transition shadow-xs"
                >
                  Découvrir le catalogue
                </button>
              </div>
            ) : (
              // Multi-vendor split groups
              <div className="space-y-4">
                <div className="p-2.5 rounded-xl bg-[#1EB53A]/10 border border-[#1EB53A]/20 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#1EB53A] shrink-0" />
                  <span>
                    <strong>Scission automatique :</strong> Lors du paiement, votre commande sera automatiquement divisée en sous-commandes pour chaque boutique.
                  </span>
                </div>

                {cartGroupedByVendor.map((group) => (
                  <div
                    key={group.vendorId}
                    className={`p-3.5 rounded-xl border ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-800'
                        : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                    }`}
                  >
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Store size={14} className="text-[#CE1126]" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {group.shop?.name || 'Boutique'}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#1EB53A]">
                        Sous-total : {group.subtotal.toLocaleString()} FBu
                      </span>
                    </div>

                    {/* Vendor Pickup notice */}
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 font-medium mb-3 bg-white/90 dark:bg-slate-800/80 p-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                      📍 <strong className="text-slate-900 dark:text-white">Retrait :</strong> {group.shop?.pickupLocation || 'Bujumbura'}
                    </div>

                    {/* Products in this vendor group */}
                    <div className="space-y-3">
                      {group.items.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-md shrink-0 bg-slate-100"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {product.name}
                            </h5>
                            <span className="text-xs font-bold text-[#1EB53A] block mt-0.5">
                              {product.price.toLocaleString()} FBu
                            </span>
                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                  aria-label="Diminuer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={quantity >= product.stock}
                                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition"
                                  aria-label="Augmenter"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                className="text-slate-400 hover:text-[#CE1126] transition p-1"
                                title="Supprimer l'article"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Button */}
          {cart.length > 0 && (
            <div
              className={`p-4 border-t space-y-3 ${
                isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-200 bg-[#F8F9FA]'
              }`}
            >
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>Articles ({cartCount})</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cartTotal.toLocaleString()} FBu</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>Frais de retrait</span>
                  <span className="text-[#1EB53A] font-bold">Gratuit (direct vendeur)</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total à payer :</span>
                  <span className="text-[#1EB53A]">{cartTotal.toLocaleString()} FBu</span>
                </div>
              </div>

              {/* Checkout button triggering Mobile Money */}
              <button
                type="button"
                id="btn-checkout-cart"
                onClick={() => {
                  onProceedToPayment();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
              >
                <Smartphone size={18} />
                Payer par Mobile Money
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#1EB53A]" />
                <span>Lumicash (*163#)</span>
                <span>•</span>
                <span className="w-2 h-2 rounded-full bg-[#CE1126]" />
                <span>EcoCash (*151#)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
