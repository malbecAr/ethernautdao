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
    const DiamondsHands = await ethers.getContractFactory("Dimannd_Hands", deployer);
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
    const bobBalanceDeposit = await diamondsHands.balanceOf();
    //verify that bob deposit 1 eth
    //console.log(bobBalanceDeposit);
    expect(bobBalanceDeposit).to.equal(ONE_ETHER);
  });

  it("Bob Shouldn't withdraw", async function () {
    const ONE_ETHER = ethers.utils.parseEther("1");
    
    //let's try to withdra before the 2yr
    await expect(diamondsHands.withdraw()).to.be.revertedWith("You are LOCKED! paper hands");

  });

  it("Bob should withdraw", async function () {
 
    //machine time - move two years to the future
    await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60]); // add 2 years
    await ethers.provider.send("evm_mine", []); // mine a block

    //let's withdraw
    await diamondsHands.withdraw();

    const bobBalanceDeposit = await diamondsHands.balanceOf();
    //verify that bob deposit 1 eth
    //console.log(bobBalanceDeposit);
    const ONE_ETHER = ethers.utils.parseEther("1");
    expect(bobBalanceDeposit).to.equal(ONE_ETHER);
    //const bobBalanceDeposit = await diamondsHands.balanceOf(bob.address);
    //expect(await diamondsHands.balanceOf()).to.be.equal("0");

  });


/*
  it("Bob Shouldt withdraw", async function () {
    const ONE_ETHER = ethers.utils.parseEther("1");
    
    await expect(diamondHands.withdraw(ONE_ETHER)).to.be.revertedWith("You are LOCKED! paper hands");

    await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60]); // add 2 years
    await ethers.provider.send("evm_mine", []); // add 2 years

    await expect(diamondHands.withdraw(ONE_ETHER)).to.be.revertedWith("Not enough balance");



    const bobBalanceDeposit = await diamondsHands.balanceOf(bob.address);
    await expect(diamondHands.withdraw(bobBalanceDeposit));
    expect(await diamondsHands.balanceOf(bob.address)).to.be.equal("0");

    // await expect(diamondHands.withdrawAll()).to.be.revertedWith("Not enough balance");
  });

  it("Alice Should deposit&withdrawAll", async function () {
    diamondsHands = diamondsHands.connect(alice);
    const ONE_ETHER = ethers.utils.parseEther("1");
    
    const beforeBalance = await alice.getBalance();
    await diamondsHands.deposit({ value: ONE_ETHER });
    const afterBalance = await alice.getBalance();
    expect(beforeBalance.sub(afterBalance)).to.above(ONE_ETHER, ethers.utils.parseEther("0.00001"));

    await ethers.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60]); // add 4 years
    await ethers.provider.send("evm_mine", []); // add 4 years

    // redeposito resetea tiempo
    await diamondsHands.deposit({ value: ONE_ETHER });

    await expect(diamondHands.withdraw(ONE_ETHER)).to.be.revertedWith("You are LOCKED! paper hands");
    await expect(diamondHands.withdrawAll()).to.be.revertedWith("You are LOCKED! paper hands");

    await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []); 

    await diamondHands.withdrawAll();
    expect(await diamondsHands.balanceOf(alice.address)).to.be.equal("0");

  });
*/
});
