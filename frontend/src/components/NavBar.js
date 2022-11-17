import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar(props) {
  let navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className='navBar'>
      <div className='mainTitle' onClick={goToHome}>
        THE BLOG API APP
      </div>
      <div className='navigationOptions'>
        <Link to='/' className='option'>
          <div>HOME</div>
        </Link>
        <Link to='/about' className='option'>
          <div>ABOUT</div>
        </Link>
      </div>
      <div className='navigationOptions--rightSide'>
        <Link to='/login' className='option'>
          <div>Login</div>
        </Link>
        <Link to='/register' className='option'>
          <div>Register</div>
        </Link>
      </div>
      <Link to='/admin' className='option'>
        <div>Admin</div>
      </Link>
    </div>
  );
}

export default NavBar;
