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
    setCurrentUser('');
    navigate(0);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      response === undefined
        ? setCurrentUser('')
        : setCurrentUser(response.user);
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
        {currentUser ? (
          <Link to='/post/create' className='option'>
            Create new post
          </Link>
        ) : null}
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
        <Link to='/signup' className='option'>
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
