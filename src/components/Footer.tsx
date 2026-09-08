import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { FlitsideLogo } from './FlitsideLogo';

interface FooterProps {
  onSwitchView: (view: 'store' | 'admin') => void;
  onSelectCatalogComplete?: () => void;
  onSelectNewArrivals?: () => void;
  onOpenSizeGuide?: () => void;
  onOpenWelcome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSwitchView,
  onSelectCatalogComplete,
  onSelectNewArrivals,
  onOpenSizeGuide,
  onOpenWelcome,
}) => {
  const [clickCount, setClickCount] = useState(0);

  // Discreet access for store administrator (3 clicks on copyright)
  const handleSecretAdminClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setClickCount(0);
      onSwitchView('admin');
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <FlitsideLogo className="h-6 w-auto text-slate-900" />
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Contemporary fashion and forward design crafted with premium textiles. Every FlitSide garment is engineered to endure and express your distinctive style.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span>Organic Cotton</span>
              <span>•</span>
              <span>European Linen</span>
              <span>•</span>
              <span>Virgin Wool</span>
            </div>
          </div>

          {/* Navigation - Collections */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  id="footer-nav-catalog-complete"
                  onClick={() => {
                    if (onSelectCatalogComplete) {
                      onSelectCatalogComplete();
                    } else {
                      onSwitchView('store');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 font-medium block text-left"
                >
                  Full Catalog
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-new-arrivals"
                  onClick={() => {
                    if (onSelectNewArrivals) {
                      onSelectNewArrivals();
                    } else {
                      onSwitchView('store');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer text-slate-600 font-medium text-left group"
                >
                  <span>New Arrivals 2026</span>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    2026
                  </span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-size-guide"
                  onClick={() => {
                    if (onOpenSizeGuide) {
                      onOpenSizeGuide();
                    }
                  }}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 font-medium block text-left"
                >
                  Size & Care Guide
                </button>
              </li>
              {onOpenWelcome && (
                <li>
                  <button
                    id="footer-nav-welcome-screen"
                    onClick={onOpenWelcome}
                    className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 font-medium block text-left"
                  >
                    Home
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service & Guarantees */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Shipping & Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Express shipping in 24/48h</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Free 30-day returns</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>100% secure encrypted checkout</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p
            onClick={handleSecretAdminClick}
            className="cursor-default select-none"
            title=""
          >
            © {new Date().getFullYear()} FlitSide Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
