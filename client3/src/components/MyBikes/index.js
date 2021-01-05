import React, {
  useState,
  useEffect,
} from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  clearBikes,
} from '../../actions/BikeActions';

import {
  // fetchBikes,
  fetchUserBikes,
} from '../../api/BikesApi';

import TransactionStatusDisplay from '../TransactionStatusDisplay';

function MyBikes() {
  const dispatch = useDispatch();
  const [init, setInit] = useState(false);
  const userAddress = useSelector((state) => state.UserReducer.address);
  const bikes = useSelector((state) => state.BikeReducer);
  const filteredBikes = bikes.filter((bike) => bike.owner === userAddress);
  const noBikes = (filteredBikes.length === 0);
  const contractInstance = useSelector((state) => state.ContractReducer);

  useEffect(() => {
    if (!init) {
      // fetchBikes(contractInstance);
      fetchUserBikes(contractInstance, userAddress);
      setInit(true);
    }
    return function cleanup() {
      dispatch(clearBikes());
    };
  }, [init]);

  return (
    <div className="container">
      <div className="row">
        <div className="col s10 offset-s1">
          <h1>My bikes</h1>
          {!noBikes && (
            <table className="bordered centered highlight responsive-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Collateral</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredBikes.map((bike) => (
                  <tr key={bike.bike_id}>
                    <td>{bike.description}</td>
                    <td>
                      {bike.rent_price}
                      &nbsp;
                      <i>wei</i>
                    </td>
                    <td>
                      {bike.collateral}
                      &nbsp;
                      <i>wei</i>
                    </td>
                    {bike.available && (
                      <td>
                        <i className="material-icons">
                          done
                        </i>
                      </td>
                    )}
                    {!bike.available && (
                      <td>
                        <i className="material-icons">
                          do_not_disturb_on
                        </i>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {noBikes && (
            <p>No bikes registered by this address!</p>
          )}
        </div>
      </div>
      <TransactionStatusDisplay />
    </div>
  );
}

export default MyBikes;

/*
            */
