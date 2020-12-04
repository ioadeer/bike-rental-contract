import React from 'react';

import {
  useSelector,
} from 'react-redux';

function RentBike() {
  const bikes = useSelector((state) => state.BikeReducer);
  console.log(bikes);

  return (
    <div className="container">
      <div className="row">
        <div className="col s10 offset-s1">
          <h1>Rent a bike</h1>
          {bikes && (
            <table className="highlight responsive-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Collateral</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr id={bike.bike_id}
                  >
                    <td>{bike.description}</td>
                    <td>{bike.rent_price}</td>
                    <td>{bike.collateral}</td>
                    <td>{bike.owner}</td>
                    <button type="button"
                      className="btn btn-large btn-flat waves-effect white black-text"
                      style={{
                        marginRight: '0px',
                      }}
                    >
                      Rent
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!bikes && (
            <p>No bikes registered!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentBike;

/*
            */
