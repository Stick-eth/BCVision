// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiplomaRegistry {
    mapping(address => string) private diplomas;

    function storeHash(string calldata hash) external {
        diplomas[msg.sender] = hash;
    }

    function getHash(address wallet) external view returns (string memory) {
        return diplomas[wallet];
    }
}
