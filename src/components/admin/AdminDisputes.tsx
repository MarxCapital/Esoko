import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Dispute, Review } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  Star,
  User,
  Store,
  Calendar,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';

export const AdminDisputes: React.FC = () => {
  const {
    disputes,
    resolveDispute,
    reviews,
    deleteReviewWithReason,
    refundTransaction,
    transactions,
    orders,
    sendMessage,
    isDarkMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'disputes' | 'reviews'>('disputes');

  // Dispute resolution state
  const [resolvingDispute, setResolvingDispute] = useState<Dispute | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionError, setResolutionError] = useState('');

  // Review deletion state
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [reviewDeleteReason, setReviewDeleteReason] = useState('');
  const [reviewDeleteError, setReviewDeleteError] = useState('');

  // Contact modal state
  const [contactRecipient, setContactRecipient] = useState<{
    role: 'buyer' | 'seller';
    id: string;
    name: string;
    shopId?: string;
    orderId?: string;
  } | null>(null);
  const [contactMessageText, setContactMessageText] = useState('');
  const [contactMessageSent, setContactMessageSent] = useState(false);

  const openDisputes = disputes.filter((d) => d.status === 'open');

  const handleConfirmResolve = async () => {
    if (!resolvingDispute) return;
    if (!resolutionNote.trim()) {
      setResolutionError('Veuillez obligatoirement indiquer la note ou décision de résolution.');
      return;
    }
    await resolveDispute(resolvingDispute.id, resolutionNote.trim());
    setResolvingDispute(null);
    setResolutionNote('');
    setResolutionError('');
  };

  const handleConfirmDeleteReview = async () => {
    if (!deletingReview) return;
    if (!reviewDeleteReason.trim()) {
      setReviewDeleteError('Le motif du retrait de l’avis est obligatoire.');
      return;
    }
    await deleteReviewWithReason(deletingReview.id, reviewDeleteReason.trim());
    setDeletingReview(null);
    setReviewDeleteReason('');
    setReviewDeleteError('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactRecipient || !contactMessageText.trim()) return;

    await sendMessage(
      contactRecipient.shopId || 'marketplace_admin',
      contactRecipient.id,
      contactMessageText.trim(),
      contactRecipient.orderId
    );

    setContactMessageSent(true);
    setTimeout(() => {
      setContactMessageSent(false);
      setContactRecipient(null);
      setContactMessageText('');
    }, 2000);
  };

  const handleForceRefund = async (dispute: Dispute) => {
    const order = orders.find((o) => o.id === dispute.orderId);
    if (!order) {
      alert(`Commande ${dispute.orderId} introuvable.`);
      return;
    }

    if (
      window.confirm(
        `Confirmez-vous le remboursement forcé de ${dispute.amount.toLocaleString()} FBu à l'acheteur ${dispute.buyerName} via ${order.paymentOperator.toUpperCase()} ?`
      )
    ) {
      if (order.transactionId) {
        await refundTransaction(order.transactionId);
      }
      await resolveDispute(
        dispute.id,
        `Remboursement forcé de ${dispute.amount.toLocaleString()} FBu accordé à l'acheteur.`
      );
      alert('Remboursement exécuté avec succès et litige clôturé.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="admin-disputes-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Gestion des Litiges & Modération des Avis
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Traitez les signalements sur les commandes et modérez les retours d'expérience avec motif obligatoire.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Litiges Commandes</span>
            {openDisputes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#CE1126] text-white text-[10px] flex items-center justify-center">
                {openDisputes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'reviews'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Modération des Avis ({reviews.length})
          </button>
        </div>
      </div>

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Commandes Signalées & Litiges Clients ({disputes.length})
          </div>

          {disputes.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border space-y-2 ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <CheckCircle2 size={32} className="mx-auto text-[#1EB53A]" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Aucun litige en cours
              </h3>
              <p className="text-xs text-slate-500">
                Toutes les commandes se déroulent normalement sur la marketplace.
              </p>
            </div>
          ) : (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        Litige #{dispute.id.slice(-6)} • Commande #{dispute.orderId}
                      </span>
                      {dispute.status === 'open' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-[#CE1126] flex items-center gap-1">
                          <AlertTriangle size={11} /> En cours d'examen
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950 text-[#1EB53A] flex items-center gap-1">
                          <CheckCircle2 size={11} /> Résolu
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Signalé le {new Date(dispute.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-[#CE1126] block">
                      {dispute.amount.toLocaleString()} FBu
                    </span>
                    <span className="text-[10px] text-slate-400">Montant sous séquestre</span>
                  </div>
                </div>

                {/* Parties Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      Acheteur plaignant : {dispute.buyerName}
                    </div>
                    <p className="text-slate-500 text-[11px]">ID : {dispute.buyerId}</p>
                    <button
                      onClick={() =>
                        setContactRecipient({
                          role: 'buyer',
                          id: dispute.buyerId,
                          name: dispute.buyerName,
                          orderId: dispute.orderId,
                        })
                      }
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                    >
                      <MessageSquare size={12} /> Contacter l'acheteur &rarr;
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Store size={14} className="text-[#CE1126]" />
                      Boutique concernée : {dispute.shopName}
                    </div>
                    <p className="text-slate-500 text-[11px]">ID Marchand : {dispute.sellerId}</p>
                    <button
                      onClick={() =>
                        setContactRecipient({
                          role: 'seller',
                          id: dispute.sellerId,
                          name: dispute.shopName,
                          shopId: dispute.shopId,
                          orderId: dispute.orderId,
                        })
                      }
                      className="text-[11px] font-bold text-[#CE1126] hover:underline flex items-center gap-1 pt-1"
                    >
                      <MessageSquare size={12} /> Contacter le vendeur &rarr;
                    </button>
                  </div>
                </div>

                {/* Dispute Motive */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-0.5">Motif déclaré du litige :</span>
                  <p>{dispute.reason}</p>
                </div>

                {/* Resolution Note if resolved */}
                {dispute.resolutionNote && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-900 dark:text-green-200">
                    <span className="font-bold block mb-0.5">Décision de l'administration :</span>
                    <p>{dispute.resolutionNote}</p>
                  </div>
                )}

                {/* Actions */}
                {dispute.status === 'open' && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleForceRefund(dispute)}
                      className="py-2 px-3.5 rounded-xl border border-red-200 dark:border-red-900 text-[#CE1126] hover:bg-red-50 dark:hover:bg-red-950 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <DollarSign size={14} /> Forcer un Remboursement Mobile Money
                    </button>
                    <button
                      onClick={() => {
                        setResolvingDispute(dispute);
                        setResolutionNote('');
                        setResolutionError('');
                      }}
                      className="py-2 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <CheckCircle2 size={14} /> Marquer comme résolu
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reviews Moderation Tab (Requirement 3.5) */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tous les Avis et Notations ({reviews.length})
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {rev.buyerName || rev.userName || 'Client'}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-[11px] text-slate-500">
                      Produit : {rev.productName}
                    </span>
                    <div className="flex items-center text-amber-500 ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDeletingReview(rev);
                      setReviewDeleteReason('');
                      setReviewDeleteError('');
                    }}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-xs font-bold flex items-center gap-1 transition"
                    title="Supprimer avec motif obligatoire"
                  >
                    <Trash2 size={13} />
                    <span>Modérer / Supprimer</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  « {rev.comment} »
                </p>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Publié le {new Date(rev.createdAt).toLocaleDateString('fr-FR')}</span>
                  {rev.sellerReply && (
                    <span className="italic text-slate-500">
                      Réponse commerçant : « {typeof rev.sellerReply === 'string' ? rev.sellerReply : (rev.sellerReply as any).text} »
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolve Dispute Modal */}
      {resolvingDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-[#1EB53A] shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Clôturer le litige</h3>
                <p className="text-xs text-slate-500">Commande #{resolvingDispute.orderId}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Veuillez consigner la décision administrative finale prise entre l'acheteur et le marchand.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Note de décision / Résolution *
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => {
                  setResolutionNote(e.target.value);
                  if (resolutionError) setResolutionError('');
                }}
                rows={3}
                placeholder="Ex : Article de remplacement livré avec succès en agence de retrait..."
                className={`w-full p-3 rounded-xl border text-xs focus:ring-2 focus:ring-[#1EB53A] focus:outline-none ${
                  resolutionError
                    ? 'border-red-500 bg-red-50/20'
                    : isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              />
              {resolutionError && (
                <p className="text-[11px] font-semibold text-red-500">{resolutionError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setResolvingDispute(null);
                  setResolutionNote('');
                  setResolutionError('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-2 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white text-xs font-bold shadow-xs transition"
              >
                Valider la résolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review with Mandatory Reason Modal (Requirement 3.5) */}
      {deletingReview && (
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
                <h3 className="font-bold text-base">Modérer et supprimer l'avis</h3>
                <p className="text-xs text-slate-500">Auteur : {deletingReview.userName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Veuillez obligatoirement renseigner le motif de suppression. Ce motif sera enregistré dans le registre d'audit administratif.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Motif obligatoire de suppression *
              </label>
              <textarea
                value={reviewDeleteReason}
                onChange={(e) => {
                  setReviewDeleteReason(e.target.value);
                  if (reviewDeleteError) setReviewDeleteError('');
                }}
                rows={3}
                placeholder="Ex : Propos diffamatoires, insultes, coordonnées personnelles divulguées..."
                className={`w-full p-3 rounded-xl border text-xs focus:ring-2 focus:ring-[#CE1126] focus:outline-none ${
                  reviewDeleteError
                    ? 'border-red-500 bg-red-50/20'
                    : isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              />
              {reviewDeleteError && (
                <p className="text-[11px] font-semibold text-red-500">{reviewDeleteError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingReview(null);
                  setReviewDeleteReason('');
                  setReviewDeleteError('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReview}
                className="px-4 py-2 rounded-xl bg-[#CE1126] hover:bg-[#b00f20] text-white text-xs font-bold shadow-xs transition"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Message Contact Modal */}
      {contactRecipient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSendMessage}
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#1EB53A]" />
                <h3 className="font-bold text-sm">
                  Message Officiel au {contactRecipient.role === 'buyer' ? 'Client' : 'Commerçant'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContactRecipient(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Destinataire : <strong>{contactRecipient.name}</strong>
              {contactRecipient.orderId && ` (Dossier #${contactRecipient.orderId})`}
            </p>

            {contactMessageSent ? (
              <div className="p-4 rounded-xl bg-green-100 text-[#1EB53A] font-bold text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Message transmis avec succès !
              </div>
            ) : (
              <>
                <textarea
                  value={contactMessageText}
                  onChange={(e) => setContactMessageText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Écrivez vos instructions ou questions officielles..."
                  className={`w-full p-3 rounded-xl border text-xs focus:ring-2 focus:ring-[#1EB53A] focus:outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setContactRecipient(null)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Send size={13} /> Envoyer
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
