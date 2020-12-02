import React, {
  useState,
} from 'react';

import {
  useSelector,
} from 'react-redux';

function CreateBikeForm() {
  const [bikeDescription, setBikeDescription] = useState('');
  const [bikeDescriptionError, setBikeDescriptionError] = useState('');

  const [bikeAvailable, setBikeAvailable] = useState(true);

  const [bikeRentPrice, setBikeRentPrice] = useState('');
  const [bikeRentPriceError, setBikeRentPriceError] = useState('');

  const [collateral, setCollateral] = useState('');
  const [collateralError, setCollateralError] = useState('');

  const createBike = useSelector((state) => state.ContractReducer.methods.createBike);
  const user = useSelector((state) => state.UserReducer.address);

  const [sent, setSent] = useState(false);
  const [successTx, setSuccessTx] = useState(false);
  const [failTx, setFailTx] = useState(false);

  async function submitHandle(e) {
    e.preventDefault();
    let bikeDescValid;
    let bikeRentPriceValid;
    let bikeCollateralValid;
    if (bikeDescription.length <= 5) {
      setBikeDescriptionError('Please insert a valid description');
      bikeDescValid = false;
    } else {
      setBikeDescriptionError('');
      bikeDescValid = true;
    }
    if (bikeRentPrice === '' || Number.isNaN(bikeRentPrice) || bikeRentPrice <= 0) {
      setBikeRentPriceError('Please insert a valid rent price');
      bikeRentPriceValid = false;
    } else {
      setBikeRentPriceError('');
      bikeRentPriceValid = true;
    }
    if (collateral === '' || Number.isNaN(collateral) || collateral <= 0) {
      setCollateralError('Please insert a valid collateral');
      bikeCollateralValid = false;
    } else {
      setCollateralError('');
      bikeCollateralValid = true;
    }
    if (bikeCollateralValid && bikeDescValid && bikeRentPriceValid) {
      createBike(bikeDescription, bikeAvailable, bikeRentPrice, collateral).send({ from: user })
        .once('sent', () => {
          setSent(true);
        })
        .on('error', (error) => {
          console.log(error);
          setSent(false);
          setFailTx(true);
        })
        .on('receipt', (receipt) => {
          setSent(false);
          setSuccessTx(true);
          console.log('Receipt:');
          console.log(receipt);
        })
        .then((rec) => {
          setSent(false);
          setSuccessTx(true);
          console.log('block mined');
          console.log(rec);
          setBikeDescription('');
          setCollateral('');
          setBikeRentPrice('');
        });
      setBikeDescriptionError('');
      setBikeRentPriceError('');
      setCollateralError('');
    }
  }

  return (
    <>
      <div className="row">
        <div className="col s3" />
        <div className="col s6">
          <h3 style={{ textAlign: 'center', paddingBottom: '1em' }}>Register a bike!</h3>
          <form>
            <div className="input-field" style={{ paddingTop: '2em' }}>
              <input
                type="text"
                id="desc"
                value={bikeDescription}
                className={bikeDescriptionError ? 'invalid' : ''}
                onChange={(e) => setBikeDescription(e.target.value)}
              />
              <label htmlFor="desc">Describe the bike:</label>
              { bikeDescriptionError && (
                <span className="red-text">
                  { bikeDescriptionError }
                </span>
              )}
            </div>
            <p style={{ textAlign: 'center', paddingTop: '2em' }}>
              <label htmlFor="isForSale">
                <input
                  type="checkbox"
                  id="isForSale"
                  value={bikeAvailable}
                  onChange={(e) => setBikeAvailable(e.target.value)}
                />
                <span>
                  Is it for rent?
                </span>
              </label>
            </p>
            <br />
            <div className="input-field col s11" style={{ paddingTop: '2em', marginLeft: '-10px' }}>
              <input
                type="number"
                id="rentPrice"
                min="1"
                value={bikeRentPrice}
                className={bikeRentPriceError ? 'invalid' : ''}
                onChange={(e) => setBikeRentPrice(e.target.value)}
                required
              />
              <label htmlFor="rentPrice">
                Bike rental price
              </label>
              { bikeRentPriceError && (
                <span className="red-text">
                  { bikeRentPriceError }
                </span>
              )}
            </div>
            <div className="col s1">
              <h2>Ξ</h2>
            </div>
            <br />
            <div className="input-field col s11" style={{ paddingTop: '2em', marginLeft: '-10px' }}>
              <input
                type="number"
                id="collateral"
                value={collateral}
                className={collateralError ? 'invalid' : ''}
                onChange={(e) => setCollateral(e.target.value)}
                required
              />
              <label htmlFor="collateral">
                Bike rental collateral
              </label>
              { collateralError && (
                <span className="red-text">
                  { collateralError }
                </span>
              )}
            </div>
            <div className="col s1">
              <h2>Ξ</h2>
            </div>
            <br />
            <div className="col s12" style={{ paddingTop: '2em', display: 'flex', justifyContent: 'center' }}>
              <button
                className="btn waves-effect waves-light"
                onClick={submitHandle}
                type="submit"
              >
                Register bike
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
        <div className="col s3" />
      </div>
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
