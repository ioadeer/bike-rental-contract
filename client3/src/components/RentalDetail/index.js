import React, {
  useState,
} from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  useParams,
  Link,
} from 'react-router-dom';

import BikeRentedDetail from '../BikeRentedDetail';
import BikeLentDetail from '../BikeLentDetail';

function RentalDetail() {
  const { rentalId } = useParams();

  const userAddress = useSelector((state) => state.UserReducer.address);
  const rentals = useSelector((state) => state.RentalReducer);
  const rental = rentals.filter((rent) => rent.rental_id === rentalId)[0];
  const rentalNotFound = !rental;
  const rentalAsRentee = rental ? rental.rentee === userAddress : false;
  const rentalAsRenter = rental ? rental.renter === userAddress : false;

  return (
    <div className="container" style={{ marginTop: '5vh' }}>
      {rentalAsRenter && (
        <BikeLentDetail
          rental={rental}
        />
      )}
      {rentalAsRentee && (
        <BikeRentedDetail
          rental={rental}
        />
      )}
      {rentalNotFound && (
        <div className="row">
          <h1>404</h1>
          <p>Oops, rental not found!</p>
          <Link to="/my-rentals">
            <p>Back to rentals</p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default RentalDetail;
