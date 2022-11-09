import React, { useEffect, useState } from 'react';
import './styles/style.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAllPosts, getSinglePost } from './services/DBServices';
import SinglePost from './components/SinglePost';

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
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:id' element={<SinglePost />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
