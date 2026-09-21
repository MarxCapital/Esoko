import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Order, SubOrder } from '../../types';
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  Store,
  DollarSign,
  RotateCcw,
  Search,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, transactions, refundTransaction, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'transactions'>('orders');
  const [operatorFilter, setOperatorFilter] = useState<'all' | 'lumicash' | 'ecocash'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (operatorFilter !== 'all' && o.paymentOperator !== operatorFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.buyerPhone.includes(q) ||
        o.transactionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredTransactions = transactions.filter((t) => {
    if (operatorFilter !== 'all' && t.operator !== operatorFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.phoneNumber.includes(q) ||
        t.ussdRef.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="admin-orders-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Flux Financiers & Audit des Commandes Plateforme
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Traçabilité complète des transactions Mobile Money et des sous-commandes éclatées par boutique.
          </p>
        </div>

        {/* Tab & Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Commandes Mères ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'transactions'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Journal Transactions Mobile Money ({transactions.length})
            </button>
          </div>

          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value as any)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs font-medium ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <option value="all">Tous opérateurs</option>
            <option value="lumicash">Lumicash uniquement</option>
            <option value="ecocash">EcoCash uniquement</option>
          </select>
        </div>
      </div>

      {/* Tab: Orders with Multi-vendor sub-orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className={`${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                } font-bold`}
              >
                <tr>
                  <th className="p-3">Réf Commande</th>
                  <th className="p-3">Acheteur</th>
                  <th className="p-3">Boutiques Concernées</th>
                  <th className="p-3">Montant Total</th>
                  <th className="p-3">Opérateur MM</th>
                  <th className="p-3">Statut Global</th>
                  <th className="p-3 text-right">Commission E-Soko</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-slate-200 bg-white'
                }`}
              >
                {filteredOrders.map((order) => {
                  const comm = order.subOrders.reduce(
                    (acc, so) => acc + so.commissionAmount,
                    0
                  );

                  return (
                    <tr key={order.id} className="hover:bg-slate-500/5 transition">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.id}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.buyerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {order.buyerPhone}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1">
                          {order.subOrders.map((so) => (
                            <div key={so.id} className="flex items-center gap-1.5 text-[11px]">
                              <Store size={12} className="text-[#CE1126]" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {so.shopName}
                              </span>
                              <span className="text-slate-400">
                                ({so.vendorSubtotal.toLocaleString()} FBu)
                              </span>
                              <span
                                className={`text-[9px] px-1.5 rounded-sm font-bold ${
                                  so.status === 'ready_for_pickup'
                                    ? 'bg-[#1EB53A]/20 text-[#1EB53A]'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {so.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 font-black text-[#1EB53A]">
                        {order.totalAmount.toLocaleString()} FBu
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentOperator === 'lumicash'
                              ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                              : 'bg-[#CE1126]/15 text-[#CE1126]'
                          }`}
                        >
                          {order.paymentOperator.toUpperCase()}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {order.transactionId}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : order.status === 'partially_ready'
                              ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                              : order.status === 'completed'
                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-800'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-3 text-right font-black text-[#1EB53A]">
                        +{comm.toLocaleString()} FBu
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Detailed Mobile Money Transaction Log (Section 4.3 & 4.4) */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className={`${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                } font-bold`}
              >
                <tr>
                  <th className="p-3">Réf Transaction</th>
                  <th className="p-3">Date & Heure</th>
                  <th className="p-3">Numéro Payeur (+257)</th>
                  <th className="p-3">Opérateur</th>
                  <th className="p-3">Montant (FBu)</th>
                  <th className="p-3">Statut USSD</th>
                  <th className="p-3 text-right">Action Régulation</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-slate-200 bg-white'
                }`}
              >
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-500/5 transition">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {tx.ussdRef}
                      <div className="text-[10px] text-slate-400 font-sans">
                        Cmd: #{tx.orderId}
                      </div>
                    </td>

                    <td className="p-3 text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="p-3 font-mono font-medium text-slate-900 dark:text-white">
                      {tx.phoneNumber}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.operator === 'lumicash'
                            ? 'bg-[#1EB53A]/15 text-[#1EB53A]'
                            : 'bg-[#CE1126]/15 text-[#CE1126]'
                        }`}
                      >
                        {tx.operator.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 font-black text-slate-900 dark:text-white">
                      {tx.amount.toLocaleString()} FBu
                    </td>

                    <td className="p-3">
                      {tx.status === 'successful' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-[#1EB53A] dark:bg-green-950">
                          Confirmé (Push Validé)
                        </span>
                      ) : tx.status === 'refunded' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950">
                          Remboursé au client
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-950">
                          Échoué / Expiré
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {tx.status === 'successful' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                `Confirmez-vous le remboursement de ${tx.amount.toLocaleString()} FBu vers ${tx.phoneNumber} (${tx.operator}) ?`
                              )
                            ) {
                              refundTransaction(tx.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw size={11} /> Rembourser
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
