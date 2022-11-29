import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/DBServices';

import UserContext from '../services/UserContext';

function NavBar(props) {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  let navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setCurrentUser({}); // TODO: apostrofes o llaves?
    navigate(0);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let cUser = await isAuthenticated();
      if (cUser === null) {
        cUser = '';
      }

      setCurrentUser(cUser);
    };

    checkLoggedIn();
  }, []);

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
        {currentUser ? (
          <Link to='/logout' onClick={logout} className='option'>
            Logout
          </Link>
        ) : (
          <Link to='/login' className='option'>
            Login
          </Link>
        )}
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
