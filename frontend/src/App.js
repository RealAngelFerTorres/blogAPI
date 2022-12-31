import React, { useEffect, useState } from 'react';

import './styles/style.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAllPosts, getSinglePost } from './services/DBServices';
import SinglePost from './components/SinglePost';
import CreatePost from './components/CreatePost';
import UserDetails from './components/UserDetails';
import UserDrafts from './components/UserDrafts';
import NavBar from './components/NavBar';
import About from './components/About';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Admin from './components/Admin';

import { UserProvider } from './services/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NavBar></NavBar>
        <div className='mainDisplay'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/post/:id' element={<SinglePost />} />
            <Route path='/post/create' element={<CreatePost />} />
            <Route path='/user/:id' element={<UserDetails />} />
            <Route path='/user/:id/drafts' element={<UserDrafts />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
