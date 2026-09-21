import React from 'react';
import { useApp } from '../context/AppContext';
import { ESokoLogo } from './ESokoLogo';
import { ShieldCheck, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { isDarkMode, settings, setActiveView, currentUser } = useApp();

  return (
    <footer
      id="main-footer"
      className={`border-t transition-colors ${
        isDarkMode
          ? 'bg-[#0E0E18] border-slate-800 text-slate-300'
          : 'bg-[#F8F9FA] border-slate-200 text-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <ESokoLogo size="md" variant="horizontal" showSlogan={true} isDark={isDarkMode} />
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              La première marketplace multi-vendeurs 100% burundaise. Achetez auprès de commerçants locaux et payez en toute sécurité par mobile money.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck size={16} className="text-[#1EB53A]" />
              <span>Paiement vérifié par Push USSD</span>
            </div>
          </div>

          {/* Opérateurs Mobile Money Burundi */}
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Paiement Exclusif Burundi
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="w-3 h-3 rounded-full bg-[#1EB53A]" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Lumitel Lumicash
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Service USSD *163#</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="w-3 h-3 rounded-full bg-[#CE1126]" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Econet EcoCash Burundi
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Service USSD *151#</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Zéro carte bancaire requise. Zéro frais caché.
            </p>
          </div>

          {/* Modalités de Retrait */}
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Modalités de Retrait
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#1EB53A] shrink-0 mt-0.5" />
                <span>Retrait direct en magasin ou accord en main propre avec le vendeur.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#1EB53A] shrink-0 mt-0.5" />
                <span>Adresse physique et horaires spécifiés sur chaque sous-commande.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#1EB53A] shrink-0 mt-0.5" />
                <span>Messagerie directe avec le commerçant pour convenir du créneau.</span>
              </li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              E-Soko Burundi
            </h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#CE1126]" />
                <span>Bujumbura Mairie, Rohero, Burundi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#1EB53A]" />
                <span>{settings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveView('admin_dashboard')}
                  className="text-xs font-bold text-[#CE1126] hover:underline flex items-center gap-1"
                >
                  <span>Console Administration E-Soko</span> &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-3">
          <p className="font-medium">
            © 2026 E-Soko Burundi. « Le marché du Burundi, en un clic ». Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <span>Bujumbura</span>
            <span>•</span>
            <span>Gitega</span>
            <span>•</span>
            <span>Ngozi</span>
            <span>•</span>
            <span>Kirundo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
