import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Ticket } from '../../models/ticket';

it('has a GET handler listening to /api/orders for post requests', async () => {
  const response = await request(app).get('/api/orders');
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).get('/api/orders').expect(401);
});

const buildTicket = async (title: string) => {
  const ticket = Ticket.build({
    id: 'fakeId',
    title: title,
    price: 20,
  });

  await ticket.save();
  return ticket;
};
it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticket01 = await buildTicket('ticket01');
  const ticket02 = await buildTicket('ticket02');
  const ticket03 = await buildTicket('ticket03');

  // Create one order as User01
  const user01 = signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', user01)
    .send({ ticketId: ticket01.id })
    .expect(201);

  // Create two orders as User02
  const user02 = signin();
  const { body: order01 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user02)
    .send({ ticketId: ticket02.id })
    .expect(201);
  const { body: order02 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user02)
    .send({ ticketId: ticket03.id })
    .expect(201);

  // Fetch all orders for User02
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user02)
    .expect(200);

  // Make sure we only get orders for User02
  // console.log(response.body);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order01.id);
  expect(response.body[1].id).toEqual(order02.id);
  expect(response.body[0].ticket.id).toEqual(ticket02.id);
  expect(response.body[1].ticket.id).toEqual(ticket03.id);
});
