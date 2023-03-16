import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser, isAuthenticated } from '../services/DBServices';
import UserContext from '../services/UserContext';
import Spinner from './Spinner';
import ErrorPopup from './ErrorPopup';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

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
    if (response.status === 'OK') navigate('/login');
    else {
      setErrors(response.errors);
      setShowErrors(true);
    }
  };

  const closePopup = (e) => {
    setShowErrors(false);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (!response) {
        setCurrentUser('');
        navigate('/error');
        return;
      }
      if (response.user === false) {
        response.user = '';
      }
      setCurrentUser(response.user);
      if (response.user) navigate('/');
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  if (isLoading) {
    return <Spinner></Spinner>;
  } else {
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
        <ErrorPopup
          errors={errors}
          showErrors={showErrors}
          stateChanger={setShowErrors}
        ></ErrorPopup>
      </div>
    );
  }
}
