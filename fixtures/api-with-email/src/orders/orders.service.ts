import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './create-order.dto';
import { Order, OrdersStore } from './orders.store';

@Injectable()
export class OrdersService {
  constructor(
    private readonly store: OrdersStore,
    private readonly mail: MailService,
  ) {}

  async place(dto: CreateOrderDto): Promise<Order> {
    const id = randomUUID();
    const order = this.store.save({
      id,
      reference: `ORD-${id.slice(0, 8).toUpperCase()}`,
      ...dto,
      placedAt: new Date().toISOString(),
    });
    await this.mail.send('order-confirmation', order.customerEmail, 'Your order is confirmed', {
      customerName: order.customerName,
      reference: order.reference,
      quantity: order.quantity,
      sku: order.sku,
      orderUrl: `${process.env.APP_BASE_URL}/orders/${order.id}`,
    });
    return order;
  }

  get(id: string): Order {
    const order = this.store.find(id);
    if (!order) throw new NotFoundException({ code: 'order_not_found', message: 'Order not found' });
    return order;
  }
}
