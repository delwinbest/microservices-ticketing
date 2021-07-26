import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/signin';

it('fetches the order', async () => {
  // Create ticket
  const ticket = Ticket.build({ id: 'fakeId', title: 'Ticket', price: 20 });
  await ticket.save();
  // Make request to build order with ticket
  const user = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if a user tries to acces another user order', async () => {
  // Create ticket
  const ticket = Ticket.build({ id: 'fakeId', title: 'Ticket', price: 20 });
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
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user02)
    .expect(401);
});
