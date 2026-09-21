import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { SubOrder, SubOrderStatus } from '../../types';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  XCircle,
  Phone,
  MessageSquare,
} from 'lucide-react';

interface SellerOrdersProps {
  onOpenChat: (shopId: string, subOrderId?: string) => void;
}

export const SellerOrders: React.FC<SellerOrdersProps> = ({ onOpenChat }) => {
  const { orders, currentUser, updateSubOrderStatus, shops, isDarkMode } = useApp();

  const [selectedSubOrderForCancel, setSelectedSubOrderForCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const shop = shops.find((s) => s.sellerId === currentUser.id);

  // Extract all suborders assigned to this vendor
  const vendorSubOrdersWithParent: { orderId: string; buyerName: string; buyerPhone: string; subOrder: SubOrder }[] = [];
  orders.forEach((order) => {
    order.subOrders.forEach((so) => {
      if (so.vendorId === currentUser.id) {
        vendorSubOrdersWithParent.push({
          orderId: order.id,
          buyerName: order.buyerName,
          buyerPhone: order.buyerPhone,
          subOrder: so,
        });
      }
    });
  });

  const filtered = vendorSubOrdersWithParent.filter(({ subOrder }) => {
    if (filterStatus === 'all') return true;
    return subOrder.status === filterStatus;
  });

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubOrderForCancel || !cancelReason.trim()) return;
    updateSubOrderStatus(selectedSubOrderForCancel, 'cancelled', cancelReason.trim());
    setSelectedSubOrderForCancel(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="seller-orders-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Commandes Reçues par ma Boutique ({vendorSubOrdersWithParent.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Préparez vos articles et marquez-les comme "Prêts pour retrait" pour alerter l'acheteur.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filterStatus === 'all'
                ? 'bg-[#1EB53A] border-[#1EB53A] text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filterStatus === 'confirmed'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            À préparer
          </button>
          <button
            onClick={() => setFilterStatus('ready_for_pickup')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filterStatus === 'ready_for_pickup'
                ? 'bg-[#1EB53A] border-[#1EB53A] text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Prêtes au retrait
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filterStatus === 'completed'
                ? 'bg-slate-700 border-slate-700 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Terminées
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <Package size={32} className="mx-auto text-slate-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Aucune sous-commande dans cette catégorie
          </h3>
          <p className="text-xs text-slate-500">
            Dès qu’un acheteur règle un panier contenant vos produits, la commande apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ orderId, buyerName, buyerPhone, subOrder: so }) => (
            <div
              key={so.id}
              className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
              id={`seller-suborder-${so.id}`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Sous-commande #{so.id}
                    </span>
                    <span className="text-xs text-slate-400">(Commande mère #{orderId})</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Acheteur : <strong>{buyerName}</strong> • {buyerPhone}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Net Vendeur</span>
                    <span className="font-black text-sm text-[#1EB53A]">
                      {so.vendorNet.toLocaleString()} FBu
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (Brut: {so.vendorSubtotal.toLocaleString()} FBu - Comm: {so.commissionAmount.toLocaleString()} FBu)
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Articles commandés à préparer :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {so.items.map((item) => (
                    <div
                      key={item.productId}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs ${
                        isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-slate-500">
                          Quantité : <strong className="text-slate-800 dark:text-slate-200">×{item.quantity}</strong>
                        </span>
                        <span className="text-[#1EB53A] font-semibold block text-[11px]">
                          {(item.price * item.quantity).toLocaleString()} FBu
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup info for this vendor */}
              <div className="text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#CE1126]" />
                  <span>
                    <strong>Lieu convenu de retrait :</strong> {so.pickupLocation} ({so.pickupHours})
                  </span>
                </div>
                <button
                  onClick={() => onOpenChat(so.shopId, so.id)}
                  className="text-xs text-[#1EB53A] font-bold hover:underline flex items-center gap-1"
                >
                  <MessageSquare size={13} /> Contacter l'acheteur
                </button>
              </div>

              {/* Status and Action Buttons (Section 2.2) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Statut actuel :</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      so.status === 'ready_for_pickup'
                        ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                        : so.status === 'completed'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : so.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-950 text-red-600'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {so.status === 'ready_for_pickup'
                      ? 'Prête pour retrait'
                      : so.status === 'completed'
                      ? 'Retrait effectué (Terminé)'
                      : so.status === 'cancelled'
                      ? `Annulé (${so.cancelReason || 'Sans motif'})`
                      : 'Payé - À préparer'}
                  </span>
                </div>

                {/* Workflow Actions */}
                <div className="flex items-center gap-2">
                  {so.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => updateSubOrderStatus(so.id, 'ready_for_pickup')}
                      className="py-2 px-3.5 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <CheckCircle2 size={15} />
                      Marquer comme prête pour retrait
                    </button>
                  )}

                  {so.status === 'ready_for_pickup' && (
                    <button
                      type="button"
                      onClick={() => updateSubOrderStatus(so.id, 'completed')}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <CheckCircle2 size={15} />
                      Confirmer le retrait par le client
                    </button>
                  )}

                  {so.status !== 'completed' && so.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => setSelectedSubOrderForCancel(so.id)}
                      className="py-2 px-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition"
                    >
                      Annuler avec motif
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal with Mandatory Reason (Section 2.2) */}
      {selectedSubOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`p-6 rounded-2xl max-w-md w-full border space-y-4 shadow-xl ${
              isDarkMode ? 'bg-[#151522] border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-[#CE1126]">
              <AlertCircle size={20} />
              <h3 className="font-bold text-base">Annuler la sous-commande</h3>
            </div>
            <p className="text-xs text-slate-500">
              Conformément aux règles E-Soko, vous devez obligatoirement spécifier le motif de l'annulation (ex: rupture imprévue de stock, produit défectueux).
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Indiquez le motif précis de l'annulation..."
                rows={3}
                required
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubOrderForCancel(null);
                    setCancelReason('');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 rounded-xl bg-[#CE1126] hover:bg-[#B30E1F] text-white text-xs font-bold disabled:opacity-40"
                >
                  Confirmer l'annulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
