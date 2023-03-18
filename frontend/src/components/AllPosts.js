import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { getAllPosts } from '../services/DBServices';
import { DateTime } from 'luxon';
import Spinner from './Spinner';

function AllPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const async = async () => {
      const response = await getAllPosts();
      if (!response) {
        navigate('/error');
        return;
      }
      setAllPosts(response.data);
      setIsLoading(false);
    };

    async();
  }, []);

  if (isLoading) {
    return <Spinner></Spinner>;
  } else {
    return (
      <div className='allPosts'>
        {allPosts.map((post, index) => {
          return (
            <div className='post' key={index} id={post.id}>
              <div className='post__author'>
                <div>
                  <div className='material-icons'>person</div>{' '}
                  <Link className='username' to={post.author.url}>
                    {post.author.username}
                  </Link>
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
                    &nbsp;· Edited:{' '}
                    {DateTime.fromISO(post.editTime).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </div>
                )}
              </div>
              <div className='post__title'>
                <Link to={post.url}>{post.title}</Link>
              </div>
              <div
                className='post__text gradient'
                dangerouslySetInnerHTML={{
                  __html: post.text,
                }}
              ></div>
              <Link className='button--grey continue' to={post.url}>
                Continue reading »
              </Link>
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
