// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {NewUserChallenge} from "../src/NewUserChallenge.sol";

contract DeployNewUserChallenge is Script {
    // Base Sepolia addresses
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    address constant GOAL_STAKE_V3 = 0x13b8eaEb7F7927527CE1fe7A600f05e61736d217;
    address constant FUNCTIONS_ROUTER = 0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 constant DON_ID = 0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;
    
    // Your Chainlink Functions subscription ID
    uint64 constant SUBSCRIPTION_ID = 561;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying NewUserChallenge...");
        console.log("Deployer:", deployer);
        console.log("Treasury:", deployer); // Treasury = deployer for now

        vm.startBroadcast(deployerPrivateKey);

        NewUserChallenge challenge = new NewUserChallenge(
            USDC,
            GOAL_STAKE_V3,
            deployer,          // treasury (you can change later)
            FUNCTIONS_ROUTER,
            DON_ID,
            SUBSCRIPTION_ID
        );

        console.log("NewUserChallenge deployed at:", address(challenge));
        
        // Note: You'll need to set the verification source after deployment:
        // challenge.setVerificationSource(sourceBytes);

        vm.stopBroadcast();
    }
}
