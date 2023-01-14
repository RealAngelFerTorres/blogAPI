import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import {
  deleteComment,
  createNewReply,
  isAuthenticated,
  editComment,
} from '../services/DBServices';
import { useParams } from 'react-router-dom';
import UserContext from '../services/UserContext';

function Comment(props) {
  const { comment, postID, depth } = props;
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyForm, setReplyForm] = useState({
    text: '',
  });
  const [commentForm, setCommentForm] = useState({
    text: '',
  });

  let navigate = useNavigate();

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

  const toggleReply = () =>
    showReply ? setShowReply(false) : setShowReply(true);

  const toggleCommentEdit = () => {
    isEditing ? setIsEditing(false) : setIsEditing(true);
    setCommentForm({
      text: comment.text,
    });
  };

  const handleReplyFormChange = (e) => {
    let input = e.target.value;
    let key = e.target.name;
    let copyState = replyForm;

    copyState = {
      ...copyState,
      [key]: input,
    };
    setReplyForm(copyState);
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

  const submitReply = async (e) => {
    let copyState = replyForm;
    copyState = {
      ...copyState,
      author: currentUser._id,
      fatherPost: postID,
      fatherComment: comment.id,
    };
    setReplyForm(copyState);

    const response = await createNewReply(copyState);
    response.status === 'OK' ? navigate(0) : manageResponse(response);
  };

  const submitEditComment = async (e) => {
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
      id: comment.id,
    };
    setCommentForm(copyState);

    const response = await editComment(copyState);
    response.ok
      ? navigate(0)
      : console.log('There was a problem when trying to edit a comment');
  };

  const submitDeleteComment = async (e) => {
    let responseAuth = await isAuthenticated();
    if (responseAuth.user === false) {
      responseAuth.user = '';
      navigate('/login');
      return;
    }
    await setCurrentUser(responseAuth.user);

    const response = await deleteComment(comment.id);
    response.ok
      ? navigate(0)
      : console.log(
          'There was a problem when trying to create a delete comment'
        );
  };

  return (
    <div>
      {comment.isDeleted ? (
        <div className={'comment depth' + depth}>
          <i>Deleted comment</i>
        </div>
      ) : (
        <div className={'comment depth' + depth} id={comment.id}>
          <div className='comment__author'>
            <Link to={'../' + comment.author.url}>
              {comment.author.username}
            </Link>
          </div>
          <div className='comment__createTime'>On: {comment.createTime}</div>
          {comment.editTime.includes('1970-01-01') ? null : (
            // Conditional rendering. 1970-01-01 is considered a null date
            <div className='comment__editTime'>Edited {comment.editTime}</div>
          )}
          <div className='comment__title'>Karma: {comment.karma}</div>
          {isEditing ? (
            <input
              type='text'
              name='text'
              value={commentForm.text}
              maxLength={100}
              required
              onChange={handleCommentFormChange}
            ></input>
          ) : (
            <div className='comment__text'>{comment.text}</div>
          )}

          {depth > 2 ? null : (
            <div>
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
                    onChange={handleReplyFormChange}
                  />
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
            </div>
          )}
          {currentUser.id === comment.author.id ? (
            <div>
              <div className='comment__delete' onClick={submitDeleteComment}>
                Delete
              </div>
              {isEditing ? (
                <div>
                  <button className='OKButton' onClick={submitEditComment}>
                    OK
                  </button>
                  <button className='cancelButton' onClick={toggleCommentEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className='comment__edit' onClick={toggleCommentEdit}>
                  Edit
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
      <br></br>
      {comment.comments.length >= 1
        ? comment.comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                comment={comment}
                postID={postID}
                depth={depth + 1}
              ></Comment>
            );
          })
        : null}
    </div>
  );
}

export default Comment;
