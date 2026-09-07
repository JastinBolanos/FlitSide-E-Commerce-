import { Order, OrderStatus } from '../../domain/models';

export interface IOrderRepository {
  getAll(): Order[];
  getById(id: string): Order | undefined;
  saveAll(orders: Order[]): void;
  create(order: Order): Order;
  updateStatus(id: string, status: OrderStatus): Order | null;
  subscribe(listener: (orders: Order[]) => void): () => void;
}
