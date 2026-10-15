import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  place(@Body() dto: CreateOrderDto) {
    return this.orders.place(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.get(id);
  }
}
