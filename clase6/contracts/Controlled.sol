pragma solidity ^0.5.0;

contract Controlled {

    address controller;

    modifier onlyController() {
        require(controller == msg.sender);
        _;
    }

    constructor() public {
        controller = msg.sender;
    }

    function changeController(address _newController) public onlyController {
        controller = _newController;
    }
}