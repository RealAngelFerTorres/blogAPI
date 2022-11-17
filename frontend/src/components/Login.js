import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../services/DBServices';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

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
    const res = await loginUser(form);
    localStorage.setItem('token', res.token);
  };

  useEffect(() => {
    fetch('/admin', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      //.then((res) => res.json())
      .then((res) => {
        console.log(res.status);
        res.status === 200
          ? console.log('YES, logged in :)')
          : console.log('Not logged in..');
      });
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
