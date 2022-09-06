import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function Home(props) {
  const { data } = props;

  const [tasks, setTasks] = useState([]);
  const [numberOfTasks, setNumberOfTasks] = useState([]);
  const [isTaskEdited, setTaskEdited] = useState(false);

  return (
    <div className='App'>
      Hello world
      {data}
      <div className='container mrgnbtm'>
        <div className='row'>
          <div className='col-md-12'></div>
        </div>
      </div>
      <div className='container mrgnbtm'></div>
    </div>
  );
}

export default Home;
