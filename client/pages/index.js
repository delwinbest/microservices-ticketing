// import buildClient from '../api/build-client';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div className="">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
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
