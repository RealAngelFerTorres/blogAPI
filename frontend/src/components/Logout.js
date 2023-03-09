import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  let navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/login'); //TODING ACA
  }, []);

  return <div className='logout'>{`See you! :)`}</div>;
}

export default Logout;
