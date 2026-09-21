import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
} from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const { adminActionLogs, auditLogs, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = adminActionLogs.filter((log) => {
    if (filterAction !== 'all' && log.actionType !== filterAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.adminName.toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case 'VALIDATION_VENDEUR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-[#1EB53A] dark:bg-green-950 flex items-center gap-1 w-fit">
            <CheckCircle2 size={11} /> Approbation Vendeur
          </span>
        );
      case 'REJET_VENDEUR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#CE1126] dark:bg-red-950 flex items-center gap-1 w-fit">
            <XCircle size={11} /> Rejet Vendeur
          </span>
        );
      case 'DEPUBLICATION_PRODUIT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 flex items-center gap-1 w-fit">
            <AlertTriangle size={11} /> Dépublication Produit
          </span>
        );
      case 'MODIFICATION_COMMISSION':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-950 flex items-center gap-1 w-fit">
            <Tag size={11} /> Modif. Commission
          </span>
        );
      case 'CREATION_ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-950 flex items-center gap-1 w-fit">
            <ShieldCheck size={11} /> Création Admin
          </span>
        );
      case 'SUSPENSION_COMPTE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 flex items-center gap-1 w-fit">
            <AlertTriangle size={11} /> Suspension Compte
          </span>
        );
      case 'REACTIVATION_COMPTE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 flex items-center gap-1 w-fit">
            <CheckCircle2 size={11} /> Réactivation Compte
          </span>
        );
      case 'SUPPRESSION_COMPTE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-200 text-red-900 dark:bg-red-950 flex items-center gap-1 w-fit">
            <XCircle size={11} /> Suppression Compte
          </span>
        );
      case 'SUPPRESSION_AVIS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 flex items-center gap-1 w-fit">
            <FileText size={11} /> Modération Avis
          </span>
        );
      case 'RESOLUTION_LITIGE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700 dark:bg-teal-950 flex items-center gap-1 w-fit">
            <CheckCircle2 size={11} /> Résolution Litige
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {actionType}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="admin-audit-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Journal d'Audit Administratif & Traçabilité ({adminActionLogs.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registre officiel et inaltérable de toutes les opérations de gouvernance et de modération effectuées par les administrateurs.
          </p>
        </div>

        {/* Search & Action Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans l'audit..."
              className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
              }`}
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
            }`}
          >
            <option value="all">Toutes les actions</option>
            <option value="VALIDATION_VENDEUR">Approbation Vendeur</option>
            <option value="REJET_VENDEUR">Rejet Vendeur</option>
            <option value="DEPUBLICATION_PRODUIT">Dépublication Produit</option>
            <option value="MODIFICATION_COMMISSION">Modification Commission</option>
            <option value="CREATION_ADMIN">Création Admin</option>
            <option value="SUSPENSION_COMPTE">Suspension Compte</option>
            <option value="RESOLUTION_LITIGE">Résolution Litige</option>
            <option value="SUPPRESSION_AVIS">Suppression Avis</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table (Requirement 4.3) */}
      <div className="rounded-2xl border overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead
            className={`${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            } font-bold`}
          >
            <tr>
              <th className="p-3">Date & Heure</th>
              <th className="p-3">Administrateur</th>
              <th className="p-3">Type d'Action</th>
              <th className="p-3">Cible</th>
              <th className="p-3">Détails & Motif obligatoire</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-slate-200 bg-white'
            }`}
          >
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  Aucun événement d'audit ne correspond à vos filtres.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-500/5 transition">
                  {/* Date & Time */}
                  <td className="p-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(log.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                    <div>{new Date(log.timestamp).toLocaleTimeString('fr-FR')}</div>
                  </td>

                  {/* Admin info */}
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User size={12} className="text-slate-400" />
                      {log.adminName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.adminEmail}</div>
                  </td>

                  {/* Action Type */}
                  <td className="p-3">{getActionBadge(log.actionType)}</td>

                  {/* Target */}
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {log.target}
                  </td>

                  {/* Details / Motive */}
                  <td className="p-3">
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-md">
                      {log.details}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
