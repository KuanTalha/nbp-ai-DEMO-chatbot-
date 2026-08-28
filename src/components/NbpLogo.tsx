import React from "react";

/**
 * Authentic National Bank of Pakistan (NBP) Vector Emblem
 * Accurately rendering the official 3D spiraling ribbon knot emblem with lime/emerald gradients.
 */
export const NbpEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = "w-8 h-8",
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="National Bank of Pakistan Emblem"
    >
      <defs>
        {/* Main 3D Emerald Deep Gradient */}
        <linearGradient id="nbp-body-grad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="30%" stopColor="#00875a" />
          <stop offset="70%" stopColor="#005a3c" />
          <stop offset="100%" stopColor="#003d27" />
        </linearGradient>

        {/* Lime/Bright Highlight Gradient */}
        <linearGradient id="nbp-highlight-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="35%" stopColor="#4ade80" />
          <stop offset="75%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Inner Core Highlight */}
        <radialGradient id="nbp-core-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="85%" stopColor="#006a4e" />
          <stop offset="100%" stopColor="#003d27" />
        </radialGradient>

        <filter id="nbp-subtle-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#002b1c" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#nbp-subtle-shadow)">
        {/* Outer Circular Ring with 3D Bevel */}
        <path
          d="M 50 4 C 75.4 4, 96 24.6, 96 50 C 96 75.4, 75.4 96, 50 96 C 24.6 96, 4 75.4, 4 50 C 4 24.6, 24.6 4, 50 4 Z M 50 16 C 31.2 16, 16 31.2, 16 50 C 16 68.8, 31.2 84, 50 84 C 68.8 84, 84 68.8, 84 50 C 84 31.2, 68.8 16, 50 16 Z"
          fill="url(#nbp-body-grad)"
          fillRule="evenodd"
        />

        {/* Outer Highlight Rim (Top-Left Edge) */}
        <path
          d="M 10 50 A 40 40 0 0 1 50 10 A 40 40 0 0 1 90 50"
          stroke="url(#nbp-highlight-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Top-Right Swirling Blade */}
        <path
          d="M 50 16 C 68 16, 80 28, 76 46 C 72 40, 64 34, 55 36 C 48 37, 43 43, 44 50 C 43 38, 45 24, 50 16 Z"
          fill="url(#nbp-highlight-grad)"
        />

        {/* Right-Bottom Swirling Blade */}
        <path
          d="M 84 50 C 84 68, 72 80, 54 76 C 60 72, 66 64, 64 55 C 63 48, 57 43, 50 44 C 62 43, 76 45, 84 50 Z"
          fill="url(#nbp-body-grad)"
        />

        {/* Bottom-Left Swirling Blade */}
        <path
          d="M 50 84 C 32 84, 20 72, 24 54 C 28 60, 36 66, 45 64 C 52 63, 57 57, 56 50 C 57 62, 55 76, 50 84 Z"
          fill="url(#nbp-highlight-grad)"
        />

        {/* Top-Left Swirling Blade */}
        <path
          d="M 16 50 C 16 32, 28 20, 46 24 C 40 28, 34 36, 36 45 C 37 52, 43 57, 50 56 C 38 57, 24 55, 16 50 Z"
          fill="url(#nbp-body-grad)"
        />

        {/* Central Interlocking Torus / Loop */}
        <ellipse
          cx="50"
          cy="50"
          rx="14"
          ry="17"
          fill="url(#nbp-core-grad)"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.95"
        />

        {/* Central Aperture */}
        <ellipse
          cx="50"
          cy="50"
          rx="6"
          ry="9"
          fill="#ffffff"
        />

        {/* Dynamic Center Dot */}
        <circle cx="50" cy="50" r="3.5" fill="url(#nbp-highlight-grad)" />
      </g>
    </svg>
  );
};

/**
 * Official Slogan Component: "قوم کا اپنا بینک" with signature curved swooshes
 */
