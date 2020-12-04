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
  setBike,
} from './actions/BikeActions';

import {
  setContract,
} from './actions/ContractActions';

import NavBar from './components/NavBar';
import CreateBikeForm from './components/CreateBikeForm';
import RentBike from './components/RentBike';

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
      // window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setEthBrowserError('Non-Ethereum browser detected');
    }
  }

  async function fetchBikes(bikeRentalInstance) {
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
      fetchBikes(bikeRentalInstance);
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
              <Route path="/create-bike">
                <CreateBikeForm />
              </Route>
              <Route path="/rent-bike">
                <RentBike />
              </Route>
            </Switch>
          </Router>
        </>
      )}
    </div>
  );
}

export default Home;

/*
      {adminRole && (
        <AdminRole
          tutorialToken={tutorialToken}
          minterRoleKey={minterRoleKey}
          burnerRoleKey={burnerRoleKey}
          adminAddress={account}
        />
      )}
*/
