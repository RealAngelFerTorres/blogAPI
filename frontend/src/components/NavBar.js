import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserLoggedIn } from '../services/DBServices';

function NavBar(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate(0);
  };

  useEffect(() => {
    async function checkSession() {
      const res = await checkUserLoggedIn();
      setIsLoggedIn(res);
    }
    checkSession();
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
        {isLoggedIn ? (
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
