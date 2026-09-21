import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ESokoLogo } from '../ESokoLogo';
import { X, Send, Store, MessageSquare, Clock } from 'lucide-react';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  subOrderId?: string;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  shopId,
  subOrderId,
}) => {
  const { shops, messages, sendMessage, currentUser, isDarkMode } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const shop = shops.find((s) => s.id === shopId || s.sellerId === shopId);
  const shopMessages = messages.filter((m) => m.shopId === shop?.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !shop) return;
    sendMessage(shop.id, shop.sellerId, inputText.trim(), subOrderId);
    setInputText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      id="modal-messaging"
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border flex flex-col h-[520px] ${
          isDarkMode
            ? 'bg-[#151522] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-100 bg-[#F8F9FA]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1EB53A]/15 text-[#1EB53A] flex items-center justify-center font-bold">
              <Store size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {shop?.name || 'Commerçant E-Soko'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Coordination du retrait • {shop?.pickupLocation || 'Bujumbura'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Welcome note */}
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full inline-block">
              Échangez directement avec le commerçant pour convenir du jour et de l’heure de retrait.
            </span>
          </div>

          {shopMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <MessageSquare size={28} />
              <p className="text-xs">Aucun message pour l'instant avec ce commerçant.</p>
            </div>
          ) : (
            shopMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1">
                    <span>{isMine ? 'Moi' : msg.senderName}</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      isMine
                        ? 'bg-[#1EB53A] text-white rounded-br-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 rounded-bl-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={handleSend}
          className={`p-3 border-t flex items-center gap-2 shrink-0 ${
            isDarkMode ? 'border-slate-800 bg-[#1A1A2E]' : 'border-slate-200 bg-[#F8F9FA]'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez votre message..."
            className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-hidden ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#1EB53A] hover:bg-[#199931] text-white disabled:opacity-40 transition shadow-xs"
            aria-label="Envoyer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
