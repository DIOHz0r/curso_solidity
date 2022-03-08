pragma solidity ^0.5.0;

import "./Controlled.sol";
import "./Controller.sol";

contract Token is Controlled {

    // balance de cuentas - token
    mapping(address => uint256) public balances;
    // maxima cantidad de tokens
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        controller = msg.sender;
    }

    function balanceOf(address owner) constant returns (uint256 balance){
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) returns (bool success) {
        return realTransfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        return realTransfer(_from, _to, _value);
    }

    function realTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        if (_value == 0) return true;
        require((_to != 0) && (_to != address(this)));

        uint256 previousBalanceFrom = balanceOf(_from);
        if (previousBalanceFrom < _value) {
            return false;
        }
        balances[_from] = balances[_from] - _value;

        uint256 previousBalanceTo = balanceOf(_from);
        require(balances[_to] + _value > previousBalanceTo);
        balances[_to] = balances[_to] + _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    function generateTokens(address _owner, uint256 _amount) onlyController returns (bool) {
        uint256 currentTotalSupply = totalSupply;
        require(currentTotalSupply + _amount >= totalSupply);

        uint256 previousBalanceTo = balanceOf(_owner);
        require(previousBalanceTo + _amount > previousBalanceTo);

        totalSupply = currentTotalSupply + _amount;
        balances[_owner] = previousBalanceTo + _amount;
        emit Transfer(0, _owner, _amount);

        return true;
    }

    function() payable {
        Controller contr = Controller(controller);
        require(contr.proxyPayment.value(msg.value)(msg.sender));
    }
}
