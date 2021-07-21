import nats from 'node-nats-streaming';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'Title',
    price: 20,
  });

  stan.publish('ticket:created', data, (err, guid) => {
    if (err) {
      console.log('publish failed: ' + err);
    } else {
      console.log('published message with guid: ' + guid);
    }
  });
});
