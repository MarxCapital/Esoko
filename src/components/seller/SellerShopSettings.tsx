import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Smartphone,
  ShieldCheck,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

export const SellerShopSettings: React.FC = () => {
  const { shops, currentUser, updateShop, isDarkMode } = useApp();
  const shop = shops.find((s) => s.sellerId === currentUser.id);

  const [name, setName] = useState(shop?.name || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [pickupLocation, setPickupLocation] = useState(shop?.pickupLocation || '');
  const [pickupHours, setPickupHours] = useState(shop?.pickupHours || '');
  const [city, setCity] = useState(shop?.city || 'Bujumbura');
  const [phone, setPhone] = useState(shop?.phone || '');
  const [lumicashNumber, setLumicashNumber] = useState(shop?.lumicashNumber || '');
  const [ecocashNumber, setEcocashNumber] = useState(shop?.ecocashNumber || '');
  const [logoUrl, setLogoUrl] = useState(shop?.logoUrl || '');
  const [bannerUrl, setBannerUrl] = useState(shop?.bannerUrl || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!shop) {
    return <div className="p-8 text-center text-xs text-slate-500">Boutique introuvable.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop(shop.id, {
      name,
      description,
      pickupLocation,
      pickupHours,
      city,
      phone,
      lumicashNumber,
      ecocashNumber,
      logoUrl: logoUrl.trim() || shop.logoUrl,
      bannerUrl: bannerUrl.trim() || shop.bannerUrl,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="seller-shop-settings">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Paramètres de ma Boutique & Modalités de Retrait
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ces informations sont directement affichées à vos acheteurs sur E-Soko Burundi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Identité Visuelle */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Store size={16} className="text-[#CE1126]" />
            Identité de la Boutique
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom commercial de la boutique
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ville d'implantation
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <option value="Bujumbura">Bujumbura Mairie</option>
                <option value="Gitega">Gitega</option>
                <option value="Ngozi">Ngozi</option>
                <option value="Kirundo">Kirundo</option>
                <option value="Rumonge">Rumonge</option>
                <option value="Kayanza">Kayanza</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description de la boutique
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL du Logo
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL de la Bannière d'en-tête
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Modalités de Retrait Obligatoires (Section 5.3) */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={16} className="text-[#1EB53A]" />
              Modalités de Retrait en Main Propre (Section 5.3)
            </h3>
            <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 font-bold px-2 py-0.5 rounded-md">
              Obligatoire
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Adresse physique précise de retrait des articles
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Ex: Rohero 1, Galerie Kaze, Stand #12, Avenue de la JRR, Bujumbura"
              required
              className={`w-full p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horaires et jours d'ouverture
              </label>
              <input
                type="text"
                value={pickupHours}
                onChange={(e) => setPickupHours(e.target.value)}
                placeholder="Ex: Du Lundi au Samedi : 08h30 - 18h00"
                required
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone boutique pour rendez-vous
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Numéros Mobile Money pour Encaissement */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone size={16} className="text-[#1EB53A]" />
            Comptes Mobile Money pour Encaissement de vos Ventes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro Lumicash (Lumitel Burundi)
              </label>
              <input
                type="tel"
                value={lumicashNumber}
                onChange={(e) => setLumicashNumber(e.target.value)}
                placeholder="+257 69 XX XX XX"
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro EcoCash (Econet Leo Burundi)
              </label>
              <input
                type="tel"
                value={ecocashNumber}
                onChange={(e) => setEcocashNumber(e.target.value)}
                placeholder="+257 79 XX XX XX"
                className={`w-full p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedNotice && (
            <span className="text-xs font-bold text-[#1EB53A] flex items-center gap-1">
              <Check size={16} /> Modifications de la boutique enregistrées avec succès !
            </span>
          )}
          <button
            type="submit"
            className="ml-auto py-2.5 px-6 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs shadow-xs transition"
          >
            Mettre à jour ma boutique
          </button>
        </div>
      </form>
    </div>
  );
};
