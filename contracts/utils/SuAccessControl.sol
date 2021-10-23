// SPDX-License-Identifier: MIT
/*
      /$$$$$$            /$$$$$$$   /$$$$$$   /$$$$$$
     /$$__  $$          | $$__  $$ /$$__  $$ /$$__  $$
    | $$  \__/ /$$   /$$| $$  \ $$| $$  \ $$| $$  \ $$
    |  $$$$$$ | $$  | $$| $$  | $$| $$$$$$$$| $$  | $$
     \____  $$| $$  | $$| $$  | $$| $$__  $$| $$  | $$
     /$$  \ $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$
    |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$  | $$|  $$$$$$/
     \______/  \______/ |_______/ |__/  |__/ \______/

*/
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuAccessControl is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /**
    * @dev Initializes the contract setting the deployer as the initial owner.
    */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOwner != address(0), "Ownable: new owner is the zero address");

        if (hasRole(MINTER_ROLE, msg.sender)) {
            grantRole(MINTER_ROLE, newOwner);
            revokeRole(MINTER_ROLE, msg.sender);
        }

        if (hasRole(PAUSER_ROLE, msg.sender)) {
            grantRole(PAUSER_ROLE, newOwner);
            revokeRole(PAUSER_ROLE, msg.sender);
        }

        if (hasRole(BURNER_ROLE, msg.sender)) {
            grantRole(BURNER_ROLE, newOwner);
            revokeRole(BURNER_ROLE, msg.sender);
        }

        grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
