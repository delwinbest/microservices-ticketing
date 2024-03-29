import { natsWrapper } from './nats-wrapper';
import { app } from './app';
import { OrderCreactedListener } from './events/listeners/order-created-listener';

const start = async () => {
  console.log('App starting...');
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not defined');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });

    new OrderCreactedListener(natsWrapper.client).listen();
  } catch (err) {
    throw new Error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
