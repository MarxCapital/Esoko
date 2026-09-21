import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ESokoLogo } from './ESokoLogo';
import { PaymentOperator, Order } from '../types';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Store,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface MobileMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const MobileMoneyModal: React.FC<MobileMoneyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    cartTotal,
    cartGroupedByVendor,
    settings,
    currentUser,
    createOrderWithMobileMoney,
    isDarkMode,
  } = useApp();

  const [operator, setOperator] = useState<PaymentOperator>('lumicash');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '+257 69 00 00 00');
  const [pinCode, setPinCode] = useState('');
  
  // Step: 'input' | 'ussd_push' | 'processing' | 'success' | 'failed'
  const [step, setStep] = useState<'input' | 'ussd_push' | 'processing' | 'success' | 'failed'>('input');
  const [countdown, setCountdown] = useState<number>(60);
  const [ussdRef, setUssdRef] = useState<string>('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setPinCode('');
      setCountdown(60);
      setErrorMessage('');
      setPhoneNumber(currentUser.phone || '+257 69 14 28 50');
      // Suggest operator based on phone prefix if applicable
      if (currentUser.phone?.includes('61') || currentUser.phone?.includes('68') || currentUser.phone?.includes('69')) {
        setOperator('lumicash');
      } else if (currentUser.phone?.includes('71') || currentUser.phone?.includes('76') || currentUser.phone?.includes('79')) {
        setOperator('ecocash');
      }
    }
  }, [isOpen, currentUser]);

  // Countdown timer during USSD prompt
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'ussd_push' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (step === 'ussd_push' && countdown === 0) {
      setStep('failed');
      setErrorMessage('Délai de validation USSD expiré (Time-out opérateur). Le panier est conservé.');
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const commissionAmount = Math.round(cartTotal * (settings.commissionRate / 100));
  const vendorsShare = cartTotal - commissionAmount;

  const handleInitiatePayment = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage('Veuillez saisir un numéro de téléphone valide au Burundi (+257).');
      return;
    }

    const ref = `${operator.toUpperCase()}-BI-${Date.now().toString().slice(-6)}`;
    setUssdRef(ref);
    setCountdown(60);
    setErrorMessage('');
    setStep('ussd_push');
  };

  const handleValidateUssd = async (simulateSuccess = true) => {
    setStep('processing');
    
    // Simulate mobile operator network roundtrip (1.2s)
    setTimeout(async () => {
      if (!simulateSuccess) {
        setStep('failed');
        setErrorMessage('Paiement rejeté par le titulaire ou solde insuffisant sur le compte mobile money.');
        return;
      }

      const res = await createOrderWithMobileMoney(operator, phoneNumber);
      if (res.success && res.order) {
        setCreatedOrder(res.order);
        setStep('success');
      } else {
        setStep('failed');
        setErrorMessage(res.error || 'Échec de la transaction. Veuillez réessayer.');
      }
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      id="modal-mobile-money"
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${
          isDarkMode
            ? 'bg-[#151522] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header with official E-Soko logo and Burundi accent bar */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-100 bg-[#F8F9FA]'
          }`}
        >
          <div className="flex items-center gap-3">
            <ESokoLogo size="sm" showSlogan={false} isDark={isDarkMode} />
            <div className="border-l pl-3 border-slate-300 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-[#CE1126] block">
                Paiement Sécurisé
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Mobile Money Burundi
              </span>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Step 1: Input & Operator Choice */}
        {step === 'input' && (
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="text-xs text-slate-700 dark:text-slate-300 block font-bold">
                  Montant total à payer
                </span>
                <span className="text-2xl font-black text-[#1EB53A]">
                  {cartTotal.toLocaleString()} <span className="text-sm font-bold">FBu</span>
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#1EB53A]/10 text-[#1EB53A] font-bold">
                  <ShieldCheck size={14} /> 0% Frais acheteur
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mt-1">
                  {cartGroupedByVendor.length} boutique(s) différente(s)
                </span>
              </div>
            </div>

            {/* Operator Selection */}
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider">
                1. Choisissez votre opérateur Mobile Money
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Lumitel Lumicash */}
                <button
                  type="button"
                  onClick={() => setOperator('lumicash')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition relative ${
                    operator === 'lumicash'
                      ? 'border-[#1EB53A] bg-[#1EB53A]/10 ring-2 ring-[#1EB53A]/30'
                      : isDarkMode
                      ? 'border-slate-700 hover:border-slate-600 bg-slate-800/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#1EB53A]">Lumicash</span>
                    <span className="text-[10px] bg-[#1EB53A] text-white px-1.5 py-0.5 rounded font-bold">
                      Lumitel
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    N° : 61, 62, 68, 69...
                  </span>
                  {operator === 'lumicash' && (
                    <div className="absolute top-2 right-2 text-[#1EB53A]">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>

                {/* Econet EcoCash */}
                <button
                  type="button"
                  onClick={() => setOperator('ecocash')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition relative ${
                    operator === 'ecocash'
                      ? 'border-[#CE1126] bg-[#CE1126]/10 ring-2 ring-[#CE1126]/30'
                      : isDarkMode
                      ? 'border-slate-700 hover:border-slate-600 bg-slate-800/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#CE1126]">EcoCash</span>
                    <span className="text-[10px] bg-[#CE1126] text-white px-1.5 py-0.5 rounded font-bold">
                      Econet Leo
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    N° : 71, 76, 79...
                  </span>
                  {operator === 'ecocash' && (
                    <div className="absolute top-2 right-2 text-[#CE1126]">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="input-phone-payment"
                className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
              >
                2. Votre numéro de téléphone {operator === 'lumicash' ? 'Lumitel' : 'Econet'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Smartphone size={18} />
                </div>
                <input
                  id="input-phone-payment"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+257 69 XX XX XX"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base font-semibold focus:outline-hidden focus:ring-2 ${
                    operator === 'lumicash'
                      ? 'focus:border-[#1EB53A] focus:ring-[#1EB53A]/20'
                      : 'focus:border-[#CE1126] focus:ring-[#CE1126]/20'
                  } ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Une notification Push USSD sera envoyée instantanément sur ce mobile pour confirmation.
              </p>
            </div>

            {/* Order Split Preview according to section 3.3 */}
            <div
              className={`p-3.5 rounded-xl text-xs space-y-2 border ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-bold flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Store size={14} className="text-[#CE1126]" />
                  Répartition automatique de la commande :
                </span>
                <span className="text-slate-500">{cartGroupedByVendor.length} sous-commande(s)</span>
              </div>
              {cartGroupedByVendor.map((vg, idx) => (
                <div
                  key={vg.vendorId}
                  className="flex items-center justify-between py-1 border-t border-slate-200 dark:border-slate-800"
                >
                  <span className="font-medium text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                    {idx + 1}. {vg.shop?.name || 'Boutique'}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {vg.subtotal.toLocaleString()} FBu
                  </span>
                </div>
              ))}
              <div className="pt-1.5 border-t border-dashed border-slate-300 dark:border-slate-700 flex justify-between text-slate-500 text-[11px]">
                <span>Commission plateforme E-Soko ({settings.commissionRate}%)</span>
                <span>{commissionAmount.toLocaleString()} FBu (déduite des vendeurs)</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              id="btn-initiate-mobile-payment"
              onClick={handleInitiatePayment}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                operator === 'lumicash'
                  ? 'bg-[#1EB53A] hover:bg-[#199931]'
                  : 'bg-[#CE1126] hover:bg-[#B30E1F]'
              }`}
            >
              <Smartphone size={18} />
              Initier le paiement {operator === 'lumicash' ? 'Lumicash' : 'EcoCash'} (
              {cartTotal.toLocaleString()} FBu)
            </button>
          </div>
        )}

        {/* Step 2: Simulated USSD Push on Buyer Phone */}
        {step === 'ussd_push' && (
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Smartphone size={36} className="animate-bounce" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Demande Push USSD envoyée !
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Une alerte USSD clignote sur le téléphone <strong className="text-slate-800 dark:text-slate-200">{phoneNumber}</strong>.
              </p>
            </div>

            {/* Mock Phone Screen Container */}
            <div className="mx-auto max-w-xs p-4 rounded-2xl bg-slate-950 text-slate-100 border-2 border-slate-700 shadow-xl font-mono text-left space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                <span className="uppercase font-bold text-amber-400">
                  {operator === 'lumicash' ? '*163# Lumicash' : '*151# EcoCash'}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <Clock size={12} /> {countdown}s
                </span>
              </div>

              <div className="text-xs leading-relaxed">
                <p className="font-bold text-white mb-1">
                  Confirmation E-SOKO BURUNDI :
                </p>
                <p className="text-slate-300">
                  Autoriser le débit de{' '}
                  <span className="text-green-400 font-bold">
                    {cartTotal.toLocaleString()} FBu
                  </span>{' '}
                  vers E-Soko (Réf: {ussdRef}) ?
                </p>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  Code PIN secret (ex: 1234) :
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="****"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-sm font-bold tracking-widest text-green-400 focus:outline-hidden focus:border-green-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleValidateUssd(true)}
                  className="flex-1 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold text-center transition"
                >
                  1. Valider
                </button>
                <button
                  type="button"
                  onClick={() => handleValidateUssd(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  2. Annuler
                </button>
              </div>
            </div>

            {/* Quick Testing Notice for Developer/Client */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Simulation interactive active :
              </span>{' '}
              Cliquez sur « 1. Valider » ci-dessus pour confirmer le paiement comme sur un vrai téléphone, ou « 2. Annuler » pour tester le flux de refus.
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
            >
              Modifier le numéro ou l’opérateur
            </button>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <RefreshCw size={44} className="mx-auto animate-spin text-[#1EB53A]" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Validation de la transaction en cours...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Communication sécurisée avec l'API {operator === 'lumicash' ? 'Lumitel' : 'Econet'} Burundi. Veuillez patienter.
            </p>
          </div>
        )}

        {/* Step 4: Success with Receipt & SubOrder breakdown */}
        {step === 'success' && createdOrder && (
          <div className="p-6 text-center space-y-5">
            <div className="inline-flex p-3 rounded-full bg-[#1EB53A]/10 text-[#1EB53A]">
              <CheckCircle2 size={42} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Paiement réussi !
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Commande <strong className="text-slate-800 dark:text-slate-200">#{createdOrder.id}</strong> confirmée.
              </p>
            </div>

            {/* Official Receipt Card with E-Soko Logo Watermark */}
            <div
              className={`p-4 rounded-xl text-left border text-xs space-y-3 relative overflow-hidden ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#F8F9FA] border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                <ESokoLogo size="xs" showSlogan={false} isDark={isDarkMode} />
                <span className="font-mono text-[11px] text-[#1EB53A] font-bold">
                  RÉF: {createdOrder.transactionId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Opérateur :</span>
                  <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                    {createdOrder.paymentOperator} ({createdOrder.paymentPhone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Montant débité :</span>
                  <span className="font-bold text-[#1EB53A]">
                    {createdOrder.totalAmount.toLocaleString()} FBu
                  </span>
                </div>
              </div>

              {/* SubOrders notification for buyer */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Retrait de vos articles chez les vendeurs :
                </span>
                <div className="space-y-2">
                  {createdOrder.subOrders.map((so) => (
                    <div
                      key={so.id}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px]"
                    >
                      <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                        <span>{so.shopName}</span>
                        <span className="text-[#1EB53A]">{so.vendorSubtotal.toLocaleString()} FBu</span>
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        📍 <strong>Lieu de retrait :</strong> {so.pickupLocation}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        🕒 <strong>Horaires :</strong> {so.pickupHours}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-view-order-success"
              onClick={() => {
                onSuccess(createdOrder);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition"
            >
              Consulter mes commandes & coordonnées de retrait
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 5: Failed State (Cart preserved as mandated in section 4.4) */}
        {step === 'failed' && (
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-950/60 text-[#CE1126]">
              <AlertCircle size={40} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Échec du paiement Mobile Money
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-sm mx-auto">
                {errorMessage || 'La transaction n’a pas pu être validée par votre opérateur.'}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl text-xs border text-left flex items-start gap-2.5 ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <CheckCircle2 size={16} className="text-[#1EB53A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">
                  Votre panier reste intact :
                </strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Conformément aux exigences de la plateforme, aucun article n'a été retiré. Vous pouvez réessayer avec un autre numéro ou un autre opérateur.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#CE1126] hover:bg-[#B30E1F] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <RefreshCw size={14} />
                Réessayer le paiement
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
