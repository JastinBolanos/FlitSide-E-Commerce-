import { useState, useEffect, useCallback, useMemo } from 'react';
import { Order, OrderStatus } from '../../domain/models';
import { orderRepository } from '../../infrastructure/repositories';

export interface UseOrdersReturn {
  orders: Order[];
  pendingOrdersCount: number;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Order | null;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = orderRepository.subscribe((latestOrders) => {
      setOrders(latestOrders);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === 'Pending' ||
        o.status === 'In Preparation' ||
        o.status === 'Pendiente' ||
        o.status === 'En preparación'
    ).length;
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus): Order | null => {
    return orderRepository.updateStatus(orderId, status);
  }, []);

  return {
    orders,
    pendingOrdersCount,
    updateOrderStatus,
  };
}
