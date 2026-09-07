import { IProductRepository } from '../../application/ports/productRepository';
import { Product } from '../../domain/models';
import { STORAGE_KEYS } from '../../core/constants';
import { INITIAL_PRODUCTS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

export class LocalStorageProductRepository implements IProductRepository {
  private listeners: Array<(products: Product[]) => void> = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    const existing = LocalStorageAdapter.getItem<Product[] | null>(
      STORAGE_KEYS.PRODUCTS,
      null,
      STORAGE_KEYS.LEGACY_PRODUCTS
    );

    if (!existing || existing.length === 0) {
      LocalStorageAdapter.setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  }

  public getAll(): Product[] {
    return LocalStorageAdapter.getItem<Product[]>(
      STORAGE_KEYS.PRODUCTS,
      INITIAL_PRODUCTS,
      STORAGE_KEYS.LEGACY_PRODUCTS
    );
  }

  public getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  }

  public saveAll(products: Product[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.notify(products);
  }

  public create(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getAll();
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    this.saveAll(updated);
    return newProduct;
  }

  public update(id: string, updates: Partial<Product>): Product | null {
    const products = this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    this.saveAll(products);
    return updatedProduct;
  }

  public delete(id: string): boolean {
    const products = this.getAll();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    this.saveAll(filtered);
    return true;
  }

  public subscribe(listener: (products: Product[]) => void): () => void {
    this.listeners.push(listener);
    // Emit initial snapshot
    listener(this.getAll());

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(products: Product[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(products);
      } catch (err) {
        console.error('[ProductRepository] Listener execution error', err);
      }
    });
  }
}
