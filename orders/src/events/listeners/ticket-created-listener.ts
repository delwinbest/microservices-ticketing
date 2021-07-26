import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@drbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const existingTicket = await Ticket.findById(data.id);
    if (existingTicket) {
      // throw new Error(`Ticket Exists: ${existingTicket}`);
      // Ticket Exists, attempt recovery
      // TODO: Figure out why ticket exists (possible failure)
      console.log('WARNING, TICKET EXISTS, attempting recovery...');
      if (existingTicket.version !== 0) {
        throw new Error('Could not recover, ticket version !== 0');
      }
    } else {
      const ticket = Ticket.build({ id, title, price });
      await ticket.save();
    }
    msg.ack();
  }
}
