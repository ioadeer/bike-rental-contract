const BikeRent = artifacts.require("BikeRent");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('BikeRent', ([deployer, renter, rentee]) => {
  
  let bikeRentInstance;

  before( async() => {
    bikeRentInstance = await BikeRent.deployed();
  });

  describe('deployment', () => {
    it('deploys successfully', () => {
      const address = bikeRentInstance.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe('bike', () => {

    let registeredBikesCount, result;
    // Register/Create bike in blockchain
    before( async() => {
      result = await bikeRentInstance.createBike('Mountain bike',
                                                 true, 
                                                 web3.utils.toWei('1', 'Ether'), 
                                                 web3.utils.toWei('1', 'Ether'), 
                                                 { from: renter});
      registeredBikesCount = await bikeRentInstance.bikeCount();
    });

    it('creates bike', async () => {
      // Success
      assert.equal(registeredBikesCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), 0, 'First created bike id is zero');
      assert.equal(event.description, 'Mountain bike', 'Description is correct');
      assert.equal(event.available, true, 'Bike should be available on creation');
      assert.equal(event.rentPrice, web3.utils.toWei('1', 'Ether'),'Bike rent price is correct');
      assert.equal(event.collateral, 
                   web3.utils.toWei('1', 'Ether'),
                   'Bike rental collateral price is correct');
      assert.equal(event.owner, renter, 'owner is correct'); 
      // Failure
      // bike must have a name
      await await bikeRentInstance.createBike('',
                                        true, 
                                        web3.utils.toWei('1', 'Ether'), 
                                        web3.utils.toWei('1', 'Ether'), 
                                        { from: renter}
                                        ).should.be.rejected;
      // bike must have a rent price 
      await await bikeRentInstance.createBike('',
                                        true, 
                                        web3.utils.toWei('0', 'Ether'), 
                                        web3.utils.toWei('1', 'Ether'), 
                                        { from: renter}
                                        ).should.be.rejected;
      // bike must have a collateral price 
      await await bikeRentInstance.createBike('',
                                        true, 
                                        web3.utils.toWei('1', 'Ether'), 
                                        web3.utils.toWei('0', 'Ether'), 
                                        { from: renter}
                                        ).should.be.rejected;
    });
    it('lists bikes', async () => {
      // fetch first created bike
      const bike = await bikeRentInstance.bikes(0);
      assert.equal(bike.id.toNumber(), 0, 'Bike id for first created bike should be zero');
      assert.equal(bike.description, 'Mountain bike', 'Bike description is correct');
      assert.equal(bike.owner, renter, 'Bike owner is renter');
      assert.equal(bike.rentPrice, web3.utils.toWei('1', 'Ether'),'Bike rent price is correct');
      assert.equal(bike.collateral, 
                   web3.utils.toWei('1', 'Ether'),
                   'Bike rental collateral price is correct');
    });
    it('rents bikes', async () => {
      let initialRenterBalance, finalRenterBalance;
      let lockedCollateral;

      initialRenterBalance = await web3.eth.getBalance(renter);
      initialRenterBalance = new web3.utils.BN(initialRenterBalance);

      // SUCCESS
      result = await bikeRentInstance.rentBike(0, { from: rentee, value: web3.utils.toWei('2', 'Ether')});

      const event = result.logs[0].args;
      assert.equal(event.renter, renter, 'Renter address should be logged in event');
      assert.equal(event.rentee, rentee, 'Rentee address should be logged in event');
      assert.equal(event.bike_id, 0, 'Rike rented event should log bike id');
      assert.equal(event.rentPrice,
                   web3.utils.toWei('1','Ether'), 
                   'Rental price is correct'
                  );
      assert.equal(event.collateral,
                   web3.utils.toWei('1','Ether'), 
                   'Collateral price is correct'
                  );
    });
  });
});
