import { OrderCancelledListner } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@drbtickets/common';
import { Message } from 'node-nats-streaming';

const setup = async (config: { title: string }) => {
  const { title } = config;
  // Create an instance of the listener
  const listener = new OrderCancelledListner(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: title,
    price: 99,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId: orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it('publishes an event', async () => {
  const { msg, data, ticket, orderId, listener } = await setup({
    title: 'publishes an event',
  });

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup({
    title: 'acks the message',
  });

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('updates the ticket, publishes an event and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup({
    title: 'updates the ticket, publishes an event and acks the message',
  });

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
