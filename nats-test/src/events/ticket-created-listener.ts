import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data:', data);
    console.log(data.title);
    msg.ack();
  }
}

export { TicketCreatedListener };
