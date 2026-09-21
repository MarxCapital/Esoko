import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Product } from '../../types';
import {
  Search,
  Filter,
  Star,
  Store,
  Plus,
  Check,
  MapPin,
  SlidersHorizontal,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BuyerCatalogProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenShop: (shopId: string) => void;
}

export const BuyerCatalog: React.FC<BuyerCatalogProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onOpenShop,
}) => {
  const { products, categories, shops, addToCart, cart, isDarkMode } = useApp();

  // Filters state
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isPublished)
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesShop = p.shopName.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesShop) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Vendor filter
        if (selectedVendor !== 'all' && p.vendorId !== selectedVendor) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Max price filter
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'asc') return a.price - b.price;
        if (priceSort === 'desc') return b.price - a.price;
        return 0; // Default order
      });
  }, [products, searchQuery, selectedCategory, selectedVendor, inStockOnly, priceSort, maxPrice]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <div className="space-y-6" id="buyer-catalog">
      {/* Hero Banner with Official Slogan and E-Soko Logo */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border shadow-sm ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#1A1A2E] via-[#151522] to-[#121B1E] border-slate-800 text-white'
            : 'bg-gradient-to-r from-emerald-50/50 via-white to-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-3">
            <ESokoLogo size="sm" variant="badge" isDark={isDarkMode} />
            <span className="text-xs font-black uppercase tracking-wider text-[#CE1126]">
              Marketplace Nationale du Burundi
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            « Le marché du Burundi, en un clic »
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
            Commandez vos produits locaux et importés directement auprès des commerçants de Bujumbura, Gitega et des provinces. Paiement sécurisé 100% Mobile Money (Lumicash & EcoCash) et retrait direct sans intermédiaire.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#1EB53A]/10 text-[#1EB53A] font-bold">
              ✓ Lumitel Lumicash
            </span>
            <span className="px-3 py-1 rounded-full bg-[#CE1126]/10 text-[#CE1126] font-bold">
              ✓ Econet EcoCash
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
              📍 Retrait en main propre
            </span>
          </div>
        </div>
      </div>

      {/* Category Horizontal Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
            selectedCategory === 'all'
              ? 'bg-[#1EB53A] border-[#1EB53A] text-white shadow-xs'
              : isDarkMode
              ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
          }`}
        >
          Tous les produits
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#1EB53A] border-[#1EB53A] text-white shadow-xs'
                : isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Vendor selector */}
          <div className="flex items-center gap-1.5">
            <Store size={14} className="text-slate-500 dark:text-slate-400" />
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">Tous les vendeurs</option>
              {shops.map((s) => (
                <option key={s.sellerId} value={s.sellerId}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Price Sorting */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-slate-500 dark:text-slate-400" />
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="default">Tri par défaut</option>
              <option value="asc">Prix croissant (FBu)</option>
              <option value="desc">Prix décroissant (FBu)</option>
            </select>
          </div>

          {/* Availability Filter checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded-sm text-[#1EB53A] focus:ring-[#1EB53A]"
            />
            <span>En stock uniquement</span>
          </label>
        </div>

        <div className="text-slate-600 dark:text-slate-400 font-medium text-xs">
          <strong className="text-slate-900 dark:text-white font-black">
            {filteredProducts.length}
          </strong>{' '}
          produit(s) trouvé(s)
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search size={28} />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            Aucun produit ne correspond à vos critères
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez de réinitialiser vos filtres de recherche ou sélectionnez une autre catégorie.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedVendor('all');
              setInStockOnly(false);
            }}
            className="py-2 px-4 rounded-xl bg-[#1EB53A] text-white text-xs font-bold shadow-xs hover:bg-[#199931] transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isAdded = addedAnimationId === product.id;
            const inCartItem = cart.find((c) => c.product.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={`group rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                id={`product-card-${product.id}`}
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Stock status badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {product.stock <= 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
                        Épuisé
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        Reste {product.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1EB53A] text-white">
                        En stock ({product.stock})
                      </span>
                    )}
                  </div>

                  {/* Vendor Shop Tag Link */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShop(product.shopId);
                    }}
                    className="absolute bottom-2.5 left-2.5 text-[11px] font-bold px-2 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white hover:bg-[#1EB53A] transition flex items-center gap-1 shadow-xs"
                    title="Voir la boutique de ce commerçant"
                  >
                    <Store size={12} />
                    <span className="truncate max-w-[150px]">{product.shopName}</span>
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star size={13} className="fill-amber-400 text-amber-400 mr-1" />
                        <span>{product.rating}</span>
                      </div>
                      <span>•</span>
                      <span>({product.reviewsCount} avis)</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 font-medium">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">Prix</span>
                      <span className="text-base font-black text-[#1EB53A]">
                        {product.price.toLocaleString()}{' '}
                        <span className="text-xs font-bold">FBu</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                        isAdded
                          ? 'bg-[#1EB53A] text-white scale-105'
                          : product.stock <= 0
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-[#1EB53A] hover:bg-[#199931] text-white active:scale-95'
                      }`}
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Ajouté !
                        </>
                      ) : inCartItem ? (
                        <>
                          <Check size={14} /> {inCartItem.quantity} au panier
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Ajouter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
