import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Order, SubOrder } from '../../types';
import {
  Package,
  Store,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BuyerOrdersProps {
  onOpenChat: (shopId: string, subOrderId?: string) => void;
  onOpenShop: (shopId: string) => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({ onOpenChat, onOpenShop }) => {
  const { orders, currentUser, isDarkMode, cancelOrder } = useApp();
  const [expandedOrders, setExpandedOrders] = useState<{ [id: string]: boolean }>({});

  const userOrders = orders.filter((o) => o.buyerId === currentUser.id);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <CheckCircle2 size={12} /> Confirmée & Payée
          </span>
        );
      case 'ready_for_pickup':
      case 'partially_ready':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1EB53A]/15 text-[#1EB53A] flex items-center gap-1 border border-[#1EB53A]/30">
            <MapPin size={12} /> Prête pour retrait !
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <CheckCircle2 size={12} /> Retrait effectué
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={12} /> Annulée
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center gap-1">
            <Clock size={12} /> En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="buyer-orders-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Historique de mes commandes ({userOrders.length})
            </h1>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
            Suivez la préparation de vos sous-commandes et retrouvez les coordonnées de retrait pour chaque commerçant.
          </p>
        </div>

        {/* Retrait policy alert */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 max-w-sm">
          <span className="font-black text-slate-900 dark:text-white block mb-0.5">
            📍 Rappel Retrait :
          </span>
          Chaque boutique prépare ses propres articles. Munissez-vous de votre référence de transaction lors de votre passage.
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Package size={28} />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Vous n'avez pas encore passé de commande
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto font-medium">
            Découvrez nos marchands locaux et effectuez vos premiers achats en toute confiance.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {userOrders.map((order) => {
            const isExpanded = expandedOrders[order.id] !== false; // default expanded

            return (
              <div
                key={order.id}
                className={`rounded-2xl border overflow-hidden transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
                id={`order-card-${order.id}`}
              >
                {/* Master Order Header */}
                <div
                  className={`p-4 flex flex-wrap items-center justify-between gap-3 border-b cursor-pointer select-none ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1EB53A]/10 text-[#1EB53A] flex items-center justify-center">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Commande #{order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • Paiement {order.paymentOperator.toUpperCase()} ({order.transactionId})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">Total payé</span>
                      <span className="text-base font-black text-[#1EB53A]">
                        {order.totalAmount.toLocaleString()} FBu
                      </span>
                    </div>
                    <button className="text-slate-500 dark:text-slate-400 p-1">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* SubOrders List (split by vendor) */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Sous-commandes réparties par commerçant ({order.subOrders.length})
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {order.subOrders.map((so: SubOrder) => (
                        <div
                          key={so.id}
                          className={`p-4 rounded-xl border text-xs space-y-3 ${
                            isDarkMode
                              ? 'bg-slate-800/60 border-slate-700'
                              : 'bg-white border-slate-200 shadow-2xs'
                          }`}
                        >
                          {/* Vendor SubOrder Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <Store size={15} className="text-[#CE1126]" />
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {so.shopName}
                              </span>
                              <button
                                onClick={() => onOpenShop(so.shopId)}
                                className="text-[11px] text-[#1EB53A] font-semibold hover:underline flex items-center gap-0.5"
                              >
                                <ExternalLink size={11} /> Voir boutique
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(so.status)}
                              <span className="font-bold text-slate-900 dark:text-white">
                                {so.vendorSubtotal.toLocaleString()} FBu
                              </span>
                            </div>
                          </div>

                          {/* Items in this suborder */}
                          <div className="space-y-2">
                            {so.items.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between gap-2 py-1"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-md object-cover bg-slate-100"
                                  />
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {item.name} <strong className="text-slate-400">×{item.quantity}</strong>
                                  </span>
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {(item.price * item.quantity).toLocaleString()} FBu
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Pickup coordinates box */}
                          <div
                            className={`p-3 rounded-lg text-[11px] space-y-1.5 ${
                              isDarkMode
                                ? 'bg-slate-900/90 text-slate-300'
                                : 'bg-[#F8F9FA] text-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-1.5">
                              <MapPin size={14} className="text-[#CE1126] shrink-0 mt-0.5" />
                              <span>
                                <strong>Adresse de retrait :</strong> {so.pickupLocation}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-[#1EB53A] shrink-0" />
                              <span>
                                <strong>Créneaux d'ouverture :</strong> {so.pickupHours}
                              </span>
                            </div>
                            {so.status === 'ready_for_pickup' && (
                              <div className="pt-1 text-[#1EB53A] font-bold flex items-center gap-1">
                                <CheckCircle2 size={13} /> Vos articles sont emballés et vous attendent sur place !
                              </div>
                            )}
                          </div>

                          {/* Contact button */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => onOpenChat(so.shopId, so.id)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                            >
                              <MessageSquare size={13} />
                              Écrire au commerçant ({so.shopName})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
