import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import Comment from './Comment';
import { useParams } from 'react-router-dom';
import UserContext from '../services/UserContext';
import {
  getSinglePost,
  createNewComment,
  deletePost,
  editPost,
  sendVote,
} from '../services/DBServices';

function SinglePost() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [post, setPost] = useState();
  const [updatedKarma, setUpdatedKarma] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isTogglingVote, setIsTogglingVote] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownvote, setIsDownvote] = useState(false);
  const [isUpvote, setIsUpvote] = useState(false);
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

  const manageResponse = (response) => {
    if (response.user === false) {
      navigate('/login');
      return;
    }
    if (response.errors) {
      response.errors.forEach((error) => {
        console.log(error.msg);
      });
    }
  };

  const submitDeletePost = async (e) => {
    const response = await deletePost(post.id);
    if (response.url) {
      navigate(response.url);
      return;
    }
    manageResponse(response);
  };

  const submitEditPost = async (e) => {
    let copyState = postForm;
    copyState = {
      ...copyState,
      id: post.id,
    };
    setPostForm(copyState);

    const response = await editPost(copyState);
    if (response.status === 'OK') {
      let copyState = post;
      copyState = {
        ...copyState,
        title: postForm.title,
        text: postForm.text,
      };
      setPost(copyState);
      setIsEditing(false);
      return;
    }
    manageResponse(response);
  };

  const submitComment = async (e) => {
    let copyState = commentForm;
    copyState = {
      ...copyState,
      author: currentUser._id,
      fatherPost: post.id,
    };
    setCommentForm(copyState);

    const response = await createNewComment(copyState);
    if (response.status === 'OK') {
      let copyArray = post.comments;
      copyArray.unshift(response.data);

      let copyState = post;
      copyState = {
        ...copyState,
        comments: copyArray,
      };
      setPost(copyState);
      return;
    }
    manageResponse(response);
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

  const toggleEditPost = () => {
    isEditing ? setIsEditing(false) : setIsEditing(true);
    setPostForm({
      title: post.title,
      text: post.text,
      published: post.published,
    });
  };

  const toggleDeleteModal = (e) => {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  };

  const manageVote = async (e) => {
    if (isTogglingVote) {
      return;
    }
    setIsTogglingVote(true);

    const form = {
      postID: post.id,
      voteType: e.target.value,
      userID: currentUser.id,
    };
    const response = await sendVote(form);
    if (response.status !== 'OK') manageResponse(response);

    toggleVote(e.target.value);
    setTimeout(() => {
      setIsTogglingVote(false);
    }, 500);
  };

  const toggleVote = (voteType) => {
    let karmaUpdater = 0;
    if (voteType === '1') {
      if (isUpvote) {
        setIsUpvote(false);
        setUpdatedKarma(updatedKarma - 1);
        return;
      }
      if (isDownvote) {
        setIsDownvote(false);
        karmaUpdater += 1;
      }
      setIsUpvote(true);
      karmaUpdater += 1;
      setUpdatedKarma(updatedKarma + karmaUpdater);
    } else {
      if (isDownvote) {
        setIsDownvote(false);
        setUpdatedKarma(updatedKarma + 1);
        return;
      }
      if (isUpvote) {
        setIsUpvote(false);
        karmaUpdater -= 1;
      }
      setIsDownvote(true);
      karmaUpdater -= 1;
      setUpdatedKarma(updatedKarma + karmaUpdater);
    }
  };

  useEffect(() => {
    if (currentUser && post) {
      const foundVote = currentUser.votedPosts.find(
        (e) => e.postID.valueOf() === post.id
      );
      if (foundVote) {
        foundVote.voteType === 1 ? setIsUpvote(true) : setIsDownvote(true);
      }
    }
  }, [currentUser, post]);

  useEffect(() => {
    getSinglePost(url.id).then((e) => {
      setPost(e.data);
      setUpdatedKarma(e.data.karma);
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
          // Conditional rendering. 1970-01-01 is considered a null date.
          <div className='post__editTime'>Edited {post.editTime}</div>
        )}
        <div className='post__karma'>Karma: {updatedKarma}</div>
        <div>
          <button
            className={isUpvote ? 'voted' : ''}
            onClick={manageVote}
            value={1}
            disabled={isTogglingVote}
          >
            Upvote
          </button>
          <button
            className={isDownvote ? 'voted' : ''}
            onClick={manageVote}
            value={-1}
            disabled={isTogglingVote}
          >
            Downvote
          </button>
        </div>
        {currentUser.id === post.author.id ? (
          <div>
            <button className='deleteButton' onClick={toggleDeleteModal}>
              Delete post
            </button>

            <div
              className={`modalBackground ${isModalOpen ? 'show' : ''}`}
              onClick={toggleDeleteModal}
            >
              <div
                className='modalContent'
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={toggleDeleteModal}>X</button>
                <div>Are you sure you want to delete this post?</div>
                <button onClick={submitDeletePost}>Delete post</button>
                <button onClick={toggleDeleteModal}>Cancel</button>
              </div>
            </div>

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
            minLength={1}
            maxLength={500}
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
