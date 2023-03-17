import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { getAllDrafts } from '../services/DBServices';
import UserContext from '../services/UserContext';
import { DateTime } from 'luxon';
import Spinner from './Spinner';
import Error from './Error';

export default function UserDrafts() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [allDrafts, setAllDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== undefined) {
      const async = async () => {
        const response = await getAllDrafts(currentUser.id);
        if (!response) {
          setCurrentUser('');
          navigate('/error');
          return;
        }
        setIsLoading(false);

        if (response.status === 'OK') {
          setAllDrafts(response.data);
          return;
        }
        if (response.user === false) {
          navigate('/login');
          return;
        }
        if (response.message) {
          navigate('/error');
        }
      };
      async();
    }
  }, [currentUser]);

  if (isLoading) {
    return <Spinner></Spinner>;
  } else if (currentUser && allDrafts.length === 0) {
    return (
      <Error icon='edit_note' error={`You don't have any drafts.`}></Error>
    );
  } else {
    return (
      <div className='allPosts'>
        <div className='subtitle'>
          {currentUser.username}'s unpublished posts:
        </div>
        {allDrafts.map((post, index) => {
          return (
            <div className='post draft' key={index} id={post.id}>
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
            </div>
          );
        })}
      </div>
    );
  }
}
