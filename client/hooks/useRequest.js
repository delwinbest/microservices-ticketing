import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    const requestOptions = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, ...props }),
    };

    try {
      setErrors(null);
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw response;
      }
      const responseData = await response.json();
      // console.log(responseData);
      if (onSuccess) {
        onSuccess(responseData);
      }
      return responseData;
    } catch (err) {
      const { errors } = await err.json();
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops....</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
