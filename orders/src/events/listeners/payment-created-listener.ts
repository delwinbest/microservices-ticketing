import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@drbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderUpdatedPublisher } from '../publishers/order-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    console.log(order.expiresAt);
    console.log(new Date(order.expiresAt).toISOString());
    await new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: new Date(order.expiresAt).toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    msg.ack();
  }
}
