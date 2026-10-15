import { Injectable } from '@nestjs/common';

export interface Order {
  id: string;
  reference: string;
  customerEmail: string;
  customerName: string;
  sku: string;
  quantity: number;
  placedAt: string;
}

@Injectable()
export class OrdersStore {
  private readonly orders = new Map<string, Order>();

  save(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  find(id: string): Order | undefined {
    return this.orders.get(id);
  }
}
