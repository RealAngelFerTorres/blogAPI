import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import Comment from './Comment';
import { getUserDetails } from '../services/DBServices';

import { useParams } from 'react-router-dom';

function UserDetails() {
  const [user, setUser] = useState();

  let url = useParams();

  useEffect(() => {
    getUserDetails(url.id).then((e) => {
      setUser(e.data);
      console.log(e.data);
    });
  }, []);

  if (!user) {
    return <div>Loading user data...</div>;
  } else {
    return (
      <div className='user' id={user.id}>
        <div className='user__name'>
          <a href={user.url}>{user.username}</a>
        </div>
        <div className='user__createTime'>Member since {user.createTime}</div>
        <div className='user__title'>Karma: {user.karma}</div>
        <div className='user__membershipStatus'>
          Membership status: {user.membershipStatus}
        </div>

        <br></br>
      </div>
    );
  }
}

export default UserDetails;
