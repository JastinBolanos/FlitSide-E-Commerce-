import { Product } from '../../domain/models';

export interface IProductRepository {
  getAll(): Product[];
  getById(id: string): Product | undefined;
  saveAll(products: Product[]): void;
  create(productData: Omit<Product, 'id' | 'createdAt'>): Product;
  update(id: string, updates: Partial<Product>): Product | null;
  delete(id: string): boolean;
  subscribe(listener: (products: Product[]) => void): () => void;
}
