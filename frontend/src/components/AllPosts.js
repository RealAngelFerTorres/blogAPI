import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { getAllPosts } from '../services/DBServices';
import { DateTime } from 'luxon';

function AllPosts() {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then((e) => {
      setAllPosts(e.data);
    });
  }, []);

  if (!allPosts) {
    return <div>Loading all posts...</div>;
  } else {
    return (
      <div className='allPosts'>
        {allPosts.map((post, index) => {
          return (
            <div className='post' key={index} id={post.id}>
              <div className='post__author'>
                <div>
                  <div className='material-icons'>person</div>{' '}
                  <Link to={post.author.url}>{post.author.username}</Link>
                </div>
              </div>
              <div className='post__dates'>
                <div className='post__createTime'>
                  {DateTime.fromISO(post.createTime).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </div>
                {post.editTime.includes('1970-01-01') ? null : (
                  // Conditional rendering. 1970-01-01 is considered a null date.
                  <div className='post__editTime'>
                    - Edited:{' '}
                    {DateTime.fromISO(post.editTime).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </div>
                )}
              </div>
              <div className='post__title'>
                <Link to={post.url}>{post.title}</Link>
              </div>
              <div className='post__text'>{post.text}</div>
              <div className='post__interactions'>
                <div className='post__interactions--karma'>
                  <div>
                    <div className='material-icons'>swap_vert</div>
                    {post.karma}{' '}
                    {post.karma === 1 || post.karma === -1 ? 'point' : 'points'}
                  </div>
                </div>
                <div className='post__interactions--comments'>
                  <div>
                    <div className='material-icons'>mode_comment</div>
                    {post.commentQuantity}{' '}
                    {post.commentQuantity === 1 ? 'comment' : 'comments'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default AllPosts;
