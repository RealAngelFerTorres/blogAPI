import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { isAuthenticated, getUserDetails } from '../services/DBServices';
import UserContext from '../services/UserContext';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  let url = useParams();
  let navigate = useNavigate();

  const manageDrafts = async () => {
    navigate('drafts');
  };

  useEffect(() => {
    const async = async () => {
      const response = await getUserDetails(url.id);
      if (response.status === 'OK') {
        setUser(response.data);
      }
      if (response.status === 'ERROR') {
        setUser(false);
      }
      if (response.user === false) {
        setUser('Not logged in');
      }
      setIsLoading(false);
    };
    async();
  }, []);

  if (isLoading) {
    return <div>Loading user data...</div>;
  } else {
    if (user === false) {
      return <div>User not found.</div>;
    } else if (currentUser === '' || user === 'Not logged in') {
      return <div>You need to be logged-in to see this page.</div>;
    } else if (currentUser) {
      return (
        <div className='user' id={user.id}>
          <div className='user__name'>
            <Link to={user.url}>{user.username}</Link>
          </div>
          <div className='user__createTime'>Member since {user.createTime}</div>
          <div className='user__title'>Karma: {user.karma}</div>
          <div className='user__membershipStatus'>
            Membership status: {user.membershipStatus}
          </div>

          {currentUser.id === user.id ? (
            <button onClick={manageDrafts}>View unpublished posts</button>
          ) : null}
        </div>
      );
    }
  }
}

export default UserDetails;
