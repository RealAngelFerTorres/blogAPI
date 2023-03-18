import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import TextareaAutosize from 'react-textarea-autosize';
import '../styles/style.css';
import {
  deleteComment,
  createNewReply,
  editComment,
} from '../services/DBServices';
import UserContext from '../services/UserContext';
import ErrorPopup from './ErrorPopup';

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
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState([]);

  let navigate = useNavigate();

  const manageResponse = (response) => {
    if (response.user === false) {
      navigate('/login');
      return;
    }
    if (response.errors) {
      response.errors.forEach((error) => {
        setErrors(response.errors);
        setShowErrors(true);
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
    if (!response) {
      navigate('/error');
      return;
    }
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
    if (!response) {
      navigate('/error');
      return;
    }
    if (response.status === 'OK') {
      comment.text = copyState.text;
      setIsEditing(false);
      return;
    }
    manageResponse(response);
  };

  const submitDeleteComment = async (e) => {
    const response = await deleteComment(comment.id);
    if (!response) {
      navigate('/error');
      return;
    }
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
              <Link className='username' to={'../' + comment.author.url}>
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
            <div className='editArea'>
              <TextareaAutosize
                className='comment__input editing'
                type='text'
                name='text'
                value={commentForm.text}
                maxLength={500}
                required
                onChange={handleCommentFormChange}
              ></TextareaAutosize>
            </div>
          ) : (
            <div className='comment__text'>{comment.text}</div>
          )}
          <div className='comment__options'>
            {/* Since depth of 2 onwards, the reply button will not be shown */}
            {depth > 2 ? null : isEditing ? null : (
              <div
                className='comment__options__replySection button--grey'
                onClick={toggleReply}
              >
                <div className='material-icons reply button--grey'>reply</div>
                <div className='comment__reply'>Reply</div>
              </div>
            )}
            {currentUser.id === comment.author.id ? (
              isEditing ? (
                <div className='bottomOption'>
                  <div className='button--grey' onClick={toggleCommentEdit}>
                    Cancel
                  </div>
                  <button className='button' onClick={submitEditComment}>
                    Save edit
                  </button>
                </div>
              ) : showReply ? null : (
                <div className='button--grey' onClick={toggleCommentEdit}>
                  Edit
                </div>
              )
            ) : null}
            {currentUser.id === comment.author.id ? (
              isEditing ? null : showReply ? null : (
                <div className='button--grey' onClick={submitDeleteComment}>
                  Delete
                </div>
              )
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
              <div className='bottomOption'>
                <div className='button--grey' onClick={toggleReply}>
                  Cancel
                </div>
                <button className='button' onClick={submitReply}>
                  Reply
                </button>
              </div>
            </div>
          ) : null}
          <ErrorPopup
            errors={errors}
            showErrors={showErrors}
            stateChanger={setShowErrors}
          ></ErrorPopup>
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
