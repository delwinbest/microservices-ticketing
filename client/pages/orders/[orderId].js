import useRequest from '../../hooks/useRequest';
import { useState, useEffect } from 'react';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const STRIPE_PUB_KEY = process.env.STRIPE_PUB_KEY;
  console.log(STRIPE_PUB_KEY);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
      token: 'tok_visa',
    },
    onSuccess: (payment) => console.log(payment),
  });

  // TODO implement STRIPE PAY BUTTON

  if (timeLeft < 0) {
    return (
      <div className="">
        Order Expired
        <br />
        <button className="btn btn-primary" onClick={() => Router.push('/')}>
          Return to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="">
      You have {Math.floor(timeLeft / 60)} minutes and{' '}
      {timeLeft - Math.floor(timeLeft / 60) * 60} seconds remaining to purchase
      this ticket
      {errors}
      <br />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;