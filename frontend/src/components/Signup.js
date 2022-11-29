import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { signupUser, isAuthenticated } from '../services/DBServices';

import UserContext from '../services/UserContext';

export default function Signup() {
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
    const response = await signupUser(form);
    response.ok
      ? navigate('/login')
      : console.log('Sorry, cannot sign up', response.message);
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
    <div className='register'>
      <form onSubmit={submitForm}>
        <div>
          <label>Username</label>
          <input
            type='text'
            name='username'
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type='email'
            name='email'
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Confirm password:</label>
          <input
            type='password'
            name='confirmPassword'
            required
            onChange={handleFormChange}
          />
        </div>
        <button className='submitButton' type='submit'>
          Register
        </button>
      </form>
    </div>
  );
}
