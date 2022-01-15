// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
/*
Ethernaut challenges
https://github.com/ethernautdao/challenges
Challenge 1 - Diamond Hands
*/
import "hardhat/console.sol";

contract Diamond_Hands {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTime;
    
    event Deposit(address account, uint256 amount);
    event Withdraw(address account, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "manda algo amigo");
        //we store how much was deposit
        balances[msg.sender] += msg.value;
        //we need to store when the deposit was made (date and time)
        depositTime[msg.sender] = block.timestamp;
        
        emit Deposit(msg.sender, msg.value);
    }
    //returns the balance of the user
    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }
    //returns time left to unlock funds
    function timeLeft(address account) public view returns (uint){
        //console.log(depositTime[account] + 730 days);
        if (block.timestamp >= depositTime[msg.sender] + 730 days) {
            console.log("you are lock");
            //calculate how many days left
            uint time = (depositTime[account]+ 730 days - block.timestamp);
            return time;
        } else {
            console.log("you are unlcoked");
            return 0;
        }
    }
    function withdraw() public {
        //check to see if 2yr has passed
        require(block.timestamp >= depositTime[msg.sender] + 730 days,"You are LOCKED! paper hands");
        
        // get the balance of who called the function
        uint amount = balances[msg.sender];
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit Withdraw(msg.sender, amount);
    }
}