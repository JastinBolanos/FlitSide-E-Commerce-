import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt'>, editingId?: string) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = ['T-Shirts', 'Pants', 'Jackets', 'Footwear', 'Accessories'];
const AVAILABLE_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

const DEFAULT_IMAGES: Record<string, string> = {
  'T-Shirts': '/images/prod-1.jpg',
  'Pants': '/images/prod-3.jpg',
  'Jackets': '/images/prod-4.jpg',
  'Footwear': '/images/prod-6.jpg',
  'Accessories': '/images/prod-8.jpg',
  'Camisetas': '/images/prod-1.jpg',
  'Pantalones': '/images/prod-3.jpg',
  'Chaquetas': '/images/prod-4.jpg',
  'Calzado': '/images/prod-6.jpg',
  'Accesorios': '/images/prod-8.jpg',
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
  const [category, setCategory] = useState<ProductCategory>('T-Shirts');
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
      setCategory('T-Shirts');
      setPrice(35);
      setOriginalPrice(undefined);
      setStock(10);
      setDescription('');
      setMaterial('');
      setSizes(['S', 'M', 'L']);
      setColors(['#0f172a', '#94a3b8']);
      setImageUrl(DEFAULT_IMAGES['T-Shirts']);
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
      setImageUrl(DEFAULT_IMAGES[newCat] || DEFAULT_IMAGES['T-Shirts']);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Garment name is required';
    if (price <= 0) errs.price = 'Price must be greater than 0';
    if (stock < 0) errs.stock = 'Stock cannot be negative';
    if (!imageUrl.trim()) errs.imageUrl = 'Please provide a valid image URL';
    if (sizes.length === 0) errs.sizes = 'Please select at least one size';

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
        description: description.trim() || `${name} crafted from fine textiles for a clean, enduring aesthetic.`,
        material: material.trim() || undefined,
        sizes,
        colors,
        imageUrl: imageUrl.trim() || DEFAULT_IMAGES[category] || DEFAULT_IMAGES['T-Shirts'],
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
            {isEditing ? 'Edit Garment' : 'Add New Garment to Inventory'}
          </h2>
          <button
            id="btn-close-product-form"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Garment Name *</label>
              <input
                id="product-form-name"
                type="text"
                placeholder="e.g. Pure Virgin Wool Overshirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
              <select
                id="product-form-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Price (€) *</label>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Original Price (€)</label>
              <input
                id="product-form-original-price"
                type="number"
                step="0.5"
                min="0"
                placeholder="Optional"
                value={originalPrice ?? ''}
                onChange={(e) =>
                  setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Available Stock *</label>
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
            <label className="block text-xs font-medium text-slate-700 mb-1">Image URL *</label>
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
                onClick={() => setImageUrl(DEFAULT_IMAGES[category] || DEFAULT_IMAGES['T-Shirts'])}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg whitespace-nowrap cursor-pointer"
              >
                Suggested photo
              </button>
            </div>
            {errors.imageUrl && <p className="text-[11px] text-rose-500 mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Row 4: Description & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Garment Description</label>
              <textarea
                id="product-form-desc"
                rows={3}
                placeholder="Describe cut, silhouette, feel and styling notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Composition / Material</label>
              <input
                id="product-form-material"
                type="text"
                placeholder="e.g. 100% Certified Organic Cotton"
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
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <span>Feature in collection showcase</span>
              </label>
            </div>
          </div>

          {/* Row 5: Sizes Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Available Sizes</label>
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
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Colors</label>
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
                      className="text-slate-400 hover:text-rose-500 p-0.5 ml-1 cursor-pointer"
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
                  title="Select new color"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium cursor-pointer"
                >
                  Add color
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
              Cancel
            </button>
            <button
              id="btn-save-product"
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Garment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
