import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  let navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, []);

  return <div className='logout'>{`See you! :)`}</div>;
}

export default Logout;
