import { Product, Order, OrderStatus } from '../domain/models';
import { productRepository, orderRepository } from '../infrastructure/repositories';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

/**
 * DataService Facade
 * Provides a backward-compatible interface uniting Product and Order repositories
 * with inventory deduction business rules.
 */
class DataService {
  // ================= PRODUCTS =================

  public getProducts(): Product[] {
    return productRepository.getAll();
  }

  public getProductById(id: string): Product | undefined {
    return productRepository.getById(id);
  }

  public saveProducts(products: Product[]): void {
    productRepository.saveAll(products);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    return productRepository.create(productData);
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    return productRepository.update(id, updates);
  }

  public deleteProduct(id: string): boolean {
    return productRepository.delete(id);
  }

  public deductStock(productId: string, quantity: number): boolean {
    const product = productRepository.getById(productId);
    if (!product || product.stock < quantity) return false;

    const newStock = Math.max(0, product.stock - quantity);
    productRepository.update(productId, { stock: newStock });
    return true;
  }

  // ================= ORDERS =================

  public getOrders(): Order[] {
    return orderRepository.getAll();
  }

  public getOrderById(id: string): Order | undefined {
    return orderRepository.getById(id);
  }

  public saveOrders(orders: Order[]): void {
    orderRepository.saveAll(orders);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `FLT-${new Date().getFullYear()}-${randomHex}`,
      createdAt: now,
      updatedAt: now,
    };

    // Deduct stock for each purchased item
    for (const item of newOrder.items) {
      this.deductStock(item.productId, item.quantity);
    }

    return orderRepository.create(newOrder);
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): Order | null {
    return orderRepository.updateStatus(orderId, newStatus);
  }

  public resetToMock(): void {
    productRepository.saveAll(INITIAL_PRODUCTS);
    orderRepository.saveAll(INITIAL_ORDERS);
  }

  // Reactive subscription methods
  public subscribeProducts(callback: (products: Product[]) => void): () => void {
    return productRepository.subscribe(callback);
  }

  public subscribeOrders(callback: (orders: Order[]) => void): () => void {
    return orderRepository.subscribe(callback);
  }
}

export const dataService = new DataService();
