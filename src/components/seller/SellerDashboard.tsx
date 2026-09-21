import React from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { SubOrder } from '../../types';
import {
  Store,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
} from 'lucide-react';

interface SellerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    orders,
    products,
    shops,
    settings,
    isDarkMode,
  } = useApp();

  const shop = shops.find((s) => s.sellerId === currentUser.id);

  // Extract only sub-orders assigned to this vendor (multi-vendor isolation)
  const vendorSubOrders: SubOrder[] = [];
  orders.forEach((order) => {
    order.subOrders.forEach((so) => {
      if (so.vendorId === currentUser.id) {
        vendorSubOrders.push(so);
      }
    });
  });

  const vendorProducts = products.filter((p) => p.vendorId === currentUser.id);

  // Stats calculation
  const totalSales = vendorSubOrders
    .filter((so) => so.status !== 'cancelled')
    .reduce((sum, so) => sum + so.vendorSubtotal, 0);

  const totalCommissions = vendorSubOrders
    .filter((so) => so.status !== 'cancelled')
    .reduce((sum, so) => sum + so.commissionAmount, 0);

  const netEarnings = totalSales - totalCommissions;

  const pendingCount = vendorSubOrders.filter(
    (so) => so.status === 'pending' || so.status === 'confirmed'
  ).length;

  const readyForPickupCount = vendorSubOrders.filter(
    (so) => so.status === 'ready_for_pickup'
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="seller-dashboard">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Tableau de bord Vendeur • {shop?.name || 'Ma Boutique'}
            </h1>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Gérez vos commandes clients, préparez les retraits et suivez vos encaissements Mobile Money.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('seller_products')}
            className="py-2 px-3.5 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus size={15} />
            Ajouter un produit
          </button>
          <button
            onClick={() => onNavigateTab('seller_shop_settings')}
            className="py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            Paramètres boutique
          </button>
        </div>
      </div>

      {/* Pickup Location Reminder Banner */}
      <div
        className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-green-50/70 border-green-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#1EB53A] shrink-0" />
          <div>
            <strong className="text-slate-900 dark:text-white block">
              Vos modalités de retrait en vigueur :
            </strong>
            <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
              {shop?.pickupLocation || 'Adresse non renseignée'} • {shop?.pickupHours}
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('seller_shop_settings')}
          className="text-xs font-bold text-[#1EB53A] hover:underline whitespace-nowrap"
        >
          Modifier l'adresse &rarr;
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Earnings */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Revenus nets</span>
            <div className="w-8 h-8 rounded-lg bg-[#1EB53A]/10 text-[#1EB53A] flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1EB53A]">
            {netEarnings.toLocaleString()} <span className="text-sm font-bold">FBu</span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mt-1">
            Après déduction commission E-Soko ({settings.commissionRate}%)
          </span>
        </div>

        {/* Total Sales */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ventes Brutes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalSales.toLocaleString()} <span className="text-sm font-bold">FBu</span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mt-1">
            {vendorSubOrders.length} commande(s) au total
          </span>
        </div>

        {/* Orders in progress */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">À préparer</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mt-1">
            Payées, en attente de préparation
          </span>
        </div>

        {/* Ready for pickup */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prêtes au retrait</span>
            <div className="w-8 h-8 rounded-lg bg-[#1EB53A]/10 text-[#1EB53A] flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1EB53A]">
            {readyForPickupCount}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mt-1">
            Articles attendant le client
          </span>
        </div>
      </div>

      {/* Recent Received Orders (Vendor Portion Only) */}
      <div
        className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#CE1126]" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Commandes récentes à honorer ({vendorSubOrders.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('seller_orders')}
            className="text-xs font-bold text-[#1EB53A] hover:underline flex items-center gap-1"
          >
            Toutes les commandes &rarr;
          </button>
        </div>

        {vendorSubOrders.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            Aucune commande reçue pour le moment. Vos futures ventes s’afficheront ici.
          </p>
        ) : (
          <div className="space-y-3">
            {vendorSubOrders.slice(0, 5).map((so) => (
              <div
                key={so.id}
                className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Sous-commande #{so.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        so.status === 'ready_for_pickup'
                          ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                          : so.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {so.status === 'ready_for_pickup'
                        ? 'Prête pour retrait'
                        : so.status === 'confirmed'
                        ? 'Payée - À préparer'
                        : so.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {so.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Net vendeur</span>
                    <span className="font-bold text-[#1EB53A]">
                      {so.vendorNet.toLocaleString()} FBu
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('seller_orders')}
                    className="py-1 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#1EB53A] hover:text-white text-xs font-semibold transition"
                  >
                    Gérer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Products */}
      <div
        className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Store size={18} className="text-[#1EB53A]" />
            Catalogue de vos produits en vente ({vendorProducts.length})
          </h3>
          <button
            onClick={() => onNavigateTab('seller_products')}
            className="text-xs font-bold text-[#1EB53A] hover:underline"
          >
            Gérer mes produits &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {vendorProducts.map((prod) => (
            <div
              key={prod.id}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <img
                src={prod.images[0]}
                alt={prod.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-200"
              />
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {prod.name}
                </h4>
                <span className="text-[#1EB53A] font-bold block">
                  {prod.price.toLocaleString()} FBu
                </span>
                <span className="text-[10px] text-slate-400">
                  Stock disponible : {prod.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
