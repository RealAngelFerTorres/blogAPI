import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { isAuthenticated, getUserDetails } from '../services/DBServices';
import UserContext from '../services/UserContext';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [user, setUser] = useState();

  let url = useParams();
  let navigate = useNavigate();

  const manageDrafts = async () => {
    navigate('drafts');
  };

  useEffect(() => {
    getUserDetails(url.id).then((e) => {
      setUser(e.data);
    });
  }, []);

  if (!user || !currentUser) {
    return <div>Loading user data...</div>;
  } else {
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
        <br></br>
      </div>
    );
  }
}

export default UserDetails;
