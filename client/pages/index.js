import Link from 'next/link';
import Router from 'next/router';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="">
      <h1>
        Tickets
        <button
          className="btn btn-success"
          onClick={() => Router.push('/tickets/new')}
        >
          Create New
        </button>
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// context === {req, res}
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');
  // return data;
  const { data } = await client.get('/api/tickets');
  return { tickets: data, currentUser };
};

export default LandingPage;
