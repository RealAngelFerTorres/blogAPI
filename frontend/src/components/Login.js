import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, isAuthenticated } from '../services/DBServices';
import UserContext from '../services/UserContext';
import Spinner from './Spinner';
import ErrorMessages from './ErrorMessages';

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState([]);

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
      // This is the same format of errors array when trying to sign up
      setErrors([{ msg: response.message }]);
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
      <div className='cardContainer login'>
        <div className='subtitle'>Login</div>
        <form className='card--center' onSubmit={submitForm}>
          <div>
            <div className='cardFont--small'>Username:</div>
            <input
              className='cardFont--medium'
              type='text'
              name='username'
              required
              onChange={handleFormChange}
            ></input>
          </div>
          <div>
            <div className='cardFont--small'>Password:</div>
            <input
              className='cardFont--medium'
              type='password'
              name='password'
              required
              onChange={handleFormChange}
            ></input>
          </div>
          <div className='bottomOption'>
            <button className='button cardButton' type='submit'>
              Login
            </button>
          </div>
        </form>
        {showErrors ? (
          <div className='errorPopupContainer'>
            <div className='upper' title='Close' onClick={closePopup}>
              <button className='material-icons icon'>close</button>
            </div>
            <ErrorMessages errors={errors}></ErrorMessages>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Login;
