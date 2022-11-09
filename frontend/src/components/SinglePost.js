import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import Comment from './Comment';
import { getSinglePost } from '../services/DBServices';

import { useParams } from 'react-router-dom';

function SinglePost() {
  const [post, setPost] = useState();

  let url = useParams();

  useEffect(() => {
    getSinglePost(url.id).then((e) => {
      setPost(e.data);
      console.log(e.data);
    });
  }, []);

  if (!post) {
    return <div>Loading post...</div>;
  } else {
    return (
      <div className='post' id={post.id} title={post.title}>
        <div className='post__title'>
          <a href={post.url}>{post.title}</a>
        </div>
        <div className='post__author'>Made by {post.author.username}</div>
        <div className='post__createTime'>On: {post.createTime}</div>
        {post.editTime.includes('1970-01-01') ? null : (
          // Conditional rendering. 1970-01-01 is considered a null date
          <div className='post__editTime'>Edited {post.editTime}</div>
        )}
        <div className='post__title'>Karma: {post.karma}</div>
        <div className='post__text'>{post.text}</div>
        <div className='post__comments'>{post.comments.length} Comments</div>

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
