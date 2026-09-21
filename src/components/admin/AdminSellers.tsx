import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Camera,
  ZoomIn,
  X,
  Trash2,
  Calendar,
} from 'lucide-react';

export const AdminSellers: React.FC = () => {
  const {
    shops,
    users,
    approveSeller,
    rejectSeller,
    toggleUserSuspension,
    deleteUser,
    isDarkMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'users'>('pending');
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);
  const [rejectingUser, setRejectingUser] = useState<{ id: string; name: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  const pendingUsers = users.filter((u) => u.sellerStatus === 'pending');
  const activeShops = shops;

  const handleConfirmRejection = async () => {
    if (!rejectingUser) return;
    if (!rejectionReason.trim()) {
      setRejectionError('Le motif du refus est obligatoire pour informer le candidat.');
      return;
    }
    await rejectSeller(rejectingUser.id, rejectionReason.trim());
    setRejectingUser(null);
    setRejectionReason('');
    setRejectionError('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="admin-sellers-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Gestion des Vendeurs, Boutiques & Utilisateurs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validez les nouvelles demandes de création de boutique avec vérification KYC et modérez les comptes.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>En attente</span>
            {pendingUsers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#CE1126] text-white text-[10px] flex items-center justify-center">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Boutiques Agréées ({activeShops.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'users'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tous les Utilisateurs ({users.length})
          </button>
        </div>
      </div>

      {/* Tab: Pending Applications */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Demandes de création de boutique à examiner ({pendingUsers.length})
          </div>

          {pendingUsers.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border space-y-2 ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <CheckCircle2 size={32} className="mx-auto text-[#1EB53A]" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Aucune demande en attente
              </h3>
              <p className="text-xs text-slate-500">
                Toutes les candidatures de marchands ont été traitées.
              </p>
            </div>
          ) : (
            pendingUsers.map((user) => {
              const shop = shops.find((s) => s.sellerId === user.id);

              return (
                <div
                  key={user.id}
                  className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                  id={`pending-seller-${user.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900 dark:text-white">
                          {shop?.name || 'Nouvelle Boutique'}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                          Candidature Vendeur
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                        <span>Responsable : <strong>{user.name}</strong></span>
                        <span>• Tél : {user.phone}</span>
                        <span>• Email : {user.email}</span>
                        {user.sellerApplicationDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            • <Calendar size={11} /> Soumise le : {new Date(user.sellerApplicationDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRejectingUser({ id: user.id, name: user.name });
                          setRejectionReason('');
                          setRejectionError('');
                        }}
                        className="py-2 px-3.5 rounded-xl border border-red-200 dark:border-red-900 text-[#CE1126] hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <XCircle size={14} /> Refuser
                      </button>
                      <button
                        onClick={() => approveSeller(user.id)}
                        className="py-2 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <CheckCircle2 size={14} /> Valider & Activer le vendeur
                      </button>
                    </div>
                  </div>

                  {/* KYC Documents: ID Card & Selfie with ID Side-by-Side (Requirement 3.2) */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#1EB53A]" />
                        Vérification d'Identité KYC (Pièces justificatives obligatoires)
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Cliquez sur une image pour l'agrandir en haute résolution
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* ID Card Front */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <FileText size={13} className="text-[#CE1126]" />
                          Photo de la Pièce d'Identité (CNI / Passeport)
                        </span>
                        {user.idCardUrl ? (
                          <div
                            onClick={() =>
                              setZoomedImage({
                                url: user.idCardUrl!,
                                title: `Pièce d'identité — ${user.name}`,
                              })
                            }
                            className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-44 bg-slate-200 dark:bg-slate-900"
                          >
                            <img
                              src={user.idCardUrl}
                              alt="Pièce d'identité"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-xs">
                              <ZoomIn size={16} /> Inspecter
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 flex flex-col items-center justify-center text-amber-700 dark:text-amber-300 p-3 text-center text-xs">
                            <AlertTriangle size={20} className="mb-1" />
                            <span>Document non fourni</span>
                          </div>
                        )}
                      </div>

                      {/* Selfie with ID */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Camera size={13} className="text-[#1EB53A]" />
                          Photo Selfie tenant la Pièce d'Identité
                        </span>
                        {user.idCardSelfieUrl ? (
                          <div
                            onClick={() =>
                              setZoomedImage({
                                url: user.idCardSelfieUrl!,
                                title: `Selfie avec Pièce d'identité — ${user.name}`,
                              })
                            }
                            className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-44 bg-slate-200 dark:bg-slate-900"
                          >
                            <img
                              src={user.idCardSelfieUrl}
                              alt="Selfie avec pièce d'identité"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-xs">
                              <ZoomIn size={16} /> Inspecter
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 flex flex-col items-center justify-center text-amber-700 dark:text-amber-300 p-3 text-center text-xs">
                            <AlertTriangle size={20} className="mb-1" />
                            <span>Selfie non fourni</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details of the proposed shop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300">
                        Description de l'activité commerciale :
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {shop?.description || 'Aucune description renseignée.'}
                      </p>
                      <div className="text-slate-500 pt-1">
                        <span>Ville : </span>
                        <strong>{shop?.city}</strong>
                      </div>
                    </div>

                    {/* Verification of pickup modalities */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin size={13} className="text-[#CE1126]" />
                        Modalités de Retrait proposées :
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        <strong>Adresse :</strong> {shop?.pickupLocation || 'Non précisée'}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        <strong>Créneaux :</strong> {shop?.pickupHours || 'Non précisés'}
                      </p>
                      <div className="pt-1 text-[10px] text-slate-400">
                        Lumicash: {shop?.lumicashNumber || 'N/A'} • EcoCash: {shop?.ecocashNumber || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Active Approved Shops */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Boutiques officiellement agréées sur E-Soko Burundi ({activeShops.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeShops.map((shop) => (
              <div
                key={shop.id}
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={shop.logoUrl}
                    alt={shop.name}
                    className="w-12 h-12 rounded-xl object-cover border bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {shop.name}
                      </h3>
                      {shop.isVerified && (
                        <ShieldCheck size={14} className="text-[#1EB53A] shrink-0" />
                      )}
                    </div>
                    <span className="text-slate-500 block">
                      Gérant : {shop.sellerName} • {shop.city}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1">
                    <MapPin size={12} className="text-[#CE1126] shrink-0 mt-0.5" />
                    <span>{shop.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-[#1EB53A] shrink-0" />
                    <span>{shop.pickupHours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Contact : {shop.phone}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1EB53A]/15 text-[#1EB53A]">
                    Boutique active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Users Management (Suspend / Activate / Delete) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Comptes Utilisateurs E-Soko ({users.length})
          </div>

          <div className="rounded-2xl border overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead
                className={`${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                } font-bold`}
              >
                <tr>
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-slate-200 bg-white'
                }`}
              >
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-500/5 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-3 capitalize font-semibold text-slate-700 dark:text-slate-300">
                      {u.role === 'admin'
                        ? 'Administrateur'
                        : u.role === 'seller'
                        ? 'Vendeur Agréé'
                        : 'Acheteur'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {u.phone || 'Non renseigné'}
                    </td>
                    <td className="p-3">
                      {u.status === 'suspended' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-950">
                          Suspendu
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-[#1EB53A] dark:bg-green-950">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleUserSuspension(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              u.status === 'suspended'
                                ? 'bg-[#1EB53A] hover:bg-[#199931] text-white'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Confirmez-vous la suppression définitive du compte de ${u.name} (${u.email}) ?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KYC Image Zoom Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden p-2 space-y-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-1 border-b border-slate-800 text-white">
              <span className="font-bold text-sm">{zoomedImage.title}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-auto max-h-[78vh] flex items-center justify-center p-1 bg-black rounded-xl">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Reason Dialog (Requirement 3.2) */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[#CE1126] shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Refuser la candidature</h3>
                <p className="text-xs text-slate-500">Candidat : {rejectingUser.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Veuillez obligatoirement indiquer le motif du refus. Ce motif sera enregistré dans le registre d'audit et affiché au candidat vendeur.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Motif obligatoire du refus *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) setRejectionError('');
                }}
                rows={3}
                placeholder="Ex : Document d'identité illisible, selfie flou ou non concordant..."
                className={`w-full p-3 rounded-xl border text-xs focus:ring-2 focus:ring-[#CE1126] focus:outline-none ${
                  rejectionError
                    ? 'border-red-500 bg-red-50/20'
                    : isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              />
              {rejectionError && (
                <p className="text-[11px] font-semibold text-red-500">{rejectionError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingUser(null);
                  setRejectionReason('');
                  setRejectionError('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-4 py-2 rounded-xl bg-[#CE1126] hover:bg-[#b00f20] text-white text-xs font-bold shadow-xs transition"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
