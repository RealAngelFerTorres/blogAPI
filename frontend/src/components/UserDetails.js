import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { isAuthenticated, getUserDetails } from '../services/DBServices';
import UserContext from '../services/UserContext';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import Spinner from './Spinner';

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
      if (!response) {
        setCurrentUser('');
        navigate('/error');
        return;
      }
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
    return <Spinner></Spinner>;
  } else {
    if (user === false) {
      return <div>User not found.</div>;
    } else if (currentUser === '' || user === 'Not logged in') {
      return <div>You need to be logged-in to see this page.</div>;
    } else if (currentUser) {
      return (
        <div className='cardContainer userDetails' id={user.id}>
          <div className='card--left'>
            <div className='material-icons icon--big'>person</div>{' '}
            <Link className='username' to={user.url}>
              {user.username}
            </Link>
          </div>
          <div className='card--right'>
            <div className='user__createTime'>
              <div className='cardFont--small'>Member since:</div>
              <div className='cardFont--medium'>
                {DateTime.fromISO(user.createTime).toLocaleString(
                  DateTime.DATE_FULL
                )}
              </div>
            </div>
            <div className='user__title'>
              <div className='cardFont--small'>Karma:</div>
              <div className='cardFont--medium'>{user.karma}</div>
            </div>
            <div className='user__membershipStatus'>
              <div className='cardFont--small'>Membership status:</div>
              <div className='cardFont--medium'>{user.membershipStatus}</div>
            </div>
            {currentUser.id === user.id ? (
              <button className='button userCardButton' onClick={manageDrafts}>
                View unpublished posts
              </button>
            ) : null}
          </div>
        </div>
      );
    }
  }
}

export default UserDetails;
