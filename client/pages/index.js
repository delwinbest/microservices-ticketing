import buildClient from '../api/build-client';

const LandingPage = (props) => {
  console.log(props);
  return <h1>Default landing page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
