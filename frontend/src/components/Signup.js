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
    response.status === 'OK'
      ? navigate('/login')
      : response.errors.forEach((error) => {
          console.log(error.msg);
        });
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
    <div className='cardContainer register'>
      <div className='subtitle'>Registration</div>
      <form className='card--center' onSubmit={submitForm}>
        <div>
          <div className='cardFont--small'>Username:</div>
          <input
            className='cardFont--medium'
            type='text'
            name='username'
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <div className='cardFont--small'>Email:</div>
          <input
            className='cardFont--medium'
            type='email'
            name='email'
            maxLength={50}
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <div className='cardFont--small'>Password:</div>
          <input
            className='cardFont--medium'
            type='password'
            name='password'
            maxLength={100}
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <div className='cardFont--small'>Confirm password:</div>
          <input
            className='cardFont--medium'
            type='password'
            name='confirmPassword'
            maxLength={100}
            required
            onChange={handleFormChange}
          />
        </div>
        <div className='bottomOption'>
          <button className='button cardButton' type='submit'>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
