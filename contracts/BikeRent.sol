//pragma solidity >= 0.4.24 <= 0.7.0;
pragma solidity ^0.6.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

//https://docs.openzeppelin.com/contracts/3.x/erc20

contract BikeRent is AccessControl {

 using SafeMath for uint256;

 uint public bikeCount;
 uint public bikeRentalsCount;
 mapping(uint => Bike) public bikes;
 mapping(uint => BikeRental) public bikeRentals;
 mapping(address => uint256) public lockedCollateral;
 uint contractInsuranceFunds;
 uint insurancePercentage = 10;

 struct Bike {
   uint id;
   string description;
   address payable owner;
   bool available;
   uint256 rentPrice;
   uint256 collateral;
 }
 
 struct BikeRental {
   uint id;
   address payable renter;
   address payable rentee;
   uint bike_id;
   uint256 rentPrice;
   uint256 collateral;
   bool renterReturnApproval;
   bool renteeReturnApproval;
 }

 event BikeCreation (
   uint id,
   string description,
   address owner,
   bool available,
   uint256 rentPrice,
   uint256 collateral
 );

 event BikeRented (
   address renter,
   address rentee,
   uint bike_id,
   uint256 rentPrice,
   uint256 collateral
 );

 event BikeReturned (
   address renter,
   address rentee,
   uint bike_id
 );

 event CollateralReturned (
   uint collateral,
   address rentee
 );

 constructor() public payable{
     _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
 }

 function getBalance() public view returns (uint256) {
   return address(this).balance;
 }

 function deposit(uint256 amount) payable public{
   require(msg.value == amount);
 }

 function withdrawToAccount(address payable to, uint256 amount) public onlyAdmin {
   require(address(this).balance > amount, "Not enough funds in contract");
   to.transfer(amount);
 }

 function createBike(
   string memory _description, 
   bool _available, 
   uint256 _rentPrice,
   uint256 _collateral
 ) public {
   // require valid name
   require(bytes(_description).length > 0 , "Bike must have description");
   // require a rent price
   require(_rentPrice > 0, "Bike must have a rent price");
   // require a collateral
   require(_collateral> 0, "Bike must have a collateral");
   // increase bike count 
   bikes[bikeCount] = Bike(bikeCount, _description, msg.sender, _available, _rentPrice, _collateral);
   emit BikeCreation(bikeCount,_description, msg.sender, _available, _rentPrice, _collateral);
   bikeCount ++;
 }

 function rentBike(uint _id) public payable {
   // fetch bike
   Bike memory _bike = bikes[_id];
   // check if bike is available for rent 
   require(_bike.available, "Oops, bike is not available");
   // check if transaction can cover collateral and rent price
   require(msg.value == _bike.rentPrice.add(_bike.collateral), "Insufficient funds");
   // fetch owner
   address payable _renter = _bike.owner;
   // check that renter is not rentee
   require(_renter != msg.sender, "You cant't rent your own bike!");
   // transfer collateral
   uint256 collateral = uint256(msg.value).sub(_bike.rentPrice);
   uint256 addressCollateral = lockedCollateral[address(msg.sender)];
   lockedCollateral[address(msg.sender)] = collateral.add(addressCollateral);
   uint256 rentPrice = uint256(msg.value).sub(_bike.collateral);
   _renter.transfer(rentPrice);
   _bike.available = false;
   bikes[_id] = _bike;
   bikeRentals[bikeRentalsCount] = BikeRental(
                                              bikeRentalsCount,
                                              _renter,
                                              msg.sender,
                                              _bike.id,
                                              _bike.rentPrice,
                                              _bike.collateral,
                                              false,
                                              false
                                              ); 
   bikeRentalsCount++;
   emit BikeRented(_renter, msg.sender, _bike.id, _bike.rentPrice, _bike.collateral);
 }

 function renterReturnApprove(uint _id) public returns (bool) {
   BikeRental memory _bikeRental = bikeRentals[_id];
   // require renter to be msg.sender
   require(_bikeRental.renter == msg.sender, "Only renter may approve this");
   // check if approval is not already stated
   require(!_bikeRental.renterReturnApproval, "Approval already stated");
   _bikeRental.renterReturnApproval = true;
   bikeRentals[_id] = _bikeRental;
   if( _bikeRental.renterReturnApproval && _bikeRental.renteeReturnApproval) {
     Bike memory _bike = bikes[_bikeRental.bike_id];
     _bike.available = true; 
     bikes[_bikeRental.bike_id] = _bike;
     emit BikeReturned(
                      _bikeRental.renter,
                      _bikeRental.rentee,
                      _bikeRental.bike_id
                      );
   }
   return true;
 }

 function renteeReturnApprove(uint _id) public returns (bool) {
   BikeRental memory _bikeRental = bikeRentals[_id];
   require(_bikeRental.rentee == msg.sender, "Only rentee may approve this");
   // check if approval is not already stated
   require(!_bikeRental.renteeReturnApproval, "Approval already stated");
   _bikeRental.renteeReturnApproval = true;
   bikeRentals[_id] = _bikeRental;
   if( _bikeRental.renterReturnApproval && _bikeRental.renteeReturnApproval) {
     Bike memory _bike = bikes[_bikeRental.bike_id];
     _bike.available = true; 
     bikes[_bikeRental.bike_id] = _bike;
     emit BikeReturned(
                      _bikeRental.renter,
                      _bikeRental.rentee,
                      _bikeRental.bike_id
                      );
   }
   return true;
 }

 function claimCollateral (uint _id) public {
   BikeRental memory _bikeRental = bikeRentals[_id];
   require(_bikeRental.renterReturnApproval, "Renter must approve return");
   require(_bikeRental.renteeReturnApproval, "Rentee must approve return");
   require(_bikeRental.rentee == msg.sender, "Only rentee can claim collateral"); 
   // fetch rentee 
   address payable _rentee = _bikeRental.rentee;
   // calculate collateral for insurance use
   uint256 insuranceCollateral = _bikeRental.collateral.mul(insurancePercentage).div(100);
   // calculate collateral to be returned
   uint256 returnedCollateral = _bikeRental.collateral.sub(insuranceCollateral);
   // get address total collateral
   uint256 addressTotalCollateral = lockedCollateral[address(msg.sender)];
   // set address new total collateral
   lockedCollateral[address(msg.sender)] = addressTotalCollateral.sub(returnedCollateral);
   // transfer claimed collateral
   _rentee.transfer(returnedCollateral); 
   emit CollateralReturned(returnedCollateral, _rentee);
 }

 modifier onlyAdmin(){
   require(
     hasRole(
       DEFAULT_ADMIN_ROLE, 
       msg.sender
     ),
     "Only admin can call this"
   );
   _;
 }

}
