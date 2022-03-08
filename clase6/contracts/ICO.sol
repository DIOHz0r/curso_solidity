pragma solidity ^0.5.0;

import "./Controller.sol";
import "./Token.sol";

contract ICO is Controller {

    uint256 constant public limit = 200 ether;
    uint256 constant public equivalence = 230;
    uint256 public totalCollected;
    address happyOwner = 0x312dae574c8dad3828;

    Token tokens;

    constructor() {
        totalCollected = 0;
    }

    function initToken(address _token, address _destiny) onlyController {
        require(address(tokens) == 0x0);
        tokens = Token(_token);
        require(tokens.totalSupply() == 0);
        require(tokens.controller() == address(this));
        happyOwner = _destiny;
    }

    function realBuy(address _sender, uint _amount) public returns (bool){
        uint256 tokensGenerated = _amount * equivalence;
        require(totalCollected + _amount <= limit);
        assert(tokens.generateTokens(_sender, tokensGenerated));
        happyOwner.transfer(_amount);

        totalCollected = totalCollected + _amount;
        return true;
    }

    function proxyPayment(address _dir) payable returns (bool){
        return realBuy(_dir, msg.value);
    }
}