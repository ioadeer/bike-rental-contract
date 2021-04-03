
const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
const path = require('path');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
	compilers: {
		solc: {
			version: "0.6.2",
		},
	},
  contracts_build_directory: path.join(__dirname, "client3/src/contracts"),
  //networks: {
  //  development: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*" // Match any network id
  //  }
  //}
  networks: {
    development: {
      host: "127.0.0.1",
      // ganache
      // port: 7545,
      // truffle-develop 
      port: 9545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      // project test-1
     provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/3515c91786994b689bf3c06943f0b22c`),
     network_id: 4,       // Ropsten's id
     gas: 4500000,        // Ropsten has a lower block limit than mainnet
     gasPrice: 40000000000, //10000000000,
     from: "0xd6Ce618f43efc162C57bEDC96541dF8208C6FdD2"
     },
  },
};
