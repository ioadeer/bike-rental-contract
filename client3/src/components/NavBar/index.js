import React from 'react';

import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';

import { useSelector } from 'react-redux';

function NavBar() {
  const {
    address,
    admin,
    minter,
    burner,
  } = useSelector((state) => state.UserReducer);
  return (
    <nav>
      <div className="nav-wrapper">
        <a href="#" className="brand-logo">Bike Rent!</a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <Link to='/create-bike'>
              Create Bike
            </Link>
          </li>
          <li>
            <Link to='/rent-bike'>
              Rent a bike
            </Link>
          </li>
          <li>
            Hola!&nbsp;
            { address }
          </li>
          {admin && (
            <li>
              &nbsp;Sos admin!
            </li>
          )}
          {minter && (
            <li>
              Sos minter!
            </li>
          )}
          {burner && (
            <li>
              Sos burner!
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
