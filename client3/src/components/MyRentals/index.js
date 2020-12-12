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
  const rentalsAsRenter = rentals.filter((rental) => rental.renter === userAddress);
  const hasRentalsAsRenter = rentalsAsRenter.length > 0;
  const contractInstance = useSelector((state) => state.ContractReducer);
  const [seeBikesYouRented, setSeeBikesYouRented] = useState('false');
  const [seeBikesLent, setSeeBikesLent] = useState('false');

  useEffect(() => {
    if (!init) {
      fetchRentals(contractInstance, userAddress);
      setInit(true);
    }
    return function cleanup() {
      dispatch(clearBikes());
    };
  }, [init]);

  function bikesRentedVisibility() {
    setSeeBikesYouRented(!seeBikesYouRented);
  }

  function myBikesLent() {
    setSeeBikesLent(!seeBikesLent);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 rented-bikes-buttons-menu">
          <button
            className={seeBikesYouRented ?
              'blue lighten-4 waves-effect waves-blue btn-large' :
              'waves-effect waves-light btn-large'}
            type="button"
            onClick={bikesRentedVisibility}
          >
            {seeBikesYouRented && (
              <span>Hide bikes rented</span>
            )}
            {!seeBikesYouRented && (
              <span>See bikes rented</span>
            )}
            <i className="material-icons left">
              directions_bike
            </i>
          </button>
          <button
            className={seeBikesLent ?
              'blue lighten-4 waves-effect waves-blue btn-large' :
              'waves-effect waves-light btn-large'}
            type="button"
            onClick={myBikesLent}
          >
            {seeBikesLent && (
              <span>Hide bikes lent</span>
            )}
            {!seeBikesLent && (
              <span>See bikes lent</span>
            )}
            <i className="material-icons left">
              cloud
            </i>
          </button>
        </div>
        <div className="col s12">
          {seeBikesYouRented && (
            <div>
              <h1>Bikes you rented</h1>
              {hasRentalsAsRentee && (
                <table className="bordered centered highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Rental id</th>
                      <th>Rented from</th>
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
                        {rental.renter_returned_approval && (
                          <td>
                            <i className="material-icons">
                              done
                            </i>
                          </td>
                        )}
                        {!rental.renter_returned_approval && (
                          <td>
                            <i className="material-icons">
                              do_not_disturb_on
                            </i>
                          </td>
                        )}
                        {rental.rentee_returned_approval && (
                          <td>
                            <i className="material-icons">
                              done
                            </i>
                          </td>
                        )}
                        {!rental.rentee_returned_approval && (
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
              {!hasRentalsAsRentee && (
                <p>No bikes rented!</p>
              )}
            </div>
          )}
          {seeBikesLent && (
            <div>
              <h1>Bikes you lent</h1>
              <table className="bordered centered highlight responsive-table">
                <thead>
                  <tr>
                    <th>Rental id</th>
                    <th>Rented to</th>
                    <th>Bike id</th>
                    <th>Rent price</th>
                    <th>Collateral</th>
                    <th>Return Approved by rentee</th>
                    <th>Return Approved by you</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalsAsRenter.map((rental) => (
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
                      {rental.renter_returned_approval && (
                        <td>
                          <i className="material-icons">
                            done
                          </i>
                        </td>
                      )}
                      {!rental.renter_returned_approval && (
                        <td>
                          <i className="material-icons">
                            do_not_disturb_on
                          </i>
                        </td>
                      )}
                      {rental.rentee_returned_approval && (
                        <td>
                          <i className="material-icons">
                            done
                          </i>
                        </td>
                      )}
                      {!rental.rentee_returned_approval && (
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
              {!hasRentalsAsRenter && (
                <p>No bikes rented!</p>
              )}
            </div>
          )}
        </div>
      </div>
      <TransactionStatusDisplay />
    </div>
  );
}

export default MyRentals;
