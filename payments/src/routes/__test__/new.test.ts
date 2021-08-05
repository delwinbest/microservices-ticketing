import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@drbtickets/common';

it('returns a 404 when order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({ token: 'TOKEN', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({ token: 'TOKEN', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(order.userId))
    .send({ token: 'TOKEN', orderId: order.id })
    .expect(400);
});
