const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Diamond Hands", function () {
  let bob, alice, deployer;
  let diamondsHands;

  before(async function () {
    // accounts = await ethers.getSigners();
    [bob, alice, deployer] = await ethers.getSigners();
  });

  it("Should deploy", async function () {
    const DiamondsHands = await ethers.getContractFactory("Diamond_Hands", deployer);
    diamondsHands = await DiamondsHands.deploy(/* variables del constructor */);

    await diamondsHands.deployed();
  });

  it("Bob Should deposit", async function () {
    diamondsHands = diamondsHands.connect(bob);
    const ONE_ETHER = ethers.utils.parseEther("1");
    
    //save bob wallet balance
    const beforeBalance = await bob.getBalance();
    // bob deposit 1 eth
    await diamondsHands.deposit({ value: ONE_ETHER });
    // get bob wallet balance after deposit
    const afterBalance = await bob.getBalance();
    //verify that bob deposit taking into consideration gas paid
    expect(beforeBalance.sub(afterBalance)).to.above(ONE_ETHER, ethers.utils.parseEther("0.00001"));

    //ask the contract what is bob deposit balance
    const bobBalanceDeposit = await diamondsHands.balanceOf(bob.address);
    //verify that bob deposit 1 eth
    //console.log(bobBalanceDeposit);
    expect(bobBalanceDeposit).to.equal(ONE_ETHER);
  });

  it("Bob Shouldn't withdraw", async function () {
    //let's try to withdra before the 2yr
    await expect(diamondsHands.withdraw()).to.be.revertedWith("You are LOCKED! paper hands");
  });

  it("Bob can withdraw", async function () {
    //machine time - move two years to the future
    await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60 + 1]); // add 2 years
    await ethers.provider.send("evm_mine", []); // mine a block

    //let's withdraw
    await diamondsHands.withdraw();
    expect(await diamondsHands.balanceOf(bob.address)).to.be.equal("0");
    
  });

  it("Check Bob time left", async function () {
    const timeLeft = await diamondsHands.timeLeft(bob.address);
    //console.log(ethers.utils.toString(time));
    console.log(timeLeft.toNumber());
  
    
    await expect(timeLeft.toNumber()).to.be.greaterThan(0);
  

    //machine time - move two years to the future
    //await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60 + 1]); // add 2 years
    //await ethers.provider.send("evm_mine", []); // mine a block
    
  });
});
