import React, {
  useState,
} from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  setSending,
  setSuccess,
  setError,
  setReset,
  setReject,
} from '../../actions/TransactionActions';

import {
  setRenterReturnApproval,
} from '../../actions/RentalActions';

function BikeLentDetail({
  rental,
}) {
  const dispatch = useDispatch();
  const [seeFullAddress, setSeeFullAddress] = useState(false);
  const renterReturnApprove = useSelector((state) => state.ContractReducer.methods.renterReturnApprove);
  const user = useSelector((state) => state.UserReducer.address);

  const handleSeeFullAddress = () => {
    setSeeFullAddress(!seeFullAddress);
  };

  async function handleRenterReturnApproval(id) {
    dispatch(setReset());
    renterReturnApprove(id).send({ from: user })
      .once('sending', () => {
        dispatch(setSending());
      })
      .on('error', (error) => {
        dispatch(setError(error));
      })
      .then((receipt) => {
        if (receipt.transactionHash) {
          dispatch(setSuccess(receipt));
          dispatch(setRenterReturnApproval(id));
        }
      })
      .catch((error) => {
        dispatch(setReject(error));
      });
  }

  return (
    <div className="row">
      <div className="col s12 detail-title">
        <span>Rental Detail</span>
      </div>
      <div className="row">
        <div
          className="detail-item-label col s6"
        >
          <span className="grey-text text-darken-1">
            <b>You lent your bike number</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          <span>{rental.bike_id}</span>
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>to</b>
          </span>
        </div>
        <div className="col s6 detail-item" onClick={handleSeeFullAddress}>
          {!seeFullAddress && (
            <span>
              {rental.rentee.slice(0, 4)}
              ...
              {rental.rentee.slice(-4)}
            </span>
          )}
          {seeFullAddress && (
            <span>
              {rental.rentee}
            </span>
          )}
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>rental price</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          <span>
            {rental.rent_price}
            &nbsp;
            <i>wei</i>
          </span>
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>collateral</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          <span>
            {rental.collateral}
            &nbsp;
            <i>wei</i>
          </span>
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>rentee returned approval</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          {rental.rentee_returned_approval && (
            <span>
              <i className="material-icons">
                done
              </i>
            </span>
          )}
          {!rental.rentee_returned_approval && (
            <span>
              <i className="material-icons">
                do_not_disturb_on
              </i>
            </span>
          )}
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>your returned approval</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          {rental.renter_returned_approval && (
            <span>
              <i className="material-icons">
                done
              </i>
            </span>
          )}
          {!rental.renter_returned_approval && (
            <span>
              <i className="material-icons">
                do_not_disturb_on
              </i>
            </span>
          )}
        </div>
        {!rental.renter_returned_approval && (
          <div className="col s12" style={{ paddingTop: '2em', display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn waves-effect waves-light"
              onClick={() => handleRenterReturnApproval(`${rental.rental_id}`)}
            >
              Notify bike return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BikeLentDetail;
