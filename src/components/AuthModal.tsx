import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ESokoLogo } from './ESokoLogo';
import { X, Mail, Lock, User as UserIcon, Phone, MapPin, Eye, EyeOff, Store, ShoppingBag, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  initialRole?: 'buyer' | 'seller';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  initialRole = 'buyer',
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isDarkMode } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Veuillez saisir votre adresse email et votre mot de passe.');
        }
        await signInWithEmail(email.trim(), password);
      } else {
        if (!name.trim()) throw new Error('Veuillez saisir votre nom complet.');
        if (!email.trim()) throw new Error('Veuillez saisir votre adresse email.');
        if (!phone.trim()) throw new Error('Veuillez saisir votre numéro de téléphone (ex: +257 69 00 00 00).');
        if (password.length < 6) throw new Error('Le mot de passe doit comporter au moins 6 caractères.');

        await signUpWithEmail({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim().startsWith('+') ? phone.trim() : `+257 ${phone.trim()}`,
          role,
          address: address.trim() || 'Bujumbura, Burundi',
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Auth submit error:', err);
      let msg = err.message || 'Une erreur est survenue lors de l’authentification.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Identifiants invalides. Vérifiez votre adresse email et votre mot de passe.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Cette adresse email est déjà associée à un compte existant.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Le mot de passe choisi est trop faible (minimum 6 caractères).';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format d’adresse email invalide.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'La fenêtre de connexion Google a été fermée avant la validation.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Échec de la connexion avec Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-6 sm:p-7 overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#151522] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <ESokoLogo size="sm" variant="badge" isDark={isDarkMode} className="mx-auto mb-3" />
          <h2 className="text-xl font-black tracking-tight">
            {mode === 'signin' ? 'Connexion à votre compte' : 'Créer un compte E-Soko'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'signin'
              ? 'Accédez à votre espace sécurisé pour commander ou gérer votre boutique'
              : 'Rejoignez la marketplace nationale du Burundi'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <span className="font-bold">Erreur :</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Quick Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-2xs mb-4 ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-[#151522] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
            ou par e-mail
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Account Type Choice */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Type de profil souhaité
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      role === 'buyer'
                        ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShoppingBag size={16} />
                    <div className="text-xs">Acheteur</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      role === 'seller'
                        ? 'bg-[#1EB53A]/10 border-[#1EB53A] text-[#1EB53A] font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Store size={16} />
                    <div className="text-xs">Vendeur</div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nom complet ou Raison sociale
                </label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Jean-Paul Ndayisenga"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-[#1EB53A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Burundian Phone Number */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Numéro de téléphone Mobile Money (Lumicash / EcoCash)
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+257 69 14 28 50"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono focus:ring-2 focus:ring-[#1EB53A] focus:outline-none"
                  />
                </div>
              </div>

              {/* City / Address */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Adresse / Ville de résidence
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Bujumbura Mairie, Rohero"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-[#1EB53A] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.bi"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-[#1EB53A] focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mot de passe
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Veuillez contacter le support au +257 22 25 00 00 pour la réinitialisation.')}
                  className="text-[11px] text-[#1EB53A] hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-[#1EB53A] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'signin' ? (
              'Se connecter'
            ) : (
              'Créer mon compte E-Soko'
            )}
          </button>
        </form>

        {/* Security badge note */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-[#1EB53A]" />
          <span>Authentification sécurisée par Firebase Auth & Cloud Firestore</span>
        </div>
      </div>
    </div>
  );
};
