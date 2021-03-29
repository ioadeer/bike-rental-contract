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

  describe('bike creation and rental', () => {

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

    it('creates bike emmits event', async () => {
      // Success
      assert.equal(registeredBikesCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), 1, 'First created bike id is one');
      assert.equal(event.description, 'Mountain bike', 'Description is correct');
      assert.isBoolean(event.available, 'Bike availability should be boolean');
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

    it('lists bikes on public uint bikes mapping', async () => {
      // fetch first created bike
      const bike = await bikeRentInstance.bikes(1);
      assert.equal(bike.id.toNumber(), 1, 'Bike id for first created bike should be one');
      assert.equal(bike.description, 'Mountain bike', 'Bike description is correct');
      assert.equal(bike.owner, renter, 'Bike owner is renter');
      assert.equal(bike.rentPrice, web3.utils.toWei('1', 'Ether'),'Bike rent price is correct');
      assert.equal(bike.collateral, 
                   web3.utils.toWei('1', 'Ether'),
                   'Bike rental collateral price is correct');
    });

    it('rents bike, emmits event, locks collateral and creates bike rent struct mapping', async () => {
      // FAILURE 
      // transaction should cover rent price and collateral  
      await bikeRentInstance.rentBike(1, 
                                     { from: rentee, value: web3.utils.toWei('1', 'Ether')}
                                     ).should.be.rejected;

      // transaction should not exceed rent price and collateral  
      await bikeRentInstance.rentBike(1, 
                                     { from: rentee, value: web3.utils.toWei('3', 'Ether')}
                                     ).should.be.rejected;
      // renter should not be allowed to rent his own bike 
      await bikeRentInstance.rentBike(1, 
                                     { from: renter, value: web3.utils.toWei('2', 'Ether')}
                                     ).should.be.rejected;
      // bike to be rented should exist 
      await bikeRentInstance.rentBike(99, 
                                     { from: renter, value: web3.utils.toWei('2', 'Ether')}
                                     ).should.be.rejected;

      let initialRenterBalance, finalRenterBalance;

      initialRenterBalance = await web3.eth.getBalance(renter);
      initialRenterBalance = new web3.utils.BN(initialRenterBalance);
      
      // SUCCESS
      result = await bikeRentInstance.rentBike(1, { from: rentee, value: web3.utils.toWei('2', 'Ether')});

      // Bike rented event
      const event = result.logs[0].args;
      assert.equal(event.renter, renter, 'Renter address should be logged in event');
      assert.equal(event.rentee, rentee, 'Rentee address should be logged in event');
      assert.equal(event.bike_id, 1, 'Rike rented event should log bike id');
      assert.equal(event.rentPrice,
                   web3.utils.toWei('1','Ether'), 
                   'Rental price is correct'
                  );
      assert.equal(event.collateral,
                   web3.utils.toWei('1','Ether'), 
                   'Collateral price is correct'
                  );

      // check that renter received balance
      finalRenterBalance = await web3.eth.getBalance(renter);
      finalRenterBalance = new web3.utils.BN(finalRenterBalance);

      let price;
      price = web3.utils.toWei('1', 'Ether');
      price = new web3.utils.BN(price);

      const expectedBalance = initialRenterBalance.add(price);

      assert.equal(finalRenterBalance.toString(), expectedBalance.toString());

      // retrieve bike rental from mapping
      const bikeRental = await bikeRentInstance.bikeRentals(1);
      assert.equal(bikeRental.id.toNumber(), 1, 'Id for first created bike rental should be one');
      assert.equal(bikeRental.renter, renter, 'Bike rental renter should be bike renter'); 
      assert.equal(bikeRental.rentee, rentee, 'Bike rental rentee should be bike rentee'); 
      assert.equal(bikeRental.bike_id, 1, 'Rented bike_id should be first created bike');
      assert.equal(
                  bikeRental.rentPrice, 
                  web3.utils.toWei('1', 'Ether'), 
                  'Stored rental price is correct'
                  );
      assert.equal(
                  bikeRental.rentPrice, 
                  web3.utils.toWei('1', 'Ether'), 
                  'Stored collateral is correct'
                  );
      assert.isFalse(bikeRental.renterReturnApproval, 'Renter return approval should be initially false');
      assert.isFalse(bikeRental.renteeReturnApproval, 'Rentee return approval should be initially false');

      // check collateral stored during bike rental transaction
      let lockedRenteeLockedCollateral = await bikeRentInstance.lockedCollateral(rentee);
      let expectedRenteeLockedCollateral = new web3.utils.BN(web3.utils.toWei('1', 'Ether'));

      assert.equal(
                  lockedRenteeLockedCollateral.toString(), 
                  expectedRenteeLockedCollateral.toString(),
                  'Locked rentee collateral should equal collateral sent on transaction'
                  );
      // Failure after rental before return
      // bike should not be available after rental
      await await bikeRentInstance.rentBike(1, 
                                     { from: rentee, value: web3.utils.toWei('2', 'Ether')}
                                     ).should.be.rejected;
    });
  });

  describe('bike returned', () => {
    it('returns bikes with renter approval and then rentee approval', async () => {
      // FIRST: renter return approval
      // FAILURE 
      // Renter return approve should be sent by renter
      await await bikeRentInstance.renterReturnApprove(1, 
                                     { from: rentee }
                                     ).should.be.rejected;

      // SUCCESS
      await bikeRentInstance.renterReturnApprove(1, 
                                  { from: renter }
                                  );

      let bikeRental  = await bikeRentInstance.bikeRentals(1);
      assert.isTrue(bikeRental.renterReturnApproval, 'Renter return approval should be true');

      // should be rejected once renter approval is true
      await await bikeRentInstance.renterReturnApprove(1, 
                                  { from: renter }
                                  ).should.be.rejected;

      // only rentee can aprove renteeReturnApprove
      await await bikeRentInstance.renteeReturnApprove(1, 
                                                  { from: renter}
                                                  ).should.be.rejected;
      // SUCCESS: rentee return emmits event
      let result = await bikeRentInstance.renteeReturnApprove(1, 
                                                  { from: rentee }
                                                  );
      // should be rejected once rentee approval is true
      await await bikeRentInstance.renteeReturnApprove(1, 
                                                  { from: rentee }
                                                  ).should.be.rejected;
      // Should emmit event
      const event = result.logs[0].args;
      assert.equal(event.renter, renter, 'Renter address should be logged in event');
      assert.equal(event.rentee, rentee, 'Rentee address should be logged in event');
      assert.equal(event.bike_id, 1, 'Rike rented event should log bike id');
    });

  });
});

