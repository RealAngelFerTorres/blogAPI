import React, { useState, useEffect, createContext } from 'react';
import { isAuthenticated } from './DBServices';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let response = await isAuthenticated();
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
