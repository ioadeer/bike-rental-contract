import React from 'react';

import {
  useSelector,
} from 'react-redux';

import {
  useParams,
  Link,
} from 'react-router-dom';

import BikeDetailView from '../BikeDetailView';

function BikeDetail() {
  const { bikeId } = useParams();
  const userAddress = useSelector((state) => state.UserReducer.address);
  const bikes = useSelector((state) => state.BikeReducer);
  const bike = bikes.filter((aBike) => aBike.bike_id === bikeId)[0];
  const bikeNotFound = !bike;
  const userIsOwner = bike ? bike.owner === userAddress : false;

  return (
    <div className="container" style={{ marginTop: '5vh' }}>
      {!bikeNotFound && (
        <BikeDetailView
          bike={bike}
        />
      )}
      {userIsOwner && (
        <div>
          Edit
        </div>
      )}
      {bikeNotFound && (
        <div className="row">
          <h1>404</h1>
          <p>Oops, bike not found!</p>
          <Link to="/my-bikes">
            <p>Back to rentals</p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default BikeDetail;
