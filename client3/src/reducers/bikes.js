/* eslint-disable */
const initialState = {
};

const Bike = ( initialState = {} , action) => {
  switch(action.type){
    case 'SET_BIKE':
      const payload = action.payload;
      return ({
        bike_id: payload.id,
        description: payload.description,
        owner: payload.owner,
        available: payload.available,
        rent_price: payload.rentPrice,
        collateral: payload.collateral
      });
    default:
      return initialState;
  }
};
const BikeReducer = ( initialState = [], action) =>{
  switch(action.type){
    case 'SET_BIKE':
      return [...initialState, Bike(null, action)];
    case 'CLEAR_BIKES':
      return [];
    default:
      return initialState;
  }
};

export default BikeReducer;
