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
    case 'SET_BIKES':
      const bikes = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        let payload = action.payload;
        bikes.push({
                    bike_id: payload[i].id,
                    description: payload[i].description,
                    owner: payload[i].owner,
                    available: payload[i].available,
                    rent_price: payload[i].rentPrice,
                    collateral: payload[i].collateral
                  });
      }
      return bikes;
    case 'CLEAR_BIKES':
      return [];
    default:
      return initialState;
  }
};

export default BikeReducer;
