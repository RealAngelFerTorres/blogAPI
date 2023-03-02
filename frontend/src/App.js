import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/style.css';

import Home from './components/Home';
import SinglePost from './components/SinglePost';
import CreatePost from './components/CreatePost';
import UserDetails from './components/UserDetails';
import UserDrafts from './components/UserDrafts';
import NavBar from './components/NavBar';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Error from './components/Error';
import BottomBar from './components/BottomBar';

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
            <Route path='/error' element={<Error />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </div>
        <BottomBar></BottomBar>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
