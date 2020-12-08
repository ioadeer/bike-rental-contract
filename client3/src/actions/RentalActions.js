/* eslint-disable */

const setRentals = (rentals) => {
  return {
    type:'SET_RENTALS',
    payload: rentals 
  }
}

const clearRentals= () => {
  return {
    type:'CLEAR_RENTALS',
  }
}

export {
  setRentals,
  clearRentals,
};
