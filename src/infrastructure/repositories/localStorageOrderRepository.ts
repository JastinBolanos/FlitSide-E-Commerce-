import { IOrderRepository } from '../../application/ports/orderRepository';
import { Order, OrderStatus } from '../../domain/models';
import { STORAGE_KEYS } from '../../core/constants';
import { INITIAL_ORDERS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

export class LocalStorageOrderRepository implements IOrderRepository {
  private listeners: Array<(orders: Order[]) => void> = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    const existing = LocalStorageAdapter.getItem<Order[] | null>(
      STORAGE_KEYS.ORDERS,
      null,
      STORAGE_KEYS.LEGACY_ORDERS
    );

    const STATUS_MAP: Record<string, OrderStatus> = {
      Pendiente: 'Pending',
      'En preparación': 'In Preparation',
      Enviado: 'Shipped',
      Entregado: 'Delivered',
      Cancelado: 'Cancelled',
    };

    if (!existing || existing.length === 0) {
      LocalStorageAdapter.setItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    } else {
      let hasChanges = false;
      const updated = existing.map((order) => {
        if (STATUS_MAP[order.status]) {
          hasChanges = true;
          return { ...order, status: STATUS_MAP[order.status] };
        }
        return order;
      });
      if (hasChanges) {
        LocalStorageAdapter.setItem(STORAGE_KEYS.ORDERS, updated);
      }
    }
  }

  public getAll(): Order[] {
    return LocalStorageAdapter.getItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_ORDERS,
      STORAGE_KEYS.LEGACY_ORDERS
    );
  }

  public getById(id: string): Order | undefined {
    return this.getAll().find((o) => o.id === id);
  }

  public saveAll(orders: Order[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEYS.ORDERS, orders);
    this.notify(orders);
  }

  public create(order: Order): Order {
    const orders = this.getAll();
    const updated = [order, ...orders];
    this.saveAll(updated);
    return order;
  }

  public updateStatus(id: string, status: OrderStatus): Order | null {
    const orders = this.getAll();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const updatedOrder: Order = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updatedOrder;
    this.saveAll(orders);
    return updatedOrder;
  }

  public subscribe(listener: (orders: Order[]) => void): () => void {
    this.listeners.push(listener);
    // Emit initial snapshot
    listener(this.getAll());

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(orders: Order[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(orders);
      } catch (err) {
        console.error('[OrderRepository] Listener execution error', err);
      }
    });
  }
}
