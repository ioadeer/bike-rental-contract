import React, {
  useState,
} from 'react';

function BikeDetailView({
  bike,
}) {
  const [seeFullAddress, setSeeFullAddress] = useState(false);

  const handleSeeFullAddress = () => {
    setSeeFullAddress(!seeFullAddress);
  };

  return (
    <div className="row">
      <div className="col s12 detail-title">
        <span>Bike Detail</span>
      </div>
      <div className="row">
        <div
          className="detail-item-label col s6"
        >
          <span className="grey-text text-darken-1">
            <b>bike number</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          <span>{bike.bike_id}</span>
        </div>
      </div>
      <div className="row">
        <div
          className="detail-item-label col s6"
        >
          <span className="grey-text text-darken-1">
            <b>description</b>
          </span>
        </div>
        <div className="col s6 detail-item">
          <span>{bike.description}</span>
        </div>
      </div>
      <div className="row">
        <div
          className="col s6 detail-item-label"
        >
          <span className="grey-text text-darken-1">
            <b>owner</b>
          </span>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="col s6 detail-item"
          onClick={handleSeeFullAddress}
          onKeyDown={handleSeeFullAddress}
        >
          {!seeFullAddress && (
            <span>
              {bike.owner.slice(0, 4)}
              ...
              {bike.owner.slice(-4)}
            </span>
          )}
          {seeFullAddress && (
            <span>
              {bike.owner}
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
            {bike.rent_price}
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
            {bike.collateral}
            &nbsp;
            <i>wei</i>
          </span>
        </div>
      </div>
    </div>
  );
}

export default BikeDetailView;
