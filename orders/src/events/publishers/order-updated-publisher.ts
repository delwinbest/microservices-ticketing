import { OrderUpdatedEvent, Publisher, Subjects } from '@drbtickets/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
