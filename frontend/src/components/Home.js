import React, { useState, useEffect } from 'react';
import SinglePost from './SinglePost';
import '../styles/style.css';

function Home(props) {
  const { data } = props;

  return (
    <div className='posts'>
      {data.map((post, index) => {
        return <SinglePost key={index} post={post}></SinglePost>;
      })}
    </div>
  );
}

export default Home;
