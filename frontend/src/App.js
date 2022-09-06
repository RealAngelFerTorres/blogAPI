import React, { useState } from 'react';
import './styles/style.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [data, setData] = useState([]);

  async function getDB() {
    console.log('LOADING...');

    // GET FORECAST WEATHER DATA FROM THAT LOCATION USING latitude and longitude
    try {
      const response = await fetch(`http://localhost:5000/`, {
        mode: 'cors',
      });
      setData(await response.json());
    } catch (error) {
      console.log('There was a problem fetching the data:', error);
    }
  }
  setData(getDB());
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
