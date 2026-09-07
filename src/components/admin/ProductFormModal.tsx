import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt'>, editingId?: string) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = ['Camisetas', 'Pantalones', 'Chaquetas', 'Calzado', 'Accesorios'];
const AVAILABLE_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'Única'];

const DEFAULT_IMAGES: Record<ProductCategory, string> = {
  Camisetas: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  Pantalones: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  Chaquetas: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  Calzado: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  Accesorios: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialProduct;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Camisetas');
  const [price, setPrice] = useState<number>(35);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [sizes, setSizes] = useState<ProductSize[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['#0f172a', '#f8fafc']);
  const [newColor, setNewColor] = useState('#64748b');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice);
      setStock(initialProduct.stock);
      setDescription(initialProduct.description);
      setMaterial(initialProduct.material || '');
      setSizes(initialProduct.sizes);
      setColors(initialProduct.colors);
      setImageUrl(initialProduct.imageUrl);
      setFeatured(!!initialProduct.featured);
    } else {
      setName('');
      setCategory('Camisetas');
      setPrice(35);
      setOriginalPrice(undefined);
      setStock(10);
      setDescription('');
      setMaterial('');
      setSizes(['S', 'M', 'L']);
      setColors(['#0f172a', '#94a3b8']);
      setImageUrl(DEFAULT_IMAGES.Camisetas);
      setFeatured(false);
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  const toggleSize = (size: ProductSize) => {
    if (sizes.includes(size)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== size));
      }
    } else {
      setSizes([...sizes, size]);
    }
  };

  const addColor = () => {
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    if (colors.length > 1) {
      setColors(colors.filter((c) => c !== colorToRemove));
    }
  };

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (!imageUrl || Object.values(DEFAULT_IMAGES).includes(imageUrl)) {
      setImageUrl(DEFAULT_IMAGES[newCat]);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'El nombre de la prenda es obligatorio';
    if (price <= 0) errs.price = 'El precio debe ser superior a 0';
    if (stock < 0) errs.stock = 'El stock no puede ser negativo';
    if (!imageUrl.trim()) errs.imageUrl = 'Introduce una URL de imagen válida';
    if (sizes.length === 0) errs.sizes = 'Selecciona al menos una talla';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        name,
        category,
        price,
        originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
        stock,
        description: description.trim() || `${name} en tejido de alta calidad para un estilo limpio y duradero.`,
        material: material.trim() || undefined,
        sizes,
        colors,
        imageUrl: imageUrl.trim() || DEFAULT_IMAGES[category],
        featured,
      },
      initialProduct?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">
            {isEditing ? 'Editar Prenda' : 'Añadir Nueva Prenda al Inventario'}
          </h2>
          <button
            id="btn-close-product-form"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de la prenda *</label>
              <input
                id="product-form-name"
                type="text"
                placeholder="Ej. Sobrecamisa de Lana Pura"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Categoría *</label>
              <select
                id="product-form-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price, Original Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Precio (€) *</label>
              <input
                id="product-form-price"
                type="number"
                step="0.5"
                min="1"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Precio anterior / tachado (€)</label>
              <input
                id="product-form-original-price"
                type="number"
                step="0.5"
                min="0"
                placeholder="Opcional"
                value={originalPrice ?? ''}
                onChange={(e) =>
                  setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Stock disponible *</label>
              <input
                id="product-form-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              {errors.stock && <p className="text-[11px] text-rose-500 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Row 3: Image URL with preview */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">URL de la imagen *</label>
            <div className="flex gap-2">
              <input
                id="product-form-image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => setImageUrl(DEFAULT_IMAGES[category])}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg whitespace-nowrap"
              >
                Foto sugerida
              </button>
            </div>
            {errors.imageUrl && <p className="text-[11px] text-rose-500 mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Row 4: Description & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Descripción de la prenda</label>
              <textarea
                id="product-form-desc"
                rows={3}
                placeholder="Detalla corte, tacto, estilo y ocasiones recomendadas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Composición / Material</label>
              <input
                id="product-form-material"
                type="text"
                placeholder="Ej. 100% Algodón orgánico certificado"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 mb-3"
              />

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 mt-3 select-none">
                <input
                  id="product-form-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Destacar en portada de catálogo</span>
              </label>
            </div>
          </div>

          {/* Row 5: Sizes Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Tallas disponibles</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-8 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {errors.sizes && <p className="text-[11px] text-rose-500 mt-1">{errors.sizes}</p>}
          </div>

          {/* Row 6: Colors */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Colores</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-mono text-slate-600">{color}</span>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                  title="Seleccionar nuevo color"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium cursor-pointer"
                >
                  Añadir color
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-save-product"
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Prenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
