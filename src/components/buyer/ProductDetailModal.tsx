import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Product } from '../../types';
import {
  X,
  Star,
  Store,
  MapPin,
  Clock,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenShop: (shopId: string) => void;
  onOpenChat: (shopId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenShop,
  onOpenChat,
}) => {
  const {
    shops,
    addToCart,
    reviews,
    addReview,
    currentUser,
    isDarkMode,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const shop = shops.find((s) => s.id === product.shopId || s.sellerId === product.vendorId);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(product.id, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      id="modal-product-detail"
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border my-8 max-h-[90vh] flex flex-col ${
          isDarkMode
            ? 'bg-[#151522] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header with Close and Logo badge */}
        <div
          className={`p-4 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-200 bg-[#F8F9FA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Fiche Produit • {product.shopName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Images */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIndex(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        selectedImgIndex === i
                          ? 'border-[#1EB53A]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= Math.round(product.rating) ? 'fill-amber-400' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    {product.rating} / 5
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">({product.reviewsCount} avis)</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="p-3 rounded-xl bg-[#1EB53A]/10 border border-[#1EB53A]/20 inline-block">
                  <span className="text-xs text-slate-700 dark:text-slate-300 block font-bold">
                    Prix de vente
                  </span>
                  <span className="text-2xl font-black text-[#1EB53A]">
                    {product.price.toLocaleString()} <span className="text-sm font-bold">FBu</span>
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Description
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>

                {/* Stock info */}
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <span>Disponibilité : </span>
                  {product.stock > 0 ? (
                    <strong className="text-[#1EB53A]">En stock ({product.stock} unités)</strong>
                  ) : (
                    <strong className="text-red-600 font-bold">Rupture de stock</strong>
                  )}
                </div>
              </div>

              {/* Vendor & Pickup Location details */}
              {shop && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store size={15} className="text-[#CE1126]" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {shop.name}
                      </span>
                      {shop.isVerified && (
                        <span className="text-[10px] bg-[#1EB53A]/10 text-[#1EB53A] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <ShieldCheck size={11} /> Vendeur vérifié
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenShop(shop.id);
                      }}
                      className="text-[#1EB53A] font-bold hover:underline flex items-center gap-0.5"
                    >
                      Boutique &rarr;
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={13} className="text-slate-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">Point de retrait :</strong> {shop.pickupLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-500 shrink-0" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">Horaires :</strong> {shop.pickupHours}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenChat(shop.id);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare size={13} />
                      Contacter le vendeur pour le retrait
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-40"
                  >
                    {addedNotice ? (
                      <>
                        <Check size={16} /> Ajouté au panier !
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Ajouter {(product.price * quantity).toLocaleString()} FBu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Reviews & Ratings */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Star size={16} className="text-amber-500 fill-amber-400" />
              Avis et évaluations des acheteurs ({productReviews.length})
            </h3>

            {/* Existing Reviews */}
            {productReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aucun avis pour le moment sur cet article. Soyez le premier à donner votre appréciation !
              </p>
            ) : (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {rev.buyerName}
                        </span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>

                    {rev.vendorReply && (
                      <div className="mt-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-[11px] text-green-800 dark:text-green-300">
                        <strong>Réponse du commerçant :</strong> {rev.vendorReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Leave a review form */}
            {currentUser.role === 'buyer' && (
              <form
                onSubmit={handleReviewSubmit}
                className={`p-4 rounded-xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Laisser un avis sur ce produit
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Votre note :</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 focus:outline-hidden hover:scale-110 transition"
                      >
                        <Star
                          size={18}
                          className={star <= newRating ? 'fill-amber-400' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre retour d’expérience sur la qualité du produit et la rapidité du retrait..."
                  rows={2}
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />

                <div className="flex justify-between items-center">
                  {reviewSubmitted && (
                    <span className="text-xs text-[#1EB53A] font-bold flex items-center gap-1">
                      <Check size={14} /> Merci pour votre avis !
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="ml-auto py-1.5 px-3.5 rounded-lg bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs disabled:opacity-40 transition"
                  >
                    Publier l'avis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
