import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //We are on the server
    return axios.create({
      baseURL: 'http://ticketing.delwinbest.com',
      headers: req.headers,
    });
  } else {
    // We are in the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
