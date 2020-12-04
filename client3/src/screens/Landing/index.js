import React from 'react';

import {
  useHistory,
} from 'react-router-dom';

function Landing() {
  const history = useHistory();
  return (
    <div className="row" style={{ height: '75vh' }}>
      <div
        onClick={() => history.push('/rent-bike')}
        className="col s6 main-menu-item"
        style={{
        }}
      >
        <h1>RENT BIKE</h1>
      </div>
      <div
        onClick={() => history.push('/create-bike')}
        className="col s6 main-menu-item"
        style={{ height: '50%' }}
      >
        <h1>REGISTER BIKE</h1>
      </div>
      <div
        className="col s6 main-menu-item"
      >
        <h1>MY RENTALS</h1>
      </div>
      <div
        className="col s6 main-menu-item"
      >
        <h1>MY BIKES</h1>
      </div>
    </div>
  );
}

export default Landing;
