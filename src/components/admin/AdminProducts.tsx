import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Product } from '../../types';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Store,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  FileText,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    updateProduct,
    deleteProduct,
    unpublishProductWithReason,
    categories,
    shops,
    isDarkMode,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterShop, setFilterShop] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'unpublished'>('all');

  const [unpublishingProduct, setUnpublishingProduct] = useState<Product | null>(null);
  const [unpublishReason, setUnpublishReason] = useState('');
  const [unpublishError, setUnpublishError] = useState('');

  const filtered = products.filter((p) => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (filterShop !== 'all' && p.vendorId !== filterShop) return false;
    if (filterStatus === 'published' && !p.isPublished) return false;
    if (filterStatus === 'unpublished' && p.isPublished) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmUnpublish = async () => {
    if (!unpublishingProduct) return;
    if (!unpublishReason.trim()) {
      setUnpublishError('Le motif du retrait est obligatoire.');
      return;
    }
    await unpublishProductWithReason(unpublishingProduct.id, unpublishReason.trim());
    setUnpublishingProduct(null);
    setUnpublishReason('');
    setUnpublishError('');
  };

  const handleRepublish = async (prod: Product) => {
    await updateProduct(prod.id, { isPublished: true, unpublishReason: undefined });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="admin-products-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Modération des Produits Nationaux ({products.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervisez tous les articles mis en vente par les boutiques tierces et retirez les produits non conformes avec motif obligatoire.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher produit..."
              className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés uniquement</option>
            <option value="unpublished">Dépubliés / Masqués</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <option value="all">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Shop Filter */}
          <select
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <option value="all">Toutes les boutiques</option>
            {shops.map((s) => (
              <option key={s.sellerId} value={s.sellerId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead
            className={`${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            } font-bold`}
          >
            <tr>
              <th className="p-3">Produit</th>
              <th className="p-3">Boutique & Vendeur</th>
              <th className="p-3">Prix (FBu)</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Statut Visibilité</th>
              <th className="p-3 text-right">Actions de Modération</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-slate-200 bg-white'
            }`}
          >
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-500/5 transition">
                {/* Product info */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {categories.find((c) => c.id === prod.categoryId)?.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Shop */}
                <td className="p-3">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <Store size={12} className="text-[#CE1126]" />
                    {prod.shopName}
                  </div>
                  <div className="text-[11px] text-slate-400">Vendeur: {prod.vendorId}</div>
                </td>

                {/* Price */}
                <td className="p-3 font-black text-[#1EB53A]">
                  {prod.price.toLocaleString()} FBu
                </td>

                {/* Stock */}
                <td className="p-3 font-medium">
                  {prod.stock <= 0 ? (
                    <span className="text-red-500 font-bold">0 (Épuisé)</span>
                  ) : (
                    <span className="text-slate-800 dark:text-slate-200">{prod.stock}</span>
                  )}
                </td>

                {/* Status */}
                <td className="p-3">
                  {prod.isPublished ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1EB53A]/15 text-[#1EB53A] flex items-center gap-1 w-fit">
                      <Eye size={12} /> Publié en ligne
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 flex items-center gap-1 w-fit">
                        <EyeOff size={12} /> Dépublié par modération
                      </span>
                      {prod.unpublishReason && (
                        <p className="text-[10px] text-slate-500 italic max-w-xs truncate" title={prod.unpublishReason}>
                          Motif: {prod.unpublishReason}
                        </p>
                      )}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {prod.isPublished ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUnpublishingProduct(prod);
                          setUnpublishReason('');
                          setUnpublishError('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 text-xs font-semibold flex items-center gap-1 transition"
                        title="Dépublier avec motif obligatoire"
                      >
                        <EyeOff size={13} />
                        <span>Dépublier</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRepublish(prod)}
                        className="px-2.5 py-1.5 rounded-lg border border-green-200 dark:border-green-800 text-[#1EB53A] hover:bg-green-50 dark:hover:bg-green-950 text-xs font-semibold flex items-center gap-1 transition"
                        title="Rétablir la publication en ligne"
                      >
                        <Eye size={13} />
                        <span>Republier</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Confirmez-vous la suppression définitive du produit "${prod.name}" ?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Supprimer définitivement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mandatory Unpublish Reason Dialog (Requirement 3.3) */}
      {unpublishingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Dépublier le produit</h3>
                <p className="text-xs text-slate-500">{unpublishingProduct.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Veuillez obligatoirement indiquer le motif du retrait du catalogue. Ce motif sera consigné dans le journal d'audit et consultable par la boutique.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Motif obligatoire du retrait *
              </label>
              <textarea
                value={unpublishReason}
                onChange={(e) => {
                  setUnpublishReason(e.target.value);
                  if (unpublishError) setUnpublishError('');
                }}
                rows={3}
                placeholder="Ex : Description mensongère, image de qualité insuffisante, produit interdit..."
                className={`w-full p-3 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                  unpublishError
                    ? 'border-red-500 bg-red-50/20'
                    : isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              />
              {unpublishError && (
                <p className="text-[11px] font-semibold text-red-500">{unpublishError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUnpublishingProduct(null);
                  setUnpublishReason('');
                  setUnpublishError('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmUnpublish}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
              >
                Confirmer la dépublication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
