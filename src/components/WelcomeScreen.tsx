import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { FlitsideLogo } from './FlitsideLogo';

const BRAND_LETTERS = ['F', 'L', 'I', 'T', 'S', 'I', 'D', 'E'];

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  // Support pressing 'Enter' key to enter directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  return (
    <motion.div
      id="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 text-white overflow-hidden select-none"
    >
      {/* Ambient background glow & subtle grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial highlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[500px] sm:h-[650px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />

        {/* Subtle high-fashion editorial grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Light vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 sm:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlitsideLogo className="h-5 sm:h-6 w-auto text-white/90" markOnly />
          <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
            FLITSIDE STUDIO
          </span>
        </div>
      </header>

      {/* Centerpiece: Giant FLITSIDE and Ingresar Button */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center my-auto py-8">
        {/* Subtle Category Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium tracking-[0.2em] text-slate-200 uppercase mb-4 sm:mb-6"
        >
          <span>Contemporary Fashion & Streetwear</span>
        </motion.div>

        {/* FlitSide Animated Brand Title - Letters stretching rhythmically */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center items-center my-3 sm:my-5 overflow-hidden"
        >
          <motion.h1
            id="welcome-title-flitside"
            className="flex items-center justify-center font-['Syne'] font-extrabold uppercase text-white text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)] select-none"
            animate={{
              letterSpacing: ['-0.01em', '0.04em', '-0.01em'],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {BRAND_LETTERS.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className="inline-block origin-center will-change-transform px-[1px] sm:px-[2px]"
                animate={{
                  scaleX: [1, 1.25, 0.92, 1.15, 1],
                  scaleY: [1, 0.9, 1.06, 0.95, 1],
                }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
                  delay: index * 0.16,
                }}
                whileHover={{
                  scaleX: 1.35,
                  scaleY: 0.88,
                  color: '#93c5fd',
                  transition: { duration: 0.2 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Brand slogan describing what is sold */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-slate-300 text-xs sm:text-sm md:text-base font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase max-w-2xl mx-auto mt-4 sm:mt-6 mb-8 sm:mb-10"
        >
          Contemporary fashion & streetwear • Exclusive designs crafted for modern distinction
        </motion.p>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center"
        >
          <button
            id="welcome-enter-btn"
            onClick={onEnter}
            autoFocus
            className="group relative inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-base sm:text-lg tracking-wider uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>ENTER STORE</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </motion.div>
      </main>

      {/* Bottom Bar: Brand Commitments */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 sm:py-8 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400">
            <Truck className="w-4 h-4 text-slate-300" />
            <span>Express 24/48h delivery nationwide & international</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-slate-300" />
            <span>Exclusive garments with architectural craftsmanship</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <span>Hassle-free 30-day exchanges & returns</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};
