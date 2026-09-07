import React, { useState, useEffect } from 'react';
import { X, Ruler, Shirt, Sparkles, Info, Check } from 'lucide-react';

interface SizeCareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sizes' | 'care';
}

type SizeCategory = 'tops' | 'pants' | 'jackets' | 'shoes';

export const SizeCareGuideModal: React.FC<SizeCareGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'sizes',
}) => {
  const [activeTab, setActiveTab] = useState<'sizes' | 'care'>(defaultTab);
  const [sizeCategory, setSizeCategory] = useState<SizeCategory>('tops');

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync tab if defaultTab changes when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  return (
    <div
      id="size-care-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="size-care-guide-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                FlitSide Atelier
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Temporada 2026</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Guía de Tallas & Cuidados
            </h2>
          </div>
          <button
            id="btn-close-size-care-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            id="tab-sizes-guide"
            onClick={() => setActiveTab('sizes')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sizes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Tabla de Medidas & Tallas</span>
          </button>
          <button
            id="tab-care-guide"
            onClick={() => setActiveTab('care')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'care'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Cuidado de Tejidos Nobles</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-700">
          {activeTab === 'sizes' ? (
            <div className="space-y-6">
              {/* Category sub-selector */}
              <div className="flex items-center gap-2 flex-wrap pb-1">
                <span className="text-xs text-slate-500 font-medium mr-1">Prenda:</span>
                <button
                  id="btn-category-tops"
                  onClick={() => setSizeCategory('tops')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sizeCategory === 'tops'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Camisetas & Sudaderas
                </button>
                <button
                  id="btn-category-pants"
                  onClick={() => setSizeCategory('pants')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sizeCategory === 'pants'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pantalones & Jeans
                </button>
                <button
                  id="btn-category-jackets"
                  onClick={() => setSizeCategory('jackets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sizeCategory === 'jackets'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Chaquetas & Abrigos
                </button>
                <button
                  id="btn-category-shoes"
                  onClick={() => setSizeCategory('shoes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sizeCategory === 'shoes'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Calzado
                </button>
              </div>

              {/* Table rendering based on category */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                {sizeCategory === 'tops' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Talla</th>
                        <th className="py-3 px-4">Contorno Pecho (cm)</th>
                        <th className="py-3 px-4">Cintura (cm)</th>
                        <th className="py-3 px-4">Cadera (cm)</th>
                        <th className="py-3 px-4">Largo Prenda (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XS</td>
                        <td className="py-3 px-4">86 - 90</td>
                        <td className="py-3 px-4">74 - 78</td>
                        <td className="py-3 px-4">88 - 92</td>
                        <td className="py-3 px-4">67</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">S</td>
                        <td className="py-3 px-4">91 - 95</td>
                        <td className="py-3 px-4">79 - 83</td>
                        <td className="py-3 px-4">93 - 97</td>
                        <td className="py-3 px-4">69</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">M</td>
                        <td className="py-3 px-4">96 - 101</td>
                        <td className="py-3 px-4">84 - 89</td>
                        <td className="py-3 px-4">98 - 103</td>
                        <td className="py-3 px-4">71</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">L</td>
                        <td className="py-3 px-4">102 - 107</td>
                        <td className="py-3 px-4">90 - 95</td>
                        <td className="py-3 px-4">104 - 109</td>
                        <td className="py-3 px-4">73</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XL</td>
                        <td className="py-3 px-4">108 - 114</td>
                        <td className="py-3 px-4">96 - 102</td>
                        <td className="py-3 px-4">110 - 116</td>
                        <td className="py-3 px-4">75</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {sizeCategory === 'pants' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Talla FlitSide</th>
                        <th className="py-3 px-4">Cintura (cm)</th>
                        <th className="py-3 px-4">Cadera (cm)</th>
                        <th className="py-3 px-4">Largo Entrepierna (cm)</th>
                        <th className="py-3 px-4">Equiv. US</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XS</td>
                        <td className="py-3 px-4">72 - 76</td>
                        <td className="py-3 px-4">88 - 92</td>
                        <td className="py-3 px-4">78</td>
                        <td className="py-3 px-4">W28 - W29</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">S</td>
                        <td className="py-3 px-4">77 - 81</td>
                        <td className="py-3 px-4">93 - 97</td>
                        <td className="py-3 px-4">79</td>
                        <td className="py-3 px-4">W30 - W31</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">M</td>
                        <td className="py-3 px-4">82 - 87</td>
                        <td className="py-3 px-4">98 - 103</td>
                        <td className="py-3 px-4">80</td>
                        <td className="py-3 px-4">W32 - W33</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">L</td>
                        <td className="py-3 px-4">88 - 93</td>
                        <td className="py-3 px-4">104 - 109</td>
                        <td className="py-3 px-4">81</td>
                        <td className="py-3 px-4">W34 - W35</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XL</td>
                        <td className="py-3 px-4">94 - 100</td>
                        <td className="py-3 px-4">110 - 116</td>
                        <td className="py-3 px-4">82</td>
                        <td className="py-3 px-4">W36 - W38</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {sizeCategory === 'jackets' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Talla</th>
                        <th className="py-3 px-4">Pecho (cm)</th>
                        <th className="py-3 px-4">Hombro a Hombro (cm)</th>
                        <th className="py-3 px-4">Largo de Manga (cm)</th>
                        <th className="py-3 px-4">Largo Total (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XS</td>
                        <td className="py-3 px-4">88 - 92</td>
                        <td className="py-3 px-4">43</td>
                        <td className="py-3 px-4">63</td>
                        <td className="py-3 px-4">68</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">S</td>
                        <td className="py-3 px-4">93 - 97</td>
                        <td className="py-3 px-4">45</td>
                        <td className="py-3 px-4">64</td>
                        <td className="py-3 px-4">70</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">M</td>
                        <td className="py-3 px-4">98 - 103</td>
                        <td className="py-3 px-4">47</td>
                        <td className="py-3 px-4">65</td>
                        <td className="py-3 px-4">72</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">L</td>
                        <td className="py-3 px-4">104 - 109</td>
                        <td className="py-3 px-4">49</td>
                        <td className="py-3 px-4">66</td>
                        <td className="py-3 px-4">74</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">XL</td>
                        <td className="py-3 px-4">110 - 116</td>
                        <td className="py-3 px-4">51</td>
                        <td className="py-3 px-4">67</td>
                        <td className="py-3 px-4">76</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {sizeCategory === 'shoes' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Talla EU</th>
                        <th className="py-3 px-4">Longitud del Pie (cm)</th>
                        <th className="py-3 px-4">Equivalente UK</th>
                        <th className="py-3 px-4">Equivalente US</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">40</td>
                        <td className="py-3 px-4">25.4 cm</td>
                        <td className="py-3 px-4">6.5</td>
                        <td className="py-3 px-4">7.5</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">41</td>
                        <td className="py-3 px-4">26.0 cm</td>
                        <td className="py-3 px-4">7.5</td>
                        <td className="py-3 px-4">8.5</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">42</td>
                        <td className="py-3 px-4">26.7 cm</td>
                        <td className="py-3 px-4">8.0</td>
                        <td className="py-3 px-4">9.0</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">43</td>
                        <td className="py-3 px-4">27.3 cm</td>
                        <td className="py-3 px-4">9.0</td>
                        <td className="py-3 px-4">10.0</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">44</td>
                        <td className="py-3 px-4">28.0 cm</td>
                        <td className="py-3 px-4">9.5</td>
                        <td className="py-3 px-4">10.5</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900">45</td>
                        <td className="py-3 px-4">28.7 cm</td>
                        <td className="py-3 px-4">10.5</td>
                        <td className="py-3 px-4">11.5</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {/* Instructions box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>¿Cómo tomar tus medidas con precisión?</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-6">
                  Usa una cinta métrica flexible manteniéndola horizontal al suelo y sin apretar contra la piel:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-6 text-slate-600">
                  <li><strong>Pecho:</strong> Mide alrededor de la parte más prominente del torso.</li>
                  <li><strong>Cintura:</strong> Mide alrededor del punto natural más estrecho del abdomen.</li>
                  <li><strong>Cadera:</strong> De pie con los talones juntos, mide el contorno más ancho.</li>
                  <li><strong>Ajuste:</strong> Si estás entre dos tallas, te sugerimos la talla menor para un corte entallado o la mayor para un fit relajado contemporáneo.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cotton Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      100% Algodón Pima & Orgánico
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                    Camisetas, Polos y Sudaderas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Lavar a máquina a un máximo de 30°C en ciclo suave.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Utilizar detergentes neutros sin agentes blanqueadores.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Secar al aire a la sombra; evitar secadora para no encoger fibras.</span>
                    </li>
                  </ul>
                </div>

                {/* Linen Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Lino Europeo Lavado
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                    Sobrecamisas y Bermudas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Lavado en agua fría o tibia con centrifugado suave (máx 800 rpm).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Planchar mientras la prenda esté ligeramente húmeda con vapor.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>El lino natural gana caída y suavidad lavado tras lavado.</span>
                    </li>
                  </ul>
                </div>

                {/* Wool Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Lana Virgen & Merino
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                    Abrigos y Chaquetas Estructuradas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Ventilar la prenda al aire fresco entre usos para regenerar la fibra.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Lavado a mano en frío con jabón para lanas o limpieza en seco profesional.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Secar siempre en horizontal sobre una toalla limpia, nunca colgar.</span>
                    </li>
                  </ul>
                </div>

                {/* Technical / Denim Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      Denim Selvedge & Tejidos Técnicos
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                    Vaqueros, Cazadoras y Trenchs
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Denim: Lavar del revés en agua fría para mantener el tono índigo.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Trench/Bomber: No usar suavizantes (destruyen el acabado hidrófugo).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Guardar en perchas anchas para mantener los hombros estructurados.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Eco tip banner */}
              <div className="flex items-center gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                <p>
                  <strong>Compromiso FlitSide con la longevidad:</strong> Cuidar tus prendas a baja temperatura reduce la huella de carbono y multiplica la vida útil de cada tejido noble.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            ¿Dudas específicas sobre tu talla? Escríbenos a soporte@flitside.com
          </p>
          <button
            id="btn-confirm-close-size-care-modal"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
