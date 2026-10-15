import { Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersStore } from './orders/orders.store';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersStore, MailService],
})
export class AppModule {}
