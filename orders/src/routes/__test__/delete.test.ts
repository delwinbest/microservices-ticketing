import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { signin } from '../../test/signin';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';

it('order only be accessed if the user is signed in', async () => {
  const fakeId = mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${fakeId}`).send().expect(401);
});

it('returns an error if a user tries to acces another user order', async () => {
  // Create ticket
  const ticket = Ticket.build({ title: 'Ticket', price: 20 });
  await ticket.save();
  // Make request to build order with ticket
  const user01 = signin();
  const user02 = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user01)
    .send({ ticketId: ticket.id })
    .expect(201);
  //Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user02)
    .expect(401);
});

it('marks an order as cancelled', async () => {
  // Create a ticket
  // Create ticket
  const ticket = Ticket.build({ title: 'Ticket', price: 20 });
  await ticket.save();
  // Make request to build order with ticket
  const user = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Cancel the Order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  // Validate order state
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes an order cancelled event', async () => {
  // Create a ticket
  // Create ticket
  const ticket = Ticket.build({ title: 'Ticket', price: 20 });
  await ticket.save();
  // Make request to build order with ticket
  const user = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Cancel the Order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  // Validate order state
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
