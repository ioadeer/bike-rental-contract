import React from 'react';
import { useSelector } from 'react-redux';

function NavBar({
  contractAddress,
}) {
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
            Hola!&nbsp;
            { address }
          </li>
          {admin && (
            <li>
              Sos admin!
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
