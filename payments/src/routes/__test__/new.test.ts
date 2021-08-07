import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { OrderStatus } from '@drbtickets/common';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

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

it('returns a 2014 with valid inputs', async () => {
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(order.userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 100 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  expect(stripeCharge).toBeDefined();
  //When using  Jest Mock:
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(stripeCharge!.source).toEqual('tok_visa');
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
