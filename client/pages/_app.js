import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="">
      <h1>Header: {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

// Custom App component has DIFFERENT getInitialProps
// context === {Component, ctx: {req, res}} NOT context === {req, res}
// When invoking getInitialProps on AppComponent, it disables gIP in other components.
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  //This call getInitialProps for sub pages
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  return { pageProps, ...data };
};

export default AppComponent;
