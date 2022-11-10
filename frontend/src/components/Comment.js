import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';

function Comment(props) {
  const { comment } = props;

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
