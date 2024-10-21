// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FundToken is ERC20, Ownable {
    uint256 public tokenPrice = 0.00001 ether;

    constructor(uint256 initialSuppy) ERC20("Blackrock", "BLK") Ownable(msg.sender) {
        _mint(msg.sender, initialSuppy * 10 ** decimals());
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some Ether to buy tokens.");
        uint256 amountToBuy = msg.value /tokenPrice;
        require(balanceOf(owner()) >= amountToBuy, "Not enough tokens available for sale.");
        _transfer(owner(), msg.sender, amountToBuy);
    }

    function sellTokens(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");
        uint256 etherAmount = amount * tokenPrice;
        require(address(this).balance >= etherAmount, "Contract does not have enough Ether.");
        _transfer(msg.sender, owner(), amount);
        payable(msg.sender).transfer(etherAmount);
    }

    function setTokenPrice(uint256 newPrice) public onlyOwner {
        tokenPrice = newPrice;
    }
}