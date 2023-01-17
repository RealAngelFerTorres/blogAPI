import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { isAuthenticated, getAllDrafts } from '../services/DBServices';
import UserContext from '../services/UserContext';

export default function UserDrafts() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [allDrafts, setAllDrafts] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (response.user === false) {
        response.user = '';
        navigate('/login');
      }
      setCurrentUser(response.user);

      // This is not part of log check, but it is necessary to stay here because setting state takes some time.
      getAllDrafts(response.user.id).then((e) => {
        setAllDrafts(e.data);
      });
    };

    checkLoggedIn();
  }, []);

  if (!allDrafts || !currentUser) {
    return <div>Loading drafts...</div>;
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

              <br></br>
            </div>
          );
        })}
      </div>
    );
  }
}
