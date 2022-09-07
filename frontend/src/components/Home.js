import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function Home(props) {
  const { data } = props;

  return (
    <div className='App'>
      Hello world
      <div>{data}</div>
    </div>
  );
}

export default Home;
