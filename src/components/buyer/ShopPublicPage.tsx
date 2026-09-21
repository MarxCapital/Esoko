import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Product } from '../../types';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  MessageSquare,
  Search,
  Star,
  Plus,
  ArrowLeft,
} from 'lucide-react';

interface ShopPublicPageProps {
  shopId: string;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenChat: (shopId: string) => void;
}

export const ShopPublicPage: React.FC<ShopPublicPageProps> = ({
  shopId,
  onBack,
  onSelectProduct,
  onOpenChat,
}) => {
  const { shops, products, addToCart, isDarkMode } = useApp();
  const [shopSearch, setShopSearch] = useState('');

  const shop = shops.find((s) => s.id === shopId || s.sellerId === shopId);
  const shopProducts = products.filter(
    (p) => (p.shopId === shopId || p.vendorId === shop?.sellerId) && p.isPublished
  );

  const filteredProducts = shopProducts.filter((p) => {
    if (!shopSearch.trim()) return true;
    return (
      p.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(shopSearch.toLowerCase())
    );
  });

  if (!shop) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Boutique introuvable.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#1EB53A] text-white text-xs font-bold"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="shop-public-page">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
      >
        <ArrowLeft size={16} />
        Retour au catalogue global
      </button>

      {/* Shop Header Banner Card */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="h-44 sm:h-56 relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <img
            src={shop.bannerUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <ESokoLogo size="xs" variant="badge" isDark={true} />
          </div>
        </div>

        <div className="p-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-4">
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md bg-white shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {shop.name}
                  </h1>
                  {shop.isVerified && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1EB53A]/15 text-[#1EB53A] font-bold flex items-center gap-1">
                      <ShieldCheck size={13} /> Boutique officielle vérifiée
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Gérée par <strong className="text-slate-900 dark:text-white font-bold">{shop.sellerName}</strong> • {shop.city}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChat(shop.id)}
              className="py-2.5 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageSquare size={16} />
              Contacter le vendeur
            </button>
          </div>

          {/* Description & Pickup terms (Section 5.3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                À propos de la boutique
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {shop.description}
              </p>
            </div>

            {/* Modalités de Retrait Obligatoires (Section 5.3) */}
            <div
              className={`p-4 rounded-xl border space-y-2.5 ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin size={14} className="text-[#CE1126]" />
                Modalités de Retrait en boutique
              </h4>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <p>
                  <strong>Adresse physique :</strong> {shop.pickupLocation}
                </p>
                <p>
                  <strong>Horaires :</strong> {shop.pickupHours}
                </p>
                <p>
                  <strong>Contact direct :</strong> {shop.phone}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-[10px] text-slate-500">
                <span>Lumicash: {shop.lumicashNumber}</span>
                <span>•</span>
                <span>EcoCash: {shop.ecocashNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Produits de cette boutique ({shopProducts.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder="Rechercher dans cette boutique..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-8 text-center">
            Aucun article ne correspond à votre recherche dans cette boutique.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className={`rounded-2xl border overflow-hidden cursor-pointer transition hover:shadow-md flex flex-col justify-between ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-4/3 relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1EB53A] text-white">
                      En stock ({prod.stock})
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
                      <Star size={12} className="fill-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-400 font-normal">({prod.reviewsCount})</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-black text-sm text-[#1EB53A]">
                      {prod.price.toLocaleString()} FBu
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="p-1.5 rounded-lg bg-[#1EB53A] hover:bg-[#199931] text-white transition"
                      title="Ajouter au panier"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
