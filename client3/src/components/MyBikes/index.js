import React, {
  useState,
  useEffect,
} from 'react';

import Web3 from 'web3';

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
  console.log(noBikes);
  // console.log(filteredBikes);
  const rentBike = useSelector((state) => state.ContractReducer.methods.rentBike);
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

  async function bikeRentHandle(id, rentPrice, collateral) {
    const finalValue = Web3.utils.toBN(rentPrice).add(Web3.utils.toBN(collateral)).toString();
    console.log(finalValue);
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
      .then((rec) => {
        console.log(rec);
        dispatch(setReset());
      })
      .catch((error) => {
        dispatch(setReject(error));
      });
  }
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
