import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { getAllDrafts } from '../services/DBServices';
import UserContext from '../services/UserContext';

export default function UserDrafts() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [allDrafts, setAllDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== undefined) {
      const async = async () => {
        const response = await getAllDrafts(currentUser.id);
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
    return <div>Loading drafts...</div>;
  } else if (currentUser && allDrafts.length === 0) {
    return <div>You don't have any drafts...</div>;
  } else {
    return (
      <div>
        {allDrafts.map((post, index) => {
          return (
            <div className='post' key={index} id={post.id} title={post.title}>
              <div className='post__title'>
                <Link to={post.url}>{post.title}</Link>
              </div>
              <div className='post__createTime'>On: {post.createTime}</div>
              {post.editTime.includes('1970-01-01') ? null : (
                // Conditional rendering. 1970-01-01 is considered a null date.
                <div className='post__editTime'>Edited {post.editTime}</div>
              )}
              <div className='post__karma'>Karma: {post.karma}</div>
              <div className='post__text'>{post.text}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
