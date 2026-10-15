import { OrdersService } from '../src/orders/orders.service';
import { OrdersStore } from '../src/orders/orders.store';

describe('OrdersService', () => {
  const mail = { send: jest.fn().mockResolvedValue(undefined) };
  const service = new OrdersService(new OrdersStore(), mail as never);

  it('stores the order and sends the confirmation to the customer', async () => {
    const order = await service.place({
      customerEmail: 'ada@example.com',
      customerName: 'Ada',
      sku: 'MUG-01',
      quantity: 2,
    });
    expect(service.get(order.id).sku).toBe('MUG-01');
    expect(mail.send).toHaveBeenCalledWith(
      'order-confirmation',
      'ada@example.com',
      'Your order is confirmed',
      expect.objectContaining({ reference: order.reference }),
    );
  });

  it('reports an unknown order as order_not_found', () => {
    expect(() => service.get('missing')).toThrow('Order not found');
  });
});
