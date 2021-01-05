/* eslint-disable */

import store from '../store';

import {
  setBike,
  setBikes,
} from '../actions/BikeActions';

export async function fetchBikes(bikeRentalInstance) {
  if (bikeRentalInstance) {
    const bikeCount = await bikeRentalInstance.methods.bikeCount().call();
    const promises = [];
    for (let i = 1; i <= bikeCount; i += 1) {
      promises.push(bikeRentalInstance.methods.bikes(i).call());
    }
    Promise.all(promises).then((values) => {
      // for (let i = 0; i < values.length; i += 1) {
      //   store.dispatch(setBike(values[i]));
      // }
      store.dispatch(setBikes(values));
    });
  }
}

export async function fetchUserBikes(bikeRentalInstance, userAddress) {
  if (bikeRentalInstance) {
    let userBikesIndexes = [];
    userBikesIndexes = await bikeRentalInstance
                                   .methods
                                   .getAccountsRegisteredBikes(userAddress)
                                   .call();
    const foundBikesIndexes = userBikesIndexes.filter((bike) => bike.toString() !== '0');
    const promises = [];
    for (let i = 0; i < foundBikesIndexes.length; i += 1) {
      promises.push(bikeRentalInstance.methods.bikes(foundBikesIndexes[i]).call());
    }
    Promise.all(promises).then((values) => {
      // for (let i = 0; i < values.length; i += 1) {
      //   store.dispatch(setBike(values[i]));
      // }
      store.dispatch(setBikes(values));
    });
  }
}
