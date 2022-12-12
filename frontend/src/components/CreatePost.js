import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewPost, isAuthenticated } from '../services/DBServices';
import UserContext from '../services/UserContext';

export default function Signup() {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [form, setForm] = useState({
    title: '',
    text: '',
    published: undefined,
    author: '',
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

    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    let published = e.nativeEvent.submitter.value === 'true'; // This is true or false depending on which button is clicked (draft or publish)
    let copyState = form;

    copyState = {
      ...copyState,
      published: published,
      author: currentUser._id,
    };
    setForm(copyState);

    const response = await createNewPost(copyState);
    response.url
      ? navigate(response.url)
      : console.log('Sorry, cannot create new post: ', response.message);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (response.user === false) {
        response.user = '';
        navigate('/login');
      }
      setCurrentUser(response.user);
    };

    checkLoggedIn();
  }, []);

  return (
    <div className='createNewPost'>
      <form onSubmit={submitForm}>
        <div>
          <label>Title</label>
          <input
            type='text'
            name='title'
            required
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Text</label>
          <input type='text' name='text' required onChange={handleFormChange} />
        </div>
        <button
          className='submitButton'
          type='submit'
          name='draft'
          value={false}
        >
          Save draft
        </button>
        <button
          className='submitButton'
          type='submit'
          name='publish'
          value={true}
        >
          Publish
        </button>
      </form>
    </div>
  );
}
