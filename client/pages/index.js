import buildClient from '../api/build-client';

const LandingPage = (props) => {
  console.log(props);
  return <h1>Default landing page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  let responseData = {};
  let baseUrl = '';
  // Check if we are rendering server side or in browser
  if (typeof window === 'undefined') {
    // Server Side
    baseUrl = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  } else {
    // Browser
  }
  try {
    const response = await fetch(baseUrl + '/api/users/currentuser', {
      headers: req.headers,
    });
    if (!response.ok) {
      throw response;
    }
    responseData = await response.json();
  } catch (err) {
    console.log(err);
  }
  return responseData;
};

export default LandingPage;
