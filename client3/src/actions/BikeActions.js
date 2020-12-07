/* eslint-disable */
const setBike = (bike) => {
  return {
    type:'SET_BIKE',
    payload: bike
  }
}

const setBikes = (bikes) => {
  return {
    type:'SET_BIKES',
    payload: bikes
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
  setBikes,
};
