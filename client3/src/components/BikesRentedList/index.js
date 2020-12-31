import React from 'react';

function BikesRentedList({
  hasRentalsAsRentee,
  rentalsAsRentee,
}) {
  return (
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
  );
}

export default BikesRentedList;
