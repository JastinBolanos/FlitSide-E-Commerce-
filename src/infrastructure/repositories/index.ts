import { LocalStorageProductRepository } from './localStorageProductRepository';
import { LocalStorageOrderRepository } from './localStorageOrderRepository';

export const productRepository = new LocalStorageProductRepository();
export const orderRepository = new LocalStorageOrderRepository();

export * from './localStorageProductRepository';
export * from './localStorageOrderRepository';
