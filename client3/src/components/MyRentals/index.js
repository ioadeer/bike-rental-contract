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
  fetchUserRentals,
} from '../../api/RentalsApi';

import BikesLentList from '../BikesLentList';
import BikesRentedList from '../BikesRentedList';

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
      dispatch(clearBikes());
      fetchUserRentals(contractInstance, userAddress);
      setInit(true);
    }
    return function cleanup() {
      // dispatch(clearBikes());
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
            <BikesRentedList
              hasRentalsAsRentee={hasRentalsAsRentee}
              rentalsAsRentee={rentalsAsRentee}
            />
          )}
          {seeBikesLent && (
            <BikesLentList
              rentalsAsRenter={rentalsAsRenter}
              hasRentalsAsRenter={hasRentalsAsRenter}
            />
          )}
        </div>
      </div>
      <TransactionStatusDisplay />
    </div>
  );
}

export default MyRentals;
