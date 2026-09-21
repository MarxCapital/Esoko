import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  Settings,
  Percent,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  ListOrdered,
  FileText,
  UserPlus,
  History,
  Calendar,
  Edit2,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    updateCommissionRate,
    updateSettings,
    settingsHistory,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    createAdminAccount,
    isDarkMode,
  } = useApp();

  const [rate, setRate] = useState(settings.commissionRate);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [commissionSavedSuccess, setCommissionSavedSuccess] = useState(false);
  const [contactSavedSuccess, setContactSavedSuccess] = useState(false);

  // New category
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Create Admin Account State (Requirement 3.4)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCommissionRate(Number(rate));
    setCommissionSavedSuccess(true);
    setTimeout(() => setCommissionSavedSuccess(false), 3000);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      supportPhone,
      supportEmail,
    });
    setContactSavedSuccess(true);
    setTimeout(() => setContactSavedSuccess(false), 2500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-');
    addCategory({
      name: newCatName.trim(),
      slug,
      description: `Catégorie ${newCatName.trim()}`,
      iconName: 'Tag',
    });
    setNewCatName('');
    setNewCatSlug('');
  };

  const handleSaveEditCategory = (catId: string) => {
    if (!editingCatName.trim()) return;
    updateCategory(catId, {
      name: editingCatName.trim(),
      slug: editingCatName.toLowerCase().replace(/\s+/g, '-'),
    });
    setEditingCatId(null);
    setEditingCatName('');
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (adminPassword !== adminPasswordConfirm) {
      setAdminError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (adminPassword.length < 6) {
      setAdminError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await createAdminAccount({
        email: adminEmail.trim(),
        name: adminName.trim(),
        phone: adminPhone.trim() || '+257 69 00 00 00',
        password: adminPassword,
        passwordConfirm: adminPasswordConfirm,
      });
      setAdminSuccess(`Le compte administrateur pour ${adminEmail} a été créé avec succès.`);
      setAdminEmail('');
      setAdminName('');
      setAdminPhone('');
      setAdminPassword('');
      setAdminPasswordConfirm('');
    } catch (err: any) {
      setAdminError(err.message || 'Erreur lors de la création du compte administrateur.');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="admin-settings-page">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" variant="badge" isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Paramètres Nationaux & Régulation E-Soko
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configurez la commission avec historique des audits, gérez la taxonomie et habilitez de nouveaux administrateurs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Commission Settings Form with History */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Percent size={16} className="text-[#1EB53A]" />
              Taux de Commission Marketplace
            </h3>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1EB53A]/15 text-[#1EB53A]">
              Actuel : {settings.commissionRate}%
            </span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Ce taux est automatiquement prélevé sur les flux Mobile Money (Lumicash / EcoCash) lors de la validation des commandes.
          </p>

          <form onSubmit={handleUpdateCommission} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nouveau pourcentage de commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  required
                  className={`w-full p-2.5 rounded-xl border font-bold text-sm ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
                <span className="absolute right-3 top-2.5 font-bold text-slate-400">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {commissionSavedSuccess ? (
                <span className="text-[#1EB53A] font-bold flex items-center gap-1">
                  <Check size={14} /> Commission mise à jour et tracée !
                </span>
              ) : <div />}
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold transition shadow-xs"
              >
                Appliquer & Enregistrer l'audit
              </button>
            </div>
          </form>

          {/* Commission Modification History (Requirement 3.4) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <History size={14} className="text-slate-400" />
              Historique des Révisions de Commission ({settingsHistory.length})
            </h4>

            {settingsHistory.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                Aucune modification antérieure enregistrée.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-[11px]">
                {settingsHistory.map((h) => (
                  <div
                    key={h.id}
                    className={`p-2 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${
                      isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {h.oldCommissionRate}% &rarr; {h.newCommissionRate}%
                      </span>
                      <span className="text-slate-500 block text-[10px]">
                        Par : {h.adminName} ({h.adminEmail})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(h.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Manager with Renaming (Requirement 3.4) */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ListOrdered size={16} className="text-[#CE1126]" />
            Catégories de Produits E-Soko ({categories.length})
          </h3>
          <p className="text-slate-500 text-[11px]">
            Créez, renommez ou retirez les catégories du catalogue national.
          </p>

          <form onSubmit={handleAddCategory} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nouvelle catégorie (ex: Mode & Textiles)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className={`flex-1 p-2 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="py-2 px-3 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {editingCatId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                      className={`flex-1 p-1 rounded-lg border text-xs font-bold ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'
                      }`}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEditCategory(cat.id)}
                      className="px-2 py-1 bg-[#1EB53A] text-white text-xs font-bold rounded-lg"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="px-2 py-1 border border-slate-300 text-slate-500 text-xs rounded-lg"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      slug: {cat.slug}
                    </span>
                  </div>
                )}

                {editingCatId !== cat.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatName(cat.name);
                      }}
                      className="text-slate-400 hover:text-blue-500 p-1"
                      title="Renommer la catégorie"
                    >
                      <Edit2 size={13} />
                    </button>
                    {categories.length > 2 && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Create Admin Account (Requirement 3.4) & Support Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Create New Admin Form (Requirement 3.4) */}
        <form
          onSubmit={handleCreateAdmin}
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-[#1EB53A]" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Créer un Nouveau Compte Administrateur
            </h3>
          </div>
          <p className="text-slate-500 text-[11px]">
            Habilitez un nouveau collaborateur avec les privilèges d'administration totale de la marketplace.
          </p>

          {adminError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {adminSuccess && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-[#1EB53A] flex items-center gap-2 text-xs font-semibold">
              <Check size={14} className="shrink-0" />
              <span>{adminSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet *
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ex : Jean Ndayishimiye"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={`w-full pl-8 p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone Burundi
              </label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="+257 69 00 00 00"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className={`w-full pl-8 p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Administrateur *
            </label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="nouveau.admin@esoka.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className={`w-full pl-8 p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full pl-8 p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirmation mot de passe *
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPasswordConfirm}
                  onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                  className={`w-full pl-8 p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreatingAdmin}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={15} />
            {isCreatingAdmin ? 'Création en cours...' : 'Créer le compte administrateur'}
          </button>
        </form>

        {/* Support Coordinates Form */}
        <form
          onSubmit={handleSaveContactSettings}
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Phone size={16} className="text-[#1EB53A]" />
            Coordonnées du Support National
          </h3>
          <p className="text-slate-500 text-[11px]">
            Ces informations sont communiquées aux acheteurs et marchands sur leurs reçus et en pied de page.
          </p>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Téléphone Support Burundi (+257)
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Support Officiel
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {contactSavedSuccess && (
              <span className="text-[#1EB53A] font-bold flex items-center gap-1">
                <Check size={14} /> Enregistré !
              </span>
            )}
            <button
              type="submit"
              className="ml-auto py-2 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold transition shadow-xs"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
