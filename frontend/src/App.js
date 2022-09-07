import React, { useEffect, useState } from 'react';
import './styles/style.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getDB } from './services/DBServices';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDB().then((e) => {
      console.log(e.data[0].text);
      setData(e.data[0].text);
    });
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Home data={data} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
