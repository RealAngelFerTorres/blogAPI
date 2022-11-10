import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/style.css';
import Comment from './Comment';
import { getAllPosts } from '../services/DBServices';

function AllPosts() {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then((e) => {
      setAllPosts(e.data);
    });
  }, []);

  return (
    <div>
      {allPosts.map((post, index) => {
        return (
          <div className='post' key={index} id={post.id} title={post.title}>
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
            <div className='post__text'>{post.text}</div>
            <div className='post__comments'>
              {post.comments.length} Comments
            </div>

            <br></br>
          </div>
        );
      })}
    </div>
  );
}

export default AllPosts;
