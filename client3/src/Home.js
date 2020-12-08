import React, {
  useState,
} from 'react';

import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Web3 from 'web3';

import {
  useDispatch,
} from 'react-redux';

import BikeRent from './contracts/BikeRent.json';

import {
  setUserAddress,
  setIsAdmin,
} from './actions/UserActions';

import {
  setContract,
} from './actions/ContractActions';

import Landing from './screens/Landing';
import NavBar from './components/NavBar';
import CreateBikeForm from './components/CreateBikeForm';
import RentBike from './components/RentBike';
import MyBikes from './components/MyBikes';
import MyRentals from './components/MyRentals';

function Home() {
  const dispatch = useDispatch();
  const [ethBrowserError, setEthBrowserError] = useState(null);
  const [ethContractError, setEthContractError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ethereumEnabled, setEthereumEneabled] = useState(false);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // await window.ethereum.enable();
      window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setEthBrowserError('Non-Ethereum browser detected');
    }
  }

  async function loadBlockChainData() {
    const { web3 } = window;
    const accounts = await web3.eth.getAccounts();
    if (!web3.utils.isAddress(accounts[0])) {
      console.log(accounts);
      return;
    }
    dispatch(setUserAddress(accounts[0]));
    const netWorkId = await web3.eth.net.getId();
    const netWorkData = BikeRent.networks[netWorkId];
    if (netWorkData) {
      const bikeRentalInstance = new web3.eth.Contract(BikeRent.abi, netWorkData.address);
      dispatch(setContract(bikeRentalInstance));
      const tempAdminRole = await bikeRentalInstance.methods.DEFAULT_ADMIN_ROLE().call();
      const hasAdminRole = await bikeRentalInstance.methods.hasRole(tempAdminRole, accounts[0]).call();
      dispatch(setIsAdmin(hasAdminRole));
      setEthereumEneabled(true);
      setLoading(false);
    } else {
      setEthContractError('BikeRent not deployed to detected network');
    }
  }

  function enableEthereum() {
    loadWeb3();
    loadBlockChainData();
  }

  return (
    <div className="App">
      {!ethereumEnabled && (
        <div className="container valign-wrapper" style={{ height: '75vh' }}>
          <div className="row">
            <button
              type="button"
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              onClick={enableEthereum}
            >
              Enable ethereum! Ξ
            </button>
          </div>
        </div>
      )}
      {ethBrowserError && (
        <>
          <p>{ ethBrowserError }</p>
        </>
      )}
      {ethContractError && (
        <>
          <p>{ ethContractError }</p>
        </>
      )}
      {loading && (
        <>
          <p>loading ...</p>
        </>
      )}
      {ethereumEnabled && (
        <>
          <Router>
            <NavBar />
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              <Route path="/create-bike">
                <CreateBikeForm />
              </Route>
              <Route path="/rent-bike">
                <RentBike />
              </Route>
              <Route path="/my-bikes">
                <MyBikes />
              </Route>
              <Route path="/my-rentals">
                <MyRentals />
              </Route>
            </Switch>
          </Router>
        </>
      )}
    </div>
  );
}

export default Home;
