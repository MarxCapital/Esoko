import React from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export const SellerStatusPending: React.FC = () => {
  const { currentUser, switchDemoUser, isDarkMode } = useApp();

  const isRejected = currentUser.sellerStatus === 'rejected';

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6" id="seller-status-pending">
      <ESokoLogo size="md" variant="full" showSlogan={true} isDark={isDarkMode} />

      <div
        className={`p-8 rounded-2xl border space-y-4 shadow-md ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            isRejected
              ? 'bg-red-100 text-[#CE1126] dark:bg-red-950/60'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'
          }`}
        >
          {isRejected ? <AlertTriangle size={32} /> : <Clock size={32} />}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isRejected
              ? 'Candidature Vendeur non retenue'
              : 'Demande de boutique en cours d’examen'}
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {isRejected
              ? 'Votre demande d’ouverture de boutique a été refusée par l’administration E-Soko. Veuillez contacter le support pour plus de détails.'
              : `Votre demande pour le compte "${currentUser.name}" a bien été transmise aux administrateurs nationaux de la plateforme E-Soko. Vous recevrez une validation dès vérification de vos modalités de retrait.`}
          </p>
        </div>

        {/* Admin Quick Action for Testing */}
        <div
          className={`p-4 rounded-xl border text-xs text-left space-y-2 ${
            isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            ⚙️ Conseil pour évaluer le cahier des charges :
          </span>
          <p className="text-slate-500 text-[11px]">
            Basculez sur le rôle <strong>Admin</strong> pour valider cette demande en 1 clic dans la section « Vendeurs ».
          </p>
          <button
            onClick={() => switchDemoUser('admin')}
            className="py-2 px-3 rounded-lg bg-[#CE1126] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition hover:bg-[#B30E1F]"
          >
            <ShieldCheck size={14} /> Se connecter comme Admin pour valider
          </button>
        </div>
      </div>
    </div>
  );
};
