import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { FlitsideLogo } from './FlitsideLogo';

interface FooterProps {
  onSwitchView: (view: 'store' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSwitchView }) => {
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
              Moda contemporánea y diseño de vanguardia con tejidos de alta calidad. Cada prenda FlitSide está pensada para perdurar y acompañar tu estilo con personalidad.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span>Algodón Orgánico</span>
              <span>•</span>
              <span>Lino Europeo</span>
              <span>•</span>
              <span>Lana Virgen</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSwitchView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <span className="text-slate-500">Nuevas Llegadas 2026</span>
              </li>
              <li>
                <span className="text-slate-500">Guía de Tallas & Cuidados</span>
              </li>
            </ul>
          </div>

          {/* Customer Service & Guarantees */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Garantía & Envíos
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Envío express en 24/48h</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Devoluciones gratis en 30 días</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Pago 100% seguro y garantizado</span>
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
            © {new Date().getFullYear()} FlitSide Studio. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacidad</span>
            <span>•</span>
            <span>Términos</span>
            <span>•</span>
            <span>Ayuda</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
