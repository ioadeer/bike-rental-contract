/* eslint-disable */
const initialState = {
  bikeCount: 0,
};

let bikeIndex = 0;

const BikeReducer = ( state = initialState, action) =>{
  switch(action.type){
    case 'SET_BIKE':
      const payload = action.payload;
      return ({
        ...state,
        [payload.id]: {
          bike_id: payload.id,
          description: payload.description,
          owner: payload.owner,
          available: payload.available,
          rent_price: payload.rentPrice,
          collateral: payload.collateral
        },
      });
    default:
      return state;
  }
};

export default BikeReducer;
