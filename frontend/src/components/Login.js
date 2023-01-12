import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import { loginUser, isAuthenticated } from '../services/DBServices';

import UserContext from '../services/UserContext';

function Login() {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  let navigate = useNavigate();

  const handleFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = form;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setForm(copyState);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const response = await loginUser(form);
    if (response.token) {
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      navigate('/');
    } else {
      console.log('Incorrect username and/or password.');
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (response.user === false) {
        response.user = '';
      }
      setCurrentUser(response.user);
      if (response.user) navigate('/');
    };

    checkLoggedIn();
  }, []);

  return (
    <div className='login'>
      <form onSubmit={submitForm}>
        <div>
          <label>Username</label>
          <input
            type='text'
            name='username'
            onChange={handleFormChange}
          ></input>
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            onChange={handleFormChange}
          ></input>
        </div>
        <button className='submitButton' type='submit'>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
