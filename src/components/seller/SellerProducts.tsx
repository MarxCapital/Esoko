import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Product } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Store,
  Eye,
  EyeOff,
} from 'lucide-react';

export const SellerProducts: React.FC = () => {
  const {
    products,
    categories,
    currentUser,
    shops,
    addProduct,
    updateProduct,
    deleteProduct,
    isDarkMode,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(10000);
  const [stock, setStock] = useState(10);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const shop = shops.find((s) => s.sellerId === currentUser.id);
  const vendorProducts = products.filter((p) => p.vendorId === currentUser.id);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(15000);
    setStock(10);
    setCategoryId(categories[0]?.id || 'cat-1');
    setImageUrl('https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setStock(p.stock);
    setCategoryId(p.categoryId);
    setImageUrl(p.images[0] || '');
    setIsPublished(p.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shop) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        images: imageUrl.trim() ? [imageUrl.trim()] : editingProduct.images,
        isPublished,
      });
    } else {
      addProduct({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        vendorId: currentUser.id,
        shopId: shop.id,
        shopName: shop.name,
        images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'],
        isPublished,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="seller-products-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Gestion de mes Produits ({vendorProducts.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Boutique : <strong>{shop?.name}</strong> • Tarifs en Francs Burundais (FBu).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus size={16} />
          Ajouter un nouvel article
        </button>
      </div>

      {/* Products list table / cards */}
      {vendorProducts.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <Store size={32} className="mx-auto text-slate-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Votre boutique n'a pas encore de produit
          </h3>
          <p className="text-xs text-slate-500">
            Publiez vos premiers articles pour commencer à recevoir des commandes.
          </p>
          <button
            onClick={openAddModal}
            className="py-2 px-4 rounded-xl bg-[#1EB53A] text-white font-bold text-xs"
          >
            Ajouter un produit maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vendorProducts.map((prod) => (
            <div
              key={prod.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.stock > 0 ? 'bg-[#1EB53A] text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    Stock : {prod.stock}
                  </span>
                  {!prod.isPublished && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-600 text-white">
                      Brouillon
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                  <span className="font-black text-sm text-[#1EB53A] block mt-2">
                    {prod.price.toLocaleString()} FBu
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                      {categories.find((c) => c.id === prod.categoryId)?.name || 'Catégorie'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Modifier"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden my-6 ${
              isDarkMode ? 'bg-[#151522] border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-100 bg-[#F8F9FA]'
              }`}
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProduct ? 'Modifier l’article' : 'Ajouter un nouvel article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Café Bourbon Pur Washed de Kayanza"
                  required
                  className={`w-full p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prix de vente (FBu)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className={`w-full p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    required
                    className={`w-full p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catégorie E-Soko
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description détaillée
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Détails sur l'origine, spécificités, conditionnement..."
                  className={`w-full p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de l'image du produit
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publish-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded-sm text-[#1EB53A] focus:ring-[#1EB53A]"
                />
                <label htmlFor="publish-check" className="font-semibold text-slate-700 dark:text-slate-300">
                  Visible immédiatement dans le catalogue public E-Soko
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold shadow-xs transition"
                >
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
