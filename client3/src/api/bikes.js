/* eslint-disable */
import {
  useDispatch,
} from 'react-redux';

import {
  setBike,
} from '../actions/BikeActions';

let dispatch = useDispatch();

export async function fetchBikes(bikeRentalInstance) {
   if (bikeRentalInstance) {
     const bikeCount = await bikeRentalInstance.methods.bikeCount().call();
     const promises = [];
     for (let i = 0; i < bikeCount; i += 1) {
       promises.push(bikeRentalInstance.methods.bikes(i).call());
     }
     Promise.all(promises).then((values) => {
       for (let i = 0; i < values.length; i += 1) {
         dispatch(setBike(values[i]));
       }
     });
   }
 }


