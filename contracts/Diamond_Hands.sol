// SPDX-License-Identifier: MIT
/*
Ethernaut challenges
https://github.com/ethernautdao/challenges
Challenge 1 - Diamond Hands

Objectives
Build a diamond hands contract that allows users to deposit ETH. Every time they deposit ETH, it will be locked for two years.
After two years, they will be able to withdraw the ETH.
Your implementation should run unit tests on the contract, and actually confirm all of its functionality.
*/
pragma solidity ^0.8.10;

//import "hardhat/console.sol";

contract Dimannd_Hands {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTime;
    
    event Deposit(address account, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "manda algo amigo");
        // who
        // msg.sender
        // how much
        // msg.value
        balances[msg.sender] += msg.value;

        //we need to store when the deposit was made (date and time)
        depositTime[msg.sender] = block.timestamp;
        // current time = block.timestamp
        
        emit Deposit(msg.sender, msg.value);
    }

    //returns the balance of the user
    function balanceOf() public view returns (uint) {
        return balances[msg.sender] ;
    }

    function withdraw() public {
        //check to see if 2yr has passed
        require(block.timestamp >= depositTime[msg.sender] + 730 days,"You are LOCKED! paper hands");
        
        // get the balance of who called the function
        uint amount = balances[msg.sender];
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}