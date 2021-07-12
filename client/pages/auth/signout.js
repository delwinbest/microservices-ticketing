import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const Signout = (params) => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
    return () => {};
  }, []);

  return <div className="">Signing you out...</div>;
};

export default Signout;
