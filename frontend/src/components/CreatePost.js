import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { createNewPost, isAuthenticated } from '../services/DBServices';
import UserContext from '../services/UserContext';
import TextareaAutosize from 'react-textarea-autosize';
import Spinner from './Spinner';
import Error from './Error';
import ErrorPopup from './ErrorPopup';

export default function Signup() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState([]);

  const [form, setForm] = useState({
    title: '',
    text: '',
    published: undefined,
    author: '',
  });

  let navigate = useNavigate();

  const editorRef = useRef(null);

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

  const handleEditorChange = (e) => {
    let input = editorRef.current.getContent();
    let copyState = form;

    copyState = {
      ...copyState,
      text: input,
    };
    setForm(copyState);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // This is true or false depending on which button is clicked (save draft or publish).
    let published = e.target.value === 'true';
    let copyState = form;

    copyState = {
      ...copyState,
      published: published,
      author: currentUser._id,
    };
    setForm(copyState);

    const response = await createNewPost(copyState);
    if (response.url) {
      // Creation is OK. Upvote the post
      let copy = currentUser;
      copy = {
        ...copy,
        votedPosts: copy.votedPosts.concat({
          postID: response.newID,
          voteType: 1,
        }),
      };
      setCurrentUser(copy);
      navigate(response.url);
      return;
    }
    if (response.user === false) {
      navigate('/login');
      return;
    }
    if (response.errors) {
      setErrors(response.errors);
      setShowErrors(true);
    }
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
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  if (isLoading) {
    return <Spinner></Spinner>;
  } else {
    if (currentUser === '') {
      return (
        <Error
          icon='login'
          error='You need to be logged-in to see this page.'
        ></Error>
      );
    } else if (currentUser) {
      return (
        <div className='createNewPost'>
          <div className='subtitle'>New post</div>

          <TextareaAutosize
            className='edit__title edit'
            type='text'
            name='title'
            placeholder='Title'
            maxLength={120}
            required
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onChange={handleFormChange}
          />
          <div className='post__text creating'>
            <Editor
              apiKey='your-api-key'
              onInit={(evt, editor) => (editorRef.current = editor)}
              name='text'
              value={form.text}
              maxLength={5000}
              onEditorChange={handleEditorChange}
              init={{
                placeholder: 'Text body',
                menubar: false,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:22px;text-align: justify;line-height:36px;} .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                        font-style: italic;
                        }}`,
              }}
            />
          </div>
          <div className='bottomOption'>
            <div
              className='submitButton button--grey'
              name='draft'
              value={false}
              onClick={submitForm}
            >
              Save draft
            </div>
            <button
              className='submitButton button'
              name='publish'
              value={true}
              onClick={submitForm}
            >
              Publish
            </button>
          </div>
          <ErrorPopup
            errors={errors}
            showErrors={showErrors}
            stateChanger={setShowErrors}
          ></ErrorPopup>
        </div>
      );
    }
  }
}