export const NbpSloganBadge: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = "",
  inverted = false,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center py-1 px-4 select-none ${className}`}>
      {/* Top Black / Dark Swoosh */}
      <svg
        className="w-24 sm:w-28 h-3.5 -mb-0.5"
        viewBox="0 0 100 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 5 12 C 40 2, 75 1, 95 13 C 85 5, 55 5, 5 12 Z"
          fill={inverted ? "#a8d5ba" : "currentColor"}
          className={inverted ? "" : "text-gray-900 dark:text-emerald-300"}
        />
      </svg>

      {/* Urdu Slogan Typography */}
      <div className="text-center font-bold tracking-normal leading-tight px-1 py-0.5">
        <span
          className={`text-sm sm:text-base font-extrabold ${
            inverted ? "text-emerald-300" : "text-[#007353] dark:text-emerald-400"
          }`}
          style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Segoe UI', Tahoma, sans-serif" }}
          dir="rtl"
        >
          قوم کا اپنا بینک
        </span>
      </div>

      {/* Bottom Black / Dark Swoosh */}
      <svg
        className="w-24 sm:w-28 h-3.5 -mt-0.5"
        viewBox="0 0 100 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 5 2 C 25 10, 60 10, 95 2 C 75 12, 40 12, 5 2 Z"
          fill={inverted ? "#a8d5ba" : "currentColor"}
          className={inverted ? "" : "text-gray-900 dark:text-emerald-300"}
        />
      </svg>
    </div>
  );
};

/**
 * Standard NBP Logo Lockup (Emblem + "NBP" + Dual English/Urdu Title)
 */
export const NbpLogoLockup: React.FC<{
  variant?: "light" | "dark" | "horizontal";
  className?: string;
  showSlogan?: boolean;
}> = ({ variant = "light", className = "", showSlogan = false }) => {
  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NbpEmblem className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-black text-xl sm:text-2xl tracking-tighter leading-none ${
              isDark ? "text-white" : "text-[#007353]"
            }`}
          >
            NBP
          </span>
          <span
            className={`text-xs sm:text-sm font-bold tracking-tight leading-none ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            National Bank of Pakistan
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span
            className={`text-[11px] sm:text-xs font-semibold leading-tight ${
              isDark ? "text-emerald-200" : "text-gray-700"
            }`}
            style={{ fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', Tahoma, sans-serif" }}
            dir="rtl"
          >
            نیشنل بینک آف پاکستان
          </span>
        </div>
      </div>
      {showSlogan && (
        <div className="hidden md:block ml-4 pl-4 border-l border-gray-200">
          <NbpSloganBadge inverted={isDark} />
        </div>
      )}
    </div>
  );
};

/**
 * Authentic Corporate Header Banner (Exact match to the user's uploaded official banner)
 * Left: Logo + Dual Title
 * Middle: UAN 111 627 627 & www.nbp.com.pk
 * Right: Urdu Slogan "قوم کا اپنا بینک" with top/bottom swooshes
 */
export const NbpCorporateHeaderBanner: React.FC<{
  className?: string;
  onLogoClick?: () => void;
}> = ({ className = "", onLogoClick }) => {
  return (
    <div
      id="nbp-official-corporate-header"
      className={`w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200/90 dark:border-[#222222] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 select-none shadow-xs transition-colors duration-200 ${className}`}
    >
      {/* Left: Emblem + NBP + English & Urdu Titles (Clickable to toggle sidebar) */}
      <div
        id="nbp-header-logo-button"
        onClick={onLogoClick}
        title={onLogoClick ? "Click logo to toggle sidebar" : undefined}
        role={onLogoClick ? "button" : undefined}
        tabIndex={onLogoClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onLogoClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onLogoClick();
          }
        }}
        className={`flex items-center gap-3 shrink-0 rounded-lg p-1 -m-1 transition-all ${
          onLogoClick
            ? "cursor-pointer hover:opacity-90 active:scale-[0.98] hover:bg-black/5 dark:hover:bg-white/5"
            : ""
        }`}
      >
        <NbpEmblem className="w-10 h-10 sm:w-11 sm:h-11 shrink-0" />
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl sm:text-3xl text-[#007353] dark:text-emerald-400 tracking-tighter leading-none">
            NBP
          </span>
          <div className="flex flex-col border-l border-gray-300 dark:border-[#333333] pl-3 py-0.5">
            <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-neutral-100 leading-tight">
              National Bank of Pakistan
            </span>
            <span
              className="text-[11px] sm:text-xs font-bold text-gray-800 dark:text-emerald-300 leading-snug mt-0.5"
              style={{ fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', Tahoma, sans-serif" }}
              dir="rtl"
            >
              نیشنل بینک آف پاکستان
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Official Contact & UAN (Helpline) */}
      <div className="hidden lg:flex flex-col items-center justify-center text-right font-medium">
        <div className="text-sm font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#007353] dark:text-emerald-300 uppercase bg-emerald-50 dark:bg-[#142a20] px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
            Helpline
          </span>
          <span>UAN 111 627 627</span>
        </div>
        <a
          href="https://www.nbp.com.pk"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#007353] dark:text-emerald-400 hover:underline font-semibold tracking-normal mt-0.5"
        >
          www.nbp.com.pk
        </a>
      </div>

      {/* Right: Official Urdu Slogan "قوم کا اپنا بینک" with signature Swooshes */}
      <div className="shrink-0 flex items-center">
        <NbpSloganBadge />
      </div>
    </div>
  );
};
