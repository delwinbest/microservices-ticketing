import { Listener, Subjects, OrderCreatedEvent } from '@drbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const existingOrder = await Order.findOne({
      id: data.id,
      version: data.version,
    });
    if (existingOrder) {
      console.log('Order already exists, ignoring.');
    } else {
      const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        userId: data.userId,
        version: data.version,
      });
      await order.save();
    }
    msg.ack();
  }
}
