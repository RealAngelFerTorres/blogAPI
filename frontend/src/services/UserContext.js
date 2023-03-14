import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './DBServices';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  let navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
      if (!response) {
        setCurrentUser('');
        return;
      }
      if (response.user === false) {
        response.user = '';
      }
      setCurrentUser(response.user);
    };

    checkLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
