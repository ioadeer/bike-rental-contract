import React from 'react';

import {
  useHistory,
} from 'react-router-dom';

function Landing() {
  const history = useHistory();
  return (
    <div className="row" style={{ height: '75vh' }}>
      <div
        className="col s6 main-menu-item"
        style={{ height: '50%' }}
      >
        <button
          type="button"
          className="btn btn-flat black-text main-menu-button"
          onClick={() => history.push('/rent-bike')}
        >
          RENT BIKE
        </button>
      </div>
      <div
        className="col s6 main-menu-item"
        style={{ height: '50%' }}
      >
        <button
          type="button"
          className="btn btn-flat black-text main-menu-button"
          onClick={() => history.push('/register-bike')}
        >
          REGISTER BIKE
        </button>
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
