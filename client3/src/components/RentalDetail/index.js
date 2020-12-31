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

function RentalDetail() {
  const { rentalId } = useParams();

  const userAddress = useSelector((state) => state.UserReducer.address);
  const rentals = useSelector((state) => state.RentalReducer);
  const rental = rentals.filter((rent) => rent.rental_id === rentalId)[0];
  const rentalNotFound = !rental;
  const rentalAsRentee = rental ? rental.rentee === userAddress : false;
  const rentalAsRenter = rental ? rental.renter === userAddress : false;
  console.log(rental);

  // const rentalsAsRentee = rentals.filter((rental) => rental.rentee === userAddress);

  return (
    <div style={{ height: '75vh' }} className="container">
      {rentalAsRenter && (
        <div className="row">
          <div className="col s10 offset-s2 m4 12 detail-title">
            <span>Rental Detail</span>
          </div>
          <div
            className="detail-item-label col s4 m4"
          >
            <span className="grey-text text-darken-1">
              <b>You lent your bike number</b>
            </span>
          </div>
          <div className="col s8 detail-item">
            <span>{rental.bike_id}</span>
          </div>
          <div
            className="col s4 detail-item-label"
          >
            <span className="grey-text text-darken-1">
              <b>to</b>
            </span>
          </div>
          <div className="col s8 detail-item">
            <span>
              {rental.rentee.slice(0, 4)}
              ...
              {rental.rentee.slice(-4)}
            </span>
          </div>
          <div
            className="col s4 detail-item-label"
          >
            <span className="grey-text text-darken-1">
              <b>rental price</b>
            </span>
          </div>
          <div className="col s8 detail-item">
            <span>
              {rental.rent_price}
              &nbsp;
              <i>gwei</i>
            </span>
          </div>
          <div
            className="col s4 detail-item-label"
          >
            <span className="grey-text text-darken-1">
              <b>collateral</b>
            </span>
          </div>
          <div className="col s8 detail-item">
            <span>
              {rental.collateral}
              &nbsp;
              <i>gwei</i>
            </span>
          </div>
        </div>
      )}
      {rentalAsRentee && (
        <h1>You rented</h1>
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
