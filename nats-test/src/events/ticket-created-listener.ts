import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payents-service';
  onMessage(data: any, msg: Message) {
    console.log('Event Data:', data);
    msg.ack();
  }
}

export { TicketCreatedListener };
