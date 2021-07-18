import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/signin';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'Title', price: 20 })
    .expect(404);
});

it('returns a 401 if a user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Title', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own a ticket', async () => {
  const title = 'Title';
  let response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: title, price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({ title: 'Updated Title', price: 20 })
    .expect(401);

  response = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send();

  expect(response.body.title).toEqual(title);
});

it('returns a 400 if a user provides an invalid title or price', async () => {
  const cookie = signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Title', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Title', price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Title' })
    .expect(400);
});

it('returns updates the ticket provided valid inputs', async () => {
  const cookie = signin();
  let response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Title', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated Title', price: 100 })
    .expect(200);

  response = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(response.body.title).toEqual('Updated Title');
  expect(response.body.price).toEqual(100);
});
