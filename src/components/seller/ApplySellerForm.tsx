import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import {
  Store,
  CheckCircle2,
  MapPin,
  Clock,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Upload,
  Camera,
  FileCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface ApplySellerFormProps {
  onSuccess: () => void;
}

export const ApplySellerForm: React.FC<ApplySellerFormProps> = ({ onSuccess }) => {
  const { applyAsSeller, currentUser, isDarkMode } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '+257 ');
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupHours, setPickupHours] = useState('Lundi au Samedi : 08h30 - 18h00');
  const [city, setCity] = useState('Bujumbura');
  const [lumicash, setLumicash] = useState(currentUser.phone || '');
  const [ecocash, setEcocash] = useState('');

  // KYC Verification Documents (Strict Requirement 3.2 & 5.4)
  const [idCardUrl, setIdCardUrl] = useState<string>(
    currentUser.idCardUrl ||
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [idCardSelfieUrl, setIdCardSelfieUrl] = useState<string>(
    currentUser.idCardSelfieUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  );
  const [docError, setDocError] = useState<string>('');

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setDocError('Le fichier dépasse la taille maximale autorisée de 5 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setter(event.target.result as string);
        setDocError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !pickupLocation.trim()) return;

    if (!idCardUrl || !idCardSelfieUrl) {
      setDocError('Les deux documents d’identité (CNI et Selfie avec CNI) sont obligatoires.');
      return;
    }

    applyAsSeller(
      name,
      email,
      phone,
      shopName,
      description,
      pickupLocation,
      pickupHours,
      city,
      lumicash,
      ecocash,
      idCardUrl,
      idCardSelfieUrl
    );
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="apply-seller-page">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <ESokoLogo size="md" variant="full" showSlogan={true} isDark={isDarkMode} />
        <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">
          Demande d'adhésion Vendeur E-Soko
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Rejoignez le réseau des commerçants agréés du Burundi. Toute nouvelle boutique est soumise à vérification par l'administration E-Soko avant activation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-3 rounded-xl bg-[#1EB53A]/10 border border-[#1EB53A]/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <ShieldCheck size={16} className="text-[#1EB53A] shrink-0 mt-0.5" />
          <span>
            <strong>Engagement de conformité :</strong> Vos coordonnées de retrait physique et vos numéros Mobile Money enregistrés serviront directement au règlement de vos ventes.
          </span>
        </div>

        {/* Seller Info */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
            1. Informations du commerçant / responsable
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet du gérant
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone principal (+257)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
            2. Informations sur la boutique
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom officiel de la boutique
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Ex: Artisanat Kirundo & Co"
                required
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ville principale au Burundi
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <option value="Bujumbura">Bujumbura Mairie</option>
                <option value="Gitega">Gitega (Capitale politique)</option>
                <option value="Ngozi">Ngozi</option>
                <option value="Kirundo">Kirundo</option>
                <option value="Rumonge">Rumonge</option>
                <option value="Kayanza">Kayanza</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description de la boutique & types de produits
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ex: Vente de paniers traditionnels Agaseke et vannerie burundaise faite main..."
              required
              className={`w-full p-2.5 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>
        </div>

        {/* Modalités de Retrait */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={13} className="text-[#CE1126]" />
            3. Modalités de retrait en boutique (Section 5.3)
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Adresse physique précise de retrait des articles
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Ex: Marché Central, Galerie Kaze, Stand n°24, Rohero, Bujumbura"
              required
              className={`w-full p-2.5 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Horaires et jours d'ouverture pour le retrait
            </label>
            <input
              type="text"
              value={pickupHours}
              onChange={(e) => setPickupHours(e.target.value)}
              placeholder="Ex: Du Lundi au Samedi : 08h30 - 18h00"
              required
              className={`w-full p-2.5 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>
        </div>

        {/* Numéros Mobile Money pour encaissement */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Smartphone size={13} className="text-[#1EB53A]" />
            4. Numéros Mobile Money pour versement de vos ventes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro Lumitel Lumicash
              </label>
              <input
                type="tel"
                value={lumicash}
                onChange={(e) => setLumicash(e.target.value)}
                placeholder="+257 69 XX XX XX"
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro Econet EcoCash
              </label>
              <input
                type="tel"
                value={ecocash}
                onChange={(e) => setEcocash(e.target.value)}
                placeholder="+257 79 XX XX XX"
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Documents d'identité KYC obligatoires (Section 3.2 & 5.4) */}
        <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#1EB53A]" />
              5. Pièces d'identité obligatoires (Contrôle KYC Admin)
            </h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40">
              Confidentiel • Réservé à l'Admin
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Conformément aux directives de sécurité E-Soko Burundi, veuillez fournir deux documents nets et lisibles :
            la photo de votre Carte Nationale d’Identité (ou Passeport burundais) et une photo selfie où vous tenez ce même document.
          </p>

          {docError && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{docError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document 1: CNI */}
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck size={14} className="text-blue-500" />
                  1. Photo Pièce d'Identité (CNI) *
                </label>
              </div>

              {idCardUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 mb-2 h-36 bg-slate-900/10">
                  <img
                    src={idCardUrl}
                    alt="Pièce d'identité"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-2.5 py-1 rounded-md bg-white text-slate-900 text-[10px] font-bold shadow hover:bg-slate-100">
                      Remplacer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setIdCardUrl)}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 h-36 hover:border-[#1EB53A] transition">
                  <Upload size={22} className="text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Téléverser CNI / Passeport</span>
                  <span className="text-[9px] text-slate-400">JPG, PNG max 5 Mo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setIdCardUrl)}
                  />
                </label>
              )}

              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>Vérifiez la netteté du nom et de la photo</span>
                <label className="text-blue-500 hover:underline cursor-pointer">
                  Changer
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setIdCardUrl)}
                  />
                </label>
              </div>
            </div>

            {/* Document 2: Selfie avec CNI */}
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Camera size={14} className="text-[#1EB53A]" />
                  2. Selfie tenant la Pièce d'Identité *
                </label>
              </div>

              {idCardSelfieUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 mb-2 h-36 bg-slate-900/10">
                  <img
                    src={idCardSelfieUrl}
                    alt="Selfie avec pièce d'identité"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-2.5 py-1 rounded-md bg-white text-slate-900 text-[10px] font-bold shadow hover:bg-slate-100">
                      Remplacer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setIdCardSelfieUrl)}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 h-36 hover:border-[#1EB53A] transition">
                  <Camera size={22} className="text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Téléverser Selfie CNI</span>
                  <span className="text-[9px] text-slate-400">Visage + carte bien visibles</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setIdCardSelfieUrl)}
                  />
                </label>
              )}

              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>Votre visage et la carte doivent être visibles</span>
                <label className="text-blue-500 hover:underline cursor-pointer">
                  Changer
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setIdCardSelfieUrl)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition"
          >
            <Store size={18} />
            Soumettre ma demande de boutique à l'Admin
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
