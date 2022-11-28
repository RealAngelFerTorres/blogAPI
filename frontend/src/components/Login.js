import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import { loginUser, checkUserLoggedIn } from '../services/DBServices';

function Login() {
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
    const res = await loginUser(form);
    if (res.token) {
      localStorage.setItem('token', res.token);
      navigate('/'); // TODING check for promises not completed. Warning: send two navigate may not let promises to complete
      navigate(0, { data: res.user });
    } else {
      console.log(res.message);
    }
  };
  /*
useEffect(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

*/

  useEffect(() => {
    checkUserLoggedIn();
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
