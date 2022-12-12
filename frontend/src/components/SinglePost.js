import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import Comment from './Comment';
import {
  getSinglePost,
  createNewComment,
  isAuthenticated,
} from '../services/DBServices';
import { useParams } from 'react-router-dom';
import UserContext from '../services/UserContext';

function SinglePost() {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [post, setPost] = useState();

  const [form, setForm] = useState({
    text: '',
  });
  let navigate = useNavigate();

  let url = useParams();
  const deletePost = () => {};

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

  const submitComment = async (e) => {
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
      fatherPost: post.id,
    };
    setForm(copyState);

    const response = await createNewComment(copyState);
    response
      ? setPost(response.data)
      : console.log('There was a problem when trying to create a new comment');
  };

  useEffect(() => {
    getSinglePost(url.id).then((e) => {
      setPost(e.data);
    });
  }, []);

  if (!post) {
    return <div>Loading post...</div>;
  } else {
    return (
      <div className='post' id={post.id} title={post.title}>
        <div className='post__title'>
          <Link to={post.url}>{post.title}</Link>
        </div>
        <div className='post__author'>
          Made by <Link to={post.author.url}>{post.author.username}</Link>
        </div>
        <div className='post__createTime'>On: {post.createTime}</div>
        {post.editTime.includes('1970-01-01') ? null : (
          // Conditional rendering. 1970-01-01 is considered a null date
          <div className='post__editTime'>Edited {post.editTime}</div>
        )}
        <div className='post__title'>Karma: {post.karma}</div>
        <button className='deleteButton' onClick={deletePost}>
          Delete post
        </button>

        <div className='post__text'>{post.text}</div>

        <div className='post__comments'>{post.comments.length} Comments</div>
        <br></br>
        <div className='commentSection'>
          <input
            name='text'
            type='text'
            placeholder='What do you think?'
            required
            onChange={handleFormChange}
          ></input>
          <button className='comment__button' onClick={submitComment}>
            Comment post
          </button>
        </div>
        <br></br>
        <div className='post__comments'>
          {post.comments.map((comment, index) => {
            return <Comment key={index} comment={comment}></Comment>;
          })}
        </div>
        <br></br>
      </div>
    );
  }
}

export default SinglePost;
