/* eslint-disable */

const setRentals = (rentals) => {
  return {
    type:'SET_RENTALS',
    payload: rentals 
  }
}

const setRenterReturnApproval = (id) => {
  return {
    type:'SET_RENTER_RETURN_APPROVAL',
    payload: id
  }
}

const setRenteeReturnApproval = (id) => {
  return {
    type:'SET_RENTEE_RETURN_APPROVAL',
    payload: id
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
  setRenterReturnApproval,
  setRenteeReturnApproval,
};
