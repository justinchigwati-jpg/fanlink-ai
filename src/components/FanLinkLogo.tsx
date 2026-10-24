import React from 'react';

interface FanLinkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const FanLinkLogo: React.FC<FanLinkLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = ''
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    hero: 'w-24 h-24 rounded-3xl'
  };

  const wordmarkClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    hero: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 3D Ribbon F Icon */}
      <div className={`relative ${iconSizeClasses[size]} bg-gradient-to-br from-[#0A100D] to-[#030604] border border-[#183A2A] p-1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00E676]/10`}>
        <img
          src="/icon.svg"
          alt="FanLink Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]"
        />
      </div>

      {/* Wordmark & Tagline */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight ${wordmarkClasses[size]} leading-none flex items-center`}>
            <span className="text-white">Fan</span>
            <span className="text-[#00E676] ml-0.5">Link</span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-[#A8B5AE] font-medium tracking-wide mt-1">
              Fans • Stars • Together
            </span>
          )}
        </div>
      )}
    </div>
  );
};
