import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@drbtickets/common';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async (config: { title: string }) => {
  const { title } = config;
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: title,
    price: 99,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup({
    title: 'sets the userId of the ticket',
  });

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup({
    title: 'acks the message',
  });
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup({
    title: 'publishes a ticket updated event',
  });
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
