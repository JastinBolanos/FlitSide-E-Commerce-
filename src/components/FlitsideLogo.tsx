import React from 'react';

interface FlitsideLogoProps {
  className?: string;
  color?: string;
  markOnly?: boolean;
}

/**
 * FlitsideLogo Component
 * Faithfully vectorizes and renders the geometric FlitSide wordmark & logotype:
 * - Floating top horizontal bar on F
 * - Characteristic 45-degree top-left chamfers on L, I, and T
 * - Bold geometric curvature on S and D
 * - Signature three-bar stencil E (≡)
 */
export const FlitsideLogo: React.FC<FlitsideLogoProps> = ({
  className = 'h-7 w-auto',
  color = 'currentColor',
  markOnly = false,
}) => {
  if (markOnly) {
    return (
      <svg
        viewBox="0 0 54 90"
        fill={color}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FlitSide Logo Mark"
      >
        {/* F Mark */}
        <rect x="0" y="0" width="52" height="18" rx="0.5" />
        <path d="M 0,36 L 52,36 L 52,54 L 18,54 L 18,90 L 0,90 Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 432 90"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FlitSide"
      role="img"
    >
      {/* F (x: 0, w: 52) */}
      {/* F - Top Bar */}
      <rect x="0" y="0" width="52" height="18" rx="0.5" />
      {/* F - Stem & Middle Bar */}
      <path d="M 0,36 L 52,36 L 52,54 L 18,54 L 18,90 L 0,90 Z" />

      {/* L (x: 64, w: 50) */}
      <path d="M 64,24 L 82,0 L 82,72 L 114,72 L 114,90 L 64,90 Z" />

      {/* I (x: 126, w: 18) */}
      <path d="M 126,24 L 144,0 L 144,90 L 126,90 Z" />

      {/* T (x: 156, w: 52) */}
      <path d="M 156,20 L 172,0 L 208,0 L 208,18 L 191,18 L 191,90 L 173,90 L 173,18 L 156,18 Z" />

      {/* S (x: 220, w: 52) */}
      <path d="M 225,18 C 225,8 234,0 245,0 L 260,0 C 268,0 272,6 272,15 L 272,30 C 272,39 266,45 256,47 L 244,49 C 239,50 238,53 238,57 L 238,72 C 238,74 240,75 243,75 L 272,75 L 272,90 L 245,90 C 233,90 220,82 220,70 L 220,55 C 220,45 227,40 236,38 L 249,35 C 254,34 256,32 256,28 L 256,18 C 256,16 254,15 250,15 L 225,15 Z" />

      {/* I (x: 284, w: 18) */}
      <path d="M 284,24 L 302,0 L 302,90 L 284,90 Z" />

      {/* D (x: 314, w: 54) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 314,0 L 339,0 C 355,0 368,13 368,30 L 368,60 C 368,77 355,90 339,90 L 314,90 Z M 332,18 L 339,18 C 346,18 350,23 350,32 L 350,58 C 350,67 346,72 339,72 L 332,72 Z"
      />

      {/* E (x: 380, w: 50) */}
      {/* E - Top Bar */}
      <rect x="380" y="0" width="50" height="18" rx="0.5" />
      {/* E - Middle Bar */}
      <rect x="380" y="36" width="50" height="18" rx="0.5" />
      {/* E - Bottom Bar */}
      <rect x="380" y="72" width="50" height="18" rx="0.5" />
    </svg>
  );
};
