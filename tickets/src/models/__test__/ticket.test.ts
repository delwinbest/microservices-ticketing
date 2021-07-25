import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Creat a ticket
  const ticket = Ticket.build({
    title: 'Title',
    price: 5,
    userId: 'fakeId',
  });

  // Save the ticket to the DB
  await ticket.save();
  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make to seperate changes to the ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first ticket
  await firstInstance!.save();
  // save the second fetched ticket with outdated version number and get an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Test failed');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 10,
    userId: 'fakeId',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
  await ticket.save();
  expect(ticket.version).toEqual(3);
});
