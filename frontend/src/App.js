import React, { useEffect, useState } from 'react';

import './styles/style.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAllPosts, getSinglePost } from './services/DBServices';
import SinglePost from './components/SinglePost';
import UserDetails from './components/UserDetails';
import NavBar from './components/NavBar';
import About from './components/About';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Admin from './components/Admin';

function App() {
  /*
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllPosts().then((e) => {
      setData(e.data);
    });
  }, []);
*/
  return (
    <BrowserRouter>
      <NavBar></NavBar>
      <div className='mainDisplay'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/user/:id' element={<UserDetails />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
