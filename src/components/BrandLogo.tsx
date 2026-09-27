import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Official colorful KID.X brand logo.
 * Kept deliberately small, crisp, and balanced in the website header ('sm').
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'sm', className = '' }) => {
  const dimensions = {
    sm: { badge: 'w-7 h-7', text: 'text-xl', dot: 'w-1.5 h-1.5' },
    md: { badge: 'w-9 h-9', text: 'text-2xl', dot: 'w-2 h-2' },
    lg: { badge: 'w-12 h-12', text: 'text-3xl', dot: 'w-2.5 h-2.5' },
  }[size];

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <img
        src="/icon.svg"
        alt="KID.X Official Logo"
        referrerPolicy="no-referrer"
        className={`${dimensions.badge} rounded-lg shadow-xs object-contain shrink-0`}
      />
      <span
        className={`font-display font-bold tracking-tight leading-none flex items-baseline ${dimensions.text}`}
        aria-label="KID.X"
      >
        <span className="text-[#FF595E]">K</span>
        <span className="text-[#FF9F1C]">I</span>
        <span className="text-[#65A30D]">D</span>
        <span className="text-[#9B5DE5] mx-0.5">.</span>
        <span className="text-[#1982C4]">X</span>
      </span>
    </span>
  );
};
