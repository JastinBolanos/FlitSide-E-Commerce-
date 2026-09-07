export type ProductCategory = 'Camisetas' | 'Pantalones' | 'Chaquetas' | 'Calzado' | 'Accesorios';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Única';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  sizes: ProductSize[];
  colors: string[];
  imageUrl: string;
  material?: string;
  createdAt: string;
  featured?: boolean;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'stock';
  selectedSize: string;
  inStockOnly: boolean;
}
