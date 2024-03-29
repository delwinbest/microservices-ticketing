import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //We are on the server
    return axios.create({
      // baseURL: 'http://ticketing.delwinbest.com', // Prod Cluster
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
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
