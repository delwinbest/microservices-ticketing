import { Ticket } from '../ticket';
import { Order } from '../order';
import mongoose from 'mongoose';
import { OrderStatus } from '@drbtickets/common';

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 5,
  });
  // Save the ticket to the DB
  await ticket.save();
  // Create and Order for this ticket
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket.id,
  });
  await order.save();
  // Fetch the order twice
  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);
  // make to seperate changes to the ticket
  firstInstance!.set({ status: OrderStatus.Cancelled });
  secondInstance!.set({ status: OrderStatus.AwaitingPayment });
  // save the first ticket
  await firstInstance!.save();
  // save the second fetched ticket with outdated version number and get an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Test failed');
});

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 5,
  });
  // Save the ticket to the DB
  await ticket.save();
  // Create and Order for this ticket
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket.id,
  });
  await order.save();
  expect(order.version).toEqual(0);
  await order.save();
  expect(order.version).toEqual(1);
  await order.save();
  expect(order.version).toEqual(2);
  await order.save();
  expect(order.version).toEqual(3);
});
