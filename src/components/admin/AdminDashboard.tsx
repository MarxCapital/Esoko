import React from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  TrendingUp,
  Store,
  Users,
  Package,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    orders,
    shops,
    users,
    products,
    settings,
    disputes,
    adminActionLogs,
    isDarkMode,
  } = useApp();

  // Platform metrics
  const totalVolume = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const platformCommissions = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => {
      return (
        sum +
        o.subOrders.reduce((subSum, so) => subSum + so.commissionAmount, 0)
      );
    }, 0);

  const activeSellersCount = shops.filter((s) => s.isVerified).length;
  const pendingSellersCount = users.filter((u) => u.sellerStatus === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="admin-dashboard">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Console d'Administration Nationale • E-Soko Burundi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervision globale de la marketplace, des flux financiers Mobile Money et de la modération.
          </p>
        </div>

        {/* Commission Rate badge */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-xs">
          <span className="text-slate-500 font-medium">Taux Commission Actuel :</span>
          <span className="font-black text-[#1EB53A] text-sm">{settings.commissionRate}%</span>
        </div>
      </div>

      {/* Pending Sellers Notification Banner */}
      {pendingSellersCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-3 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>
              <strong>{pendingSellersCount} demande(s) de création de boutique</strong> en attente de validation administrative (KYC).
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('admin_sellers')}
            className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition whitespace-nowrap"
          >
            Examiner les candidatures &rarr;
          </button>
        </div>
      )}

      {/* Open Disputes Notification Banner */}
      {openDisputesCount > 0 && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs flex items-center justify-between gap-3 text-red-800 dark:text-red-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-[#CE1126] shrink-0" />
            <span>
              <strong>{openDisputesCount} litige(s) client(s) ouvert(s)</strong> nécessitant un arbitrage ou remboursement.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('admin_disputes')}
            className="py-1.5 px-3 rounded-lg bg-[#CE1126] hover:bg-[#b00f20] text-white font-bold transition whitespace-nowrap"
          >
            Arbitrer les litiges &rarr;
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV Volume */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Volume d'Affaires</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalVolume.toLocaleString()} <span className="text-sm font-bold">FBu</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {orders.length} commandes enregistrées
          </span>
        </div>

        {/* Platform Revenue */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Commissions Perçues</span>
            <div className="w-8 h-8 rounded-lg bg-[#1EB53A]/10 text-[#1EB53A] flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1EB53A]">
            {platformCommissions.toLocaleString()} <span className="text-sm font-bold">FBu</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Revenus nets plateforme E-Soko
          </span>
        </div>

        {/* Active Shops */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Boutiques Agréées</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-[#CE1126] flex items-center justify-center font-bold">
              <Store size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeSellersCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Vendeurs burundais vérifiés
          </span>
        </div>

        {/* Total Registered Users */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Utilisateurs</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {users.length}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Acheteurs & Vendeurs inscrits
          </span>
        </div>
      </div>

      {/* Global Orders Feed and Mobile Money Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions list */}
        <div
          className={`lg:col-span-2 p-5 rounded-2xl border space-y-4 shadow-2xs ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Package size={16} className="text-[#CE1126]" />
              Dernières Transactions de la Plateforme
            </h3>
            <button
              onClick={() => onNavigateTab('admin_orders')}
              className="text-xs font-bold text-[#1EB53A] hover:underline flex items-center gap-1"
            >
              Toutes les commandes &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className={`p-3.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                  isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {order.buyerName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentOperator === 'lumicash'
                          ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                          : 'bg-[#CE1126]/15 text-[#CE1126]'
                      }`}
                    >
                      {order.paymentOperator.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {order.subOrders.length} boutique(s) impliquée(s) :{' '}
                    {order.subOrders.map((s) => s.shopName).join(', ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-white block">
                    {order.totalAmount.toLocaleString()} FBu
                  </span>
                  <span className="text-[10px] text-[#1EB53A] font-bold">
                    Comm: +
                    {order.subOrders
                      .reduce((sum, so) => sum + so.commissionAmount, 0)
                      .toLocaleString()}{' '}
                    FBu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Administration Actions */}
        <div
          className={`p-5 rounded-2xl border space-y-4 shadow-2xs flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1EB53A]" />
              Accès Rapides Admin
            </h3>
            <p className="text-xs text-slate-500">
              Pilotez l'ensemble des modules régulés par le cahier des charges E-Soko.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('admin_sellers')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Validation Vendeurs & Retraits</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigateTab('admin_products')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Modération des Produits ({products.length})</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigateTab('admin_orders')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Flux Financiers & Audit</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigateTab('admin_disputes')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Litiges Commandes & Modération Avis</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigateTab('admin_settings')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Commission, Catégories & Nouveaux Admins</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigateTab('admin_audit')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-left flex items-center justify-between text-slate-700 dark:text-slate-300 transition"
              >
                <span>Journal d'Audit Administratif Complet</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Plateforme E-Soko Burundi v1.0 • Hébergée et synchronisée localement.
          </div>
        </div>
      </div>
    </div>
  );
};
