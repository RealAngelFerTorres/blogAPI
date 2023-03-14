import React, { useEffect, useContext } from 'react';
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
    navigate('/login');
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (!response) {
        setCurrentUser('');
        return;
      }
      if (response.user === false) {
        response.user = '';
      }
      setCurrentUser(response.user);
    };

    checkLoggedIn();
  }, []);

  return (
    <div className='navBar'>
      <div className='mainTitle' onClick={goToHome}>
        THE PUBLIC BLOG
      </div>
      <div className='navigationOptions'>
        {currentUser ? (
          <Link to='/post/create' className='option' id='createButtonContainer'>
            <div id='createButton'>Create new post</div>
          </Link>
        ) : null}
        <Link to='/' className='option'>
          <div>Home</div>
        </Link>
        <Link to='/about' className='option'>
          <div>About</div>
        </Link>
        {currentUser ? null : (
          <Link to='/signup' className='option'>
            <div>Register</div>
          </Link>
        )}
        {currentUser ? (
          <Link to={currentUser.url} className='option'>
            <div>Profile</div>
          </Link>
        ) : null}
        {currentUser ? (
          <Link to='/logout' onClick={logout} className='option'>
            <div>Logout</div>
          </Link>
        ) : (
          <Link to='/login' className='option'>
            <div>Login</div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
