/* eslint-disable */
const RentalReducer = (initialState = [], action) => {
  switch(action.type) {
    case 'SET_RENTALS':
      const rentals = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        let payload = action.payload;
        rentals.push({
                    rental_id: payload[i].id,
                    renter: payload[i].renter,
                    rentee: payload[i].rentee,
                    bike_id: payload[i].bike_id,
                    rent_price: payload[i].rentPrice,
                    collateral: payload[i].collateral,
                    renter_returned_approval: payload[i].renterReturnApproval,
                    rentee_returned_approval: payload[i].renteeReturnApproval,
                  });
      }
      return rentals;
    case 'CLEAR_RENTALS':
      return [];
    default:
      return initialState;
  }
};

export default RentalReducer;
