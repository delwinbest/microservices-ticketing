import request from 'supertest';
import { app } from '../../app';

it('returns a 400 on signin with invalid user', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'fake@test.com', password: 'password' })
    .expect(400);
});

it('returns a 400 on on signin with incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'incorrectpassword' })
    .expect(400);
});

it('returns a 200 on on signin with correct credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
});

it('sets a cookie after succesful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
