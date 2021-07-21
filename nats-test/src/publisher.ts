import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: '456',
    title: 'Concert',
    price: 33,
  });

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'Title',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, (err, guid) => {
  //   if (err) {
  //     console.log('publish failed: ' + err);
  //   } else {
  //     console.log('published message with guid: ' + guid);
  //   }
  // });
});
