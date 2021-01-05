/* eslint-disable */

const RentalReducer = (rentals = [], action) => {
  switch(action.type) {
    case 'SET_RENTALS':
      rentals = [];
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
    case 'SET_RENTER_RETURN_APPROVAL':
      return rentals.map((rental) => {
        if(rental.rental_id === action.payload) {  
          return {
            ...rental, 
            renter_returned_approval: true
          } 
        }
          return rental;
        });
    case 'SET_RENTEE_RETURN_APPROVAL':
      return rentals.map((rental) => {
        if(rental.rental_id === action.payload) {  
          return {
            ...rental, 
            rentee_returned_approval: true
          } 
        }
          return rental;
        });
    case 'CLEAR_RENTALS':
      return [];
    default:
      return rentals;
  }
};

export default RentalReducer;
