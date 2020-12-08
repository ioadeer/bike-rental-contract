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
  fetchRentals,
} from '../../api/RentalsApi';

import TransactionStatusDisplay from '../TransactionStatusDisplay';

function MyRentals() {
  const dispatch = useDispatch();
  const [init, setInit] = useState(false);
  const userAddress = useSelector((state) => state.UserReducer.address);
  const rentals = useSelector((state) => state.RentalReducer);
  const rentalsAsRentee = rentals.filter((rental) => rental.rentee === userAddress);
  const hasRentalsAsRentee = rentalsAsRentee.length > 0;
  const contractInstance = useSelector((state) => state.ContractReducer);

  useEffect(() => {
    if (!init) {
      fetchRentals(contractInstance, userAddress);
      setInit(true);
    }
    return function cleanup() {
      dispatch(clearBikes());
    };
  }, [init]);

  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          <h1>Rentals as Rentee</h1>
          {hasRentalsAsRentee && (
            <table className="bordered centered highlight responsive-table">
              <thead>
                <tr>
                  <th>Rental id</th>
                  <th>Renter</th>
                  <th>Bike id</th>
                  <th>Rent price</th>
                  <th>Collateral</th>
                  <th>Return Approved by renter</th>
                  <th>Return Approved by you</th>
                </tr>
              </thead>
              <tbody>
                {rentalsAsRentee.map((rental) => (
                  <tr key={rental.rental_id}>
                    <td>{rental.rental_id}</td>
                    <td>{rental.renter}</td>
                    <td>{rental.bike_id}</td>
                    <td>
                      {rental.rent_price}
                      &nbsp;
                      <i>wei</i>
                    </td>
                    <td>
                      {rental.collateral}
                      &nbsp;
                      <i>wei</i>
                    </td>
                    <td>{rental.renter_returned_approval}</td>
                    <td>{rental.rentee_returned_approval}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!hasRentalsAsRentee && (
            <p>No bikes rented!</p>
          )}
        </div>
      </div>
      <TransactionStatusDisplay />
    </div>
  );
}

export default MyRentals;
