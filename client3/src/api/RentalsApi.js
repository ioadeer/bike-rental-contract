/* eslint-disable */
import store from '../store';

import {
  setRentals,
} from '../actions/RentalActions';

export async function fetchRentals(bikeRentalInstance) {
  if (bikeRentalInstance) {
    const bikeRentalsCount = await bikeRentalInstance.methods.bikeRentalsCount().call();
    const promises = [];
    for (let i = 1; i <= bikeRentalsCount; i += 1) {
      promises.push(bikeRentalInstance.methods.bikeRentals(i).call());
    }
    Promise.all(promises).then((values) => {
      // for (let i = 0; i < values.length; i += 1) {
      //   store.dispatch(setBike(values[i]));
      // }
      store.dispatch(setRentals(values));
    });
  }
}

export async function fetchUserRentals(bikeRentalInstance, userAddress) {
  if (bikeRentalInstance) {
    let userRentalsIndexes = [];
    userRentalsIndexes = await bikeRentalInstance
                                   .methods
                                   .getAccountsRentals(userAddress)
                                   .call();
    const foundRentalsIndexes = userRentalsIndexes.filter((rental) => rental.toString() !== '0');
    const promises = [];
    for (let i = 0; i < foundRentalsIndexes.length; i += 1) {
      promises.push(bikeRentalInstance.methods.bikeRentals(foundRentalsIndexes[i]).call());
    }
    Promise.all(promises).then((values) => {
      // for (let i = 0; i < values.length; i += 1) {
      //   store.dispatch(setBike(values[i]));
      // }
      store.dispatch(setRentals(values));
    });
  }
}
