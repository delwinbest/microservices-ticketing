const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const runTest = async () => {
  let body = {
    email: 'test@test.com',
    password: 'password',
  };
  let cookie = '';
  try {
    let response = await fetch('https://localhost/api/users/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      agent: httpsAgent,
    });
    if (response.status === 400) {
      response = await fetch('https://localhost/api/users/signup', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        agent: httpsAgent,
      });
    }
    cookie = await response.headers.raw()['set-cookie'];

    // Create Ticket
    response = await fetch('https://localhost/api/tickets', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookie,
      },
      Authorization: cookie,
      credentials: 'include',
      body: JSON.stringify({
        title: 'Title',
        price: 33,
      }),
      agent: httpsAgent,
    });
    let responseJSON = await response.json();

    const { id } = responseJSON;

    // Update Ticket 01
    response = await fetch(`https://localhost/api/tickets/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookie,
      },
      Authorization: cookie,
      credentials: 'include',
      body: JSON.stringify({
        title: 'Updated Title',
        price: 10,
      }),
      agent: httpsAgent,
    });
    // Update Ticket 02
    response = await fetch(`https://localhost/api/tickets/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookie,
      },
      Authorization: cookie,
      credentials: 'include',
      body: JSON.stringify({
        title: 'Updated Title',
        price: 15,
      }),
      agent: httpsAgent,
    });
    // Order Ticket 01
    response = await fetch(`https://localhost/api/orders`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookie,
      },
      Authorization: cookie,
      credentials: 'include',
      body: JSON.stringify({
        ticketId: id,
      }),
      agent: httpsAgent,
    });
  } catch (err) {
    console.log(err);
  }
};

for (let i = 0; i < 50; i++) {
  runTest();
}
