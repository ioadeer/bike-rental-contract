import React, {
  useState,
  useEffect,
} from 'react';
import Web3 from 'web3';

import {
  useDispatch,
  useStore,
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
import AdminRole from './components/AdminRole';
import CreateBikeForm from './components/CreateBikeForm';

function Home() {
  const dispatch = useDispatch();
  const user = useStore((store) => store.user);
  const [ethBrowserError, setEthBrowserError] = useState(null);
  const [ethContractError, setEthContractError] = useState(null);
  const [account, setAccount] = useState(null);
  const [bikeRentalContract, setBikeRentalContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(false);
  const [init, setInit] = useState(false);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
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
    setAccount(accounts[0]);
    dispatch(setUserAddress(accounts[0]));
    const netWorkId = await web3.eth.net.getId();
    const netWorkData = BikeRent.networks[netWorkId];
    if (netWorkData) {
      const bikeRentalInstance = new web3.eth.Contract(BikeRent.abi, netWorkData.address);
      setBikeRentalContract(bikeRentalInstance);
      dispatch(setContract(bikeRentalInstance));
      const { _address } = bikeRentalInstance;
      const tempAdminRole = await bikeRentalInstance.methods.DEFAULT_ADMIN_ROLE().call();
      const hasAdminRole = await bikeRentalInstance.methods.hasRole(tempAdminRole, accounts[0]).call();
      dispatch(setIsAdmin(hasAdminRole));
      setAdminRole(hasAdminRole);
      setContractAddress(_address);
      fetchBikes(bikeRentalInstance);
      setLoading(false);
    } else {
      setEthContractError('BikeRent not deployed to detected network');
    }
  }

  useEffect(() => {
    if (!init) {
      loadWeb3();
      loadBlockChainData();
      setInit(true);
    }
    return () => {
      console.log('Desmontando blockchain ...');
    };
  }, [init]);

  // useEffect(() => {
  //   if (init) {
  //     fetchBikes();
  //   }
  //   return () => {
  //   };
  // }, [init]);

  return (
    <div className="App">
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
      {!loading && (
        <>
          <NavBar
            contractAddress={contractAddress}
          />
          <CreateBikeForm />
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
