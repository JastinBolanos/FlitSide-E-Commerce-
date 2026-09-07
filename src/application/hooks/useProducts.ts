import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../domain/models';
import { productRepository } from '../../infrastructure/repositories';

export interface UseProductsReturn {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => boolean;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = productRepository.subscribe((latestProducts) => {
      setProducts(latestProducts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    return productRepository.create(productData);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>): Product | null => {
    return productRepository.update(id, updates);
  }, []);

  const deleteProduct = useCallback((id: string): boolean => {
    return productRepository.delete(id);
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
