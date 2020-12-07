/* eslint-disable */
const setBike = (bike) => {
  return {
    type:'SET_BIKE',
    payload: bike
  }
}

const clearBikes = () => {
  return {
    type:'CLEAR_BIKES',
  }
}

export {
  setBike,
  clearBikes,
};
