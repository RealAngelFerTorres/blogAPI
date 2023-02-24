import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import '../styles/style.css';
import {
  deleteComment,
  createNewReply,
  editComment,
} from '../services/DBServices';
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
    let copyState = commentForm;
    copyState = {
      ...copyState,
      id: comment.id,
    };
    setCommentForm(copyState);

    const response = await editComment(copyState);
    if (response.status === 'OK') {
      comment.text = copyState.text;
      setIsEditing(false);
      return;
    }
    manageResponse(response);
  };

  const submitDeleteComment = async (e) => {
    const response = await deleteComment(comment.id);
    response.status === 'OK' ? navigate(0) : manageResponse(response);
  };

  return (
    <div className='comment__thread'>
      {comment.isDeleted ? (
        <div className={'comment__author deleted comment depth' + depth}>
          <div className='material-icons deleted'>person</div>
          <i>Deleted comment</i>
        </div>
      ) : (
        <div className={'comment depth' + depth} id={comment.id}>
          <div className='comment__data'>
            <div className='comment__author'>
              <div className='material-icons'>person</div>{' '}
              <Link to={'../' + comment.author.url}>
                {comment.author.username}
              </Link>
            </div>
            <div
              className='comment__createTime'
              title={DateTime.fromISO(comment.createTime).toLocaleString(
                DateTime.DATETIME_MED
              )}
            >
              &nbsp;· {DateTime.fromISO(comment.createTime).toRelative()}{' '}
            </div>
            {comment.editTime.includes('1970-01-01') ? null : (
              // Conditional rendering. 1970-01-01 is considered a null date.
              <div
                className='comment__editTime'
                title={DateTime.fromISO(comment.editTime).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              >
                &nbsp;· edited {DateTime.fromISO(comment.editTime).toRelative()}
              </div>
            )}
          </div>
          {isEditing ? (
            <input
              type='text'
              name='text'
              value={commentForm.text}
              maxLength={500}
              required
              onChange={handleCommentFormChange}
            ></input>
          ) : (
            <div className='comment__text'>{comment.text}</div>
          )}
          <div className='comment__options'>
            {/* Since depth of 2 onwards, the reply button will not be shown */}
            {depth > 2 ? null : (
              <div
                className='comment__options__replySection'
                onClick={toggleReply}
              >
                <div className='material-icons icon reply'>reply</div>
                <div className='comment__reply'>Reply</div>
              </div>
            )}
            {currentUser.id === comment.author.id ? (
              <div>
                {isEditing ? (
                  <div>
                    <button className='OKButton' onClick={submitEditComment}>
                      OK
                    </button>
                    <button
                      className='cancelButton'
                      onClick={toggleCommentEdit}
                    >
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
            {currentUser.id === comment.author.id ? (
              <div className='comment__delete' onClick={submitDeleteComment}>
                Delete
              </div>
            ) : null}
          </div>
          {showReply ? (
            <div className='replyArea'>
              <textarea
                className='comment__input'
                name='text'
                type='text'
                placeholder='What do you think?'
                required
                onChange={handleReplyFormChange}
              />
              <div className='bottomReply'>
                <div className='cancel__button' onClick={toggleReply}>
                  Cancel
                </div>
                <button className='reply__button button' onClick={submitReply}>
                  Reply
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
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
