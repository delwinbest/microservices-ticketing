import { OrderStatus, PaymentCreatedEvent } from '@drbtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { PaymentCreatedListener } from '../payment-created-listener';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // create instance of the listener
  const listener = new PaymentCreatedListener(natsWrapper.client);
  //Create and save and Ticket and Order
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'Ticket Title',
  });
  await ticket.save();
  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();
  // create a fake data event
  const data: PaymentCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: 'stripId',
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the order', async () => {
  const { listener, data, msg, order } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the order was updated
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('publishes an order updated event', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the ticket was created
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
  setup();
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure message was ack'd
  expect(msg.ack).toHaveBeenCalled();
});
