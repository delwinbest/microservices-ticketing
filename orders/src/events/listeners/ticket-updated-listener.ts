import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@drbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, version } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      // throw new Error('Ticket ID orq version not found');
      console.log('Ticket does not exist, aborting');
    } else {
      ticket.set({ title, price, version });
      await ticket.save();
      msg.ack();
    }
  }
}
