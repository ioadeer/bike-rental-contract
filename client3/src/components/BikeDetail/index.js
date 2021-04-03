import React from 'react';
import Web3 from 'web3';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  useParams,
  Link,
  useHistory,
} from 'react-router-dom';

import BikeDetailView from '../BikeDetailView';

import {
  setSending,
  setSuccess,
  setError,
  setReset,
  setReject,
} from '../../actions/TransactionActions';

function BikeDetail() {
  const { bikeId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const userAddress = useSelector((state) => state.UserReducer.address);
  const bikes = useSelector((state) => state.BikeReducer);
  const bike = bikes.filter((aBike) => aBike.bike_id === bikeId)[0];
  const bikeNotFound = !bike;
  const userIsOwner = bike ? bike.owner === userAddress : false;
  const rentBike = useSelector((state) => state.ContractReducer.methods.rentBike);

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
        history.push('/my-rentals');
      })
      .catch((error) => {
        dispatch(setReject(error));
      });
  }

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
      {bike.available && (
        <div className="col s12" style={{ paddingTop: '2em', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => bikeRentHandle(bike.bike_id, bike.rent_price, bike.collateral)}
            className="btn waves-effect waves-light"
            style={{
              marginRight: '0px',
            }}
          >
            Rent
          </button>
        </div>
      )}
    </div>
  );
}

export default BikeDetail;
