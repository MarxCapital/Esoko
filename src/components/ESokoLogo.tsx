import React from 'react';

export interface ESokoLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  isDark?: boolean;
}

/**
 * Official E-Soko Logo Component
 * Uses the authentic official photo asset for E-Soko Burundi:
 * Stylized green 'E' with speed bars, red shopping cart with Burundi flag stars,
 * 'E-Soko' typography and 'Le marché du Burundi, en un clic' slogan with tricolor underline.
 */
export const ESokoLogo: React.FC<ESokoLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSlogan = true,
  className = '',
  isDark = false,
}) => {
  // Height definitions for full vertical logo
  const fullHeights = {
    xs: 'h-12',
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-36',
    xl: 'h-48',
  }[size];

  // Height definitions for horizontal logo
  const horizontalHeights = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }[size];

  // Height definitions for icon emblem
  const iconHeights = {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-14 w-auto',
    xl: 'h-20 w-auto',
  }[size];

  // Icon Only Variant
  if (variant === 'icon') {
    return (
      <div
        id="esoko-logo-icon"
        className={`inline-flex items-center justify-center shrink-0 ${
          isDark ? 'bg-white p-1 rounded-xl shadow-xs' : ''
        } ${className}`}
      >
        <img
          src="/esoko-emblem-transparent.png"
          alt="E-Soko Burundi"
          className={`${iconHeights} object-contain shrink-0`}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // Badge Variant (framed in a card/pill with authentic logo)
  if (variant === 'badge') {
    return (
      <div
        id="esoko-logo-badge"
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
          isDark
            ? 'bg-[#1A1A2E]/90 border-slate-700 text-white shadow-xs'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        } ${className}`}
      >
        <div className="bg-white rounded-lg p-0.5 shrink-0 shadow-2xs">
          <img
            src="/esoko-emblem-transparent.png"
            alt="Emblème E-Soko"
            className="h-6 w-auto object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-black text-xs tracking-tight">
            <span className="text-[#CE1126]">E-</span>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Soko</span>
          </span>
          <span className="text-[9px] text-[#1EB53A] font-bold tracking-wide mt-0.5">
            Burundi
          </span>
        </div>
      </div>
    );
  }

  // Full Stacked Official Logo (As directly in the photo with emblem, text, slogan, and tricolor bar)
  if (variant === 'full') {
    return (
      <div
        id="esoko-logo-full"
        className={`inline-flex flex-col items-center justify-center text-center select-none ${
          isDark ? 'bg-white/95 p-3 rounded-2xl shadow-md border border-white/20' : ''
        } ${className}`}
      >
        <img
          src="/esoko-logo-cropped.png"
          alt="E-Soko — Le marché du Burundi, en un clic"
          className={`${fullHeights} w-auto object-contain mx-auto transition-transform duration-200 hover:scale-[1.02]`}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // Horizontal Variant (Ideal for Navbar, Headers, Footers)
  const logoImageSrc = showSlogan
    ? '/esoko-logo-horizontal.png'
    : '/esoko-logo-compact.png';

  return (
    <div
      id="esoko-logo-horizontal"
      className={`inline-flex items-center select-none shrink-0 ${
        isDark ? 'bg-white/95 px-2 py-1 rounded-xl shadow-xs border border-white/30' : ''
      } ${className}`}
    >
      <img
        src={logoImageSrc}
        alt="E-Soko — Le marché du Burundi, en un clic"
        className={`${horizontalHeights} w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-[1.02]`}
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
