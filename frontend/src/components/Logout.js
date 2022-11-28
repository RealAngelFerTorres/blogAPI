import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import { loginUser, checkUserLoggedIn } from '../services/DBServices';

function Logout() {
  let navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/');
    //navigate(0);
  }, []);

  return <div className='logout'>{`See you! :)`}</div>;
}

export default Logout;
