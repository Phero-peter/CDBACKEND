'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl' },
  };

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Stylized "B" with car silhouette */}
      <div className={`${sizes[size].icon} relative`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          {/* Main shape - Hexagon with rounded corners */}
          <path
            d="M24 2L44 14V34L24 46L4 34V14L24 2Z"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Inner shine */}
          <path
            d="M24 6L40 16V32L24 42L8 32V16L24 6Z"
            fill="url(#shineGradient)"
            opacity="0.3"
          />
          
          {/* Letter "B" stylized */}
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="22"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="drop-shadow-sm"
          >
            B
          </text>
          
          {/* Small accent line */}
          <path
            d="M16 36L32 36"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${sizes[size].text} font-black tracking-tight`}>
            <span className="text-amber-500">Bi</span>
            <span className="text-slate-800">Max</span>
          </span>
          <span className="text-[9px] text-slate-500 tracking-widest uppercase">Auto Motors</span>
        </div>
      )}
    </Link>
  );
}

// Compact version for small spaces
export function LogoCompact({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 rotate-3 hover:rotate-0 transition-transform">
        <span className="text-white font-black text-lg -rotate-3 hover:rotate-0 transition-transform">B</span>
      </div>
    </Link>
  );
}
