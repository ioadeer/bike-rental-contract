import React, {
  useState,
  useEffect,
} from 'react';

import Web3 from 'web3';

import {
  useHistory,
} from 'react-router-dom';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  clearBikes,
} from '../../actions/BikeActions';

import {
  setSending,
  setSuccess,
  setError,
  setReset,
  setReject,
} from '../../actions/TransactionActions';

import {
  fetchBikes,
} from '../../api/BikesApi';

import TransactionStatusDisplay from '../TransactionStatusDisplay';

function RentBike() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [init, setInit] = useState(false);
  const userAddress = useSelector((state) => state.UserReducer.address);
  const bikes = useSelector((state) => state.BikeReducer);
  const filteredBikes = bikes.filter((bike) => bike.owner !== userAddress);
  const rentBike = useSelector((state) => state.ContractReducer.methods.rentBike);
  const contractInstance = useSelector((state) => state.ContractReducer);

  useEffect(() => {
    if (!init) {
      dispatch(clearBikes());
      fetchBikes(contractInstance);
      setInit(true);
    }
    return function cleanup() {
    };
  }, [init]);

  async function bikeRentHandle(id, rentPrice, collateral) {
    const finalValue = Web3.utils.toBN(rentPrice).add(Web3.utils.toBN(collateral)).toString();
    // console.log(finalValue);
    dispatch(setReset());
    rentBike(id).send({ from: userAddress, value: finalValue })
      .once('sending', () => {
        dispatch(setSending());
      })
      .on('error', (error) => {
        console.log(error);
        dispatch(setError(error));
      })
      .on('receipt', (receipt) => {
        dispatch(setSuccess(receipt));
      })
      .catch((error) => {
        dispatch(setReject(error));
      });
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col s10 offset-s1">
          <h1>Rent a bike</h1>
          {bikes && (
            <table className="bordered centered highlight responsive-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Collateral</th>
                  <th>Owner</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredBikes.map((bike) => (
                  <tr
                    key={bike.bike_id}
                    onClick={() => history.push(`/bike/${bike.bike_id}`)}
                  >
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
                    <td>
                      {bike.owner.slice(0, 4)}
                      ...
                      {bike.owner.slice(-4)}
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
                    {bike.available && (
                      <td
                        className="btn btn-large btn-flat waves-effect white black-text"
                        style={{
                          marginRight: '0px',
                        }}
                      >
                        Rent
                      </td>
                    )}
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
      <TransactionStatusDisplay />
    </div>
  );
}

export default RentBike;

/*
            */
