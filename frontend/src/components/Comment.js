import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import {
  getSinglePost,
  createNewReply,
  isAuthenticated,
} from '../services/DBServices';
import { useParams } from 'react-router-dom';
import UserContext from '../services/UserContext';

function Comment(props) {
  const { comment } = props;

  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [showReply, setShowReply] = useState(false);

  const [form, setForm] = useState({
    text: '',
  });

  let navigate = useNavigate();

  const toggleReply = () =>
    showReply ? setShowReply(false) : setShowReply(true);

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

  const submitReply = async (e) => {
    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    let copyState = form;
    copyState = {
      ...copyState,
      author: currentUser._id,
      fatherPost: comment.id,
    };
    setForm(copyState);

    const response = await createNewReply(copyState);
    response.ok
      ? navigate(0)
      : console.log('There was a problem when trying to create a new comment');
  };

  return (
    <div className='comment' id={comment.id}>
      <div className='comment__author'>
        <Link to={comment.author.url}>{comment.author.username}</Link>
      </div>
      <div className='comment__createTime'>On: {comment.createTime}</div>
      {comment.editTime.includes('1970-01-01') ? null : (
        // Conditional rendering. 1970-01-01 is considered a null date
        <div className='comment__editTime'>Edited {comment.editTime}</div>
      )}
      <div className='comment__title'>Karma: {comment.karma}</div>
      <div className='comment__text'>{comment.text}</div>
      <div className='comment__reply' onClick={toggleReply}>
        Reply
      </div>
      {showReply ? (
        <div className='replySection'>
          <input
            name='text'
            type='text'
            placeholder='What do you think?'
            required
            onChange={handleFormChange}
          ></input>
          <div>
            <button className='cancel__button' onClick={toggleReply}>
              Cancel
            </button>
            <button className='comment__button' onClick={submitReply}>
              Reply
            </button>
          </div>
        </div>
      ) : null}

      <br></br>
      {comment.comments.length > 0
        ? comment.comments.map((comment, index) => {
            return <Comment key={index} comment={comment}></Comment>;
          })
        : null}
    </div>
  );
}

export default Comment;
