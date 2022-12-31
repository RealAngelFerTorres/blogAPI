import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import Comment from './Comment';
import { useParams } from 'react-router-dom';
import UserContext from '../services/UserContext';
import {
  getSinglePost,
  createNewComment,
  isAuthenticated,
  deletePost,
  editPost,
} from '../services/DBServices';

function SinglePost() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [post, setPost] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    text: '',
    published: undefined,
  });
  const [commentForm, setCommentForm] = useState({
    text: '',
  });

  let navigate = useNavigate();
  let url = useParams();

  const submitDeletePost = async (e) => {
    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    const response = await deletePost(post.id);
    response.ok
      ? navigate('/')
      : console.log('There was a problem when trying to delete post');
  };

  const handlePostFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = postForm;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setPostForm(copyState);
  };

  const handleCheckboxChange = () => {
    postForm.published
      ? setPostForm({ ...postForm, published: false })
      : setPostForm({ ...postForm, published: true });
  };

  const handleCommentFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = commentForm;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setCommentForm(copyState);
  };

  const submitEditPost = async (e) => {
    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    let copyState = postForm;
    copyState = {
      ...copyState,
      id: post.id,
    };
    setPostForm(copyState);

    const response = await editPost(copyState);
    response.ok
      ? navigate(0)
      : console.log('There was a problem when trying to edit a post');
  };

  const submitComment = async (e) => {
    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    let copyState = commentForm;
    copyState = {
      ...copyState,
      author: currentUser._id,
      fatherPost: post.id,
    };
    setCommentForm(copyState);

    const response = await createNewComment(copyState);
    response
      ? setPost(response.data)
      : console.log('There was a problem when trying to create a new comment');
  };

  const toggleEditPost = () => {
    isEditing ? setIsEditing(false) : setIsEditing(true);
    setPostForm({
      title: post.title,
      text: post.text,
      published: post.published,
    });
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
          {isEditing ? (
            <input
              type='text'
              name='title'
              value={postForm.title}
              onChange={handlePostFormChange}
            ></input>
          ) : (
            <Link to={post.url}>{post.title}</Link>
          )}
        </div>
        <div className='post__author'>
          Made by <Link to={post.author.url}>{post.author.username}</Link>
        </div>
        <div className='post__createTime'>On: {post.createTime}</div>
        {post.editTime.includes('1970-01-01') ? null : (
          // Conditional rendering. 1970-01-01 is considered a null date
          <div className='post__editTime'>Edited {post.editTime}</div>
        )}
        <div className='post__karma'>Karma: {post.karma}</div>

        {currentUser.id === post.author.id ? (
          <div>
            <button className='deleteButton' onClick={submitDeletePost}>
              Delete post
            </button>
            {isEditing ? (
              <div>
                <input
                  type='checkbox'
                  id='published'
                  name='published'
                  onChange={handleCheckboxChange}
                  checked={postForm.published}
                />
                <label htmlFor='published'>Published</label>
                <button className='OKButton' onClick={submitEditPost}>
                  OK
                </button>
                <button className='cancelButton' onClick={toggleEditPost}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className='editButton' onClick={toggleEditPost}>
                Edit post
              </button>
            )}
          </div>
        ) : null}

        {isEditing ? (
          <input
            type='text'
            name='text'
            value={postForm.text}
            onChange={handlePostFormChange}
          ></input>
        ) : (
          <div className='post__text'>{post.text}</div>
        )}

        <div className='post__comments'>{post.commentQuantity} Comments</div>
        <br></br>
        <div className='commentSection'>
          <input
            name='text'
            type='text'
            placeholder='What do you think?'
            required
            onChange={handleCommentFormChange}
          ></input>
          <button className='comment__button' onClick={submitComment}>
            Comment post
          </button>
        </div>
        <br></br>
        <div className='post__comments'>
          {post.comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                comment={comment}
                postID={post.id}
                depth={0}
              ></Comment>
            );
          })}
        </div>
        <br></br>
      </div>
    );
  }
}

export default SinglePost;
