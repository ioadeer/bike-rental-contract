import React, {
  useState,
} from 'react';

import {
  useSelector,
} from 'react-redux';

function CreateBikeForm() {
  const [bikeDescription, setBikeDescription] = useState('');
  const [bikeAvailable, setBikeAvailable] = useState(true);
  const [bikeRentPrice, setBikeRentPrice] = useState('');
  const [collateral, setCollateral] = useState('');
  const createBike = useSelector((state) => state.ContractReducer.methods.createBike);
  const user = useSelector((state) => state.UserReducer.address);

  const [sent, setSent] = useState(false);
  const [successTx, setSuccessTx] = useState(false);
  const [failTx, setFailTx] = useState(false);

  async function submitHandle(e) {
    e.preventDefault();
    createBike(bikeDescription, bikeAvailable, bikeRentPrice, collateral).send({ from: user })
      .once('sent', () => {
        setSent(true);
      })
      .on('error', (error) => {
        console.log(error);
        setSent(false);
        setFailTx(true);
      })
      .on('confirmation', (receipt) => {
        setSent(false);
        setSuccessTx(true);
        console.log('Receipt:');
        console.log(receipt);
      })
      .then((rec) => {
        console.log('block mined');
        console.log(rec);
      });
  }

  return (
    <>
      <h3>Register a bike!</h3>
      <form>
        <label htmlFor="desc">
          Describe the bike:
          <input
            type="text"
            id="desc"
            value={bikeDescription}
            onChange={(e) => setBikeDescription(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="isForSale">
          Is it for sale?
          <input
            type="checkbox"
            id="isForSale"
            value={bikeAvailable}
            onChange={(e) => setBikeAvailable(e.target.value)}
            checked
          />
        </label>
        <br />
        <label htmlFor="rentPrice">
          Bike rental price
          <input
            type="number"
            id="rentPrice"
            min="1"
            value={bikeRentPrice}
            onChange={(e) => setBikeRentPrice(e.target.value)}
          />
          Ξ
        </label>
        <br />
        <label htmlFor="collateral">
          Bike rental collateral
          <input
            type="number"
            id="collateral"
            min="1"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
          />
          Ξ
        </label>
        <br />
        <button onClick={submitHandle} type="submit">Register bike</button>
      </form>
      { sent && (
        <div style={{ position: 'fixed', bottom: '10px' }}>
          <p>
            Sent!
          </p>
        </div>
      )}
      { successTx && (
        <div style={{ position: 'fixed', bottom: '10px' }}>
          <p>
            Successful transaction!
          </p>
        </div>
      )}
      { failTx && (
        <div style={{ position: 'fixed', bottom: '10px' }}>
          <p>
            Failure during transaction!
          </p>
        </div>
      )}
    </>
  );
}

export default CreateBikeForm;
