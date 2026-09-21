import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Check,
  Store,
} from 'lucide-react';

interface BuyerProfileProps {
  onApplySeller: () => void;
}

export const BuyerProfile: React.FC<BuyerProfileProps> = ({ onApplySeller }) => {
  const { currentUser, setCurrentUser, isDarkMode, addAuditLog } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [address, setAddress] = useState(currentUser.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      phone,
      email,
      address,
    };
    setCurrentUser(updated);
    addAuditLog('MISE_A_JOUR_PROFIL', `Profil mis à jour par ${name} (${phone})`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="buyer-profile-page">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Mon Profil Acheteur
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
            Gérez vos coordonnées pour vos retraits et vos réceptions de SMS Mobile Money.
          </p>
        </div>
        <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-[#1EB53A]/15 text-[#1EB53A] flex items-center justify-center font-black text-xl">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold inline-block mt-1">
              Rôle : Acheteur vérifié
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Nom complet
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Téléphone Mobile Money (+257)
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+257 69 XX XX XX"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Adresse email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Adresse de contact / Ville au Burundi
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Bujumbura Mairie, Rohero 2, Avenue de la JRR"
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Sera communiquée aux commerçants pour faciliter vos rendez-vous de retrait.
          </p>
        </div>

        <div className="pt-3 flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-bold text-[#1EB53A] flex items-center gap-1">
              <Check size={16} /> Modifications enregistrées avec succès !
            </span>
          )}
          <button
            type="submit"
            className="ml-auto py-2.5 px-5 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs shadow-xs transition"
          >
            Enregistrer mon profil
          </button>
        </div>
      </form>

      {/* Become a seller banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
          isDarkMode
            ? 'bg-gradient-to-r from-slate-900 to-[#122818] border-slate-800'
            : 'bg-gradient-to-r from-slate-50 to-green-50/60 border-slate-200'
        }`}
      >
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Store size={16} className="text-[#1EB53A]" />
            Vous êtes commerçant ou artisan au Burundi ?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Créez votre boutique officielle sur E-Soko et encaissez vos ventes via Lumicash et EcoCash.
          </p>
        </div>
        <button
          onClick={onApplySeller}
          className="shrink-0 py-2 px-3.5 rounded-xl bg-[#CE1126] hover:bg-[#B30E1F] text-white font-bold text-xs shadow-xs transition"
        >
          Postuler comme Vendeur
        </button>
      </div>
    </div>
  );
};
