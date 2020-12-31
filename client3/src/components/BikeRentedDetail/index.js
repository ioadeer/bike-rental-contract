import React, {
  useState,
} from 'react';

function BikeRentedDetail({
  rental,
}) {
  const [seeFullAddress, setSeeFullAddress] = useState(false);

  const handleSeeFullAddress = () => {
    setSeeFullAddress(!seeFullAddress);
  };

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
            <b>You rented the bike number</b>
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
            <b>from</b>
          </span>
        </div>
        <div className="col s6 detail-item" onClick={handleSeeFullAddress}>
          {!seeFullAddress && (
            <span>
              {rental.renter.slice(0, 4)}
              ...
              {rental.renter.slice(-4)}
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
            <b>renter returned approval</b>
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
    </div>
  );
}

export default BikeRentedDetail;
