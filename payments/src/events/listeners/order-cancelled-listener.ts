import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@drbtickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Cancelled, version: data.version });
    await order.save();
    msg.ack();
  }
}
