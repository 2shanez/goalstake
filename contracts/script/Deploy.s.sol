// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {GoalStake} from "../src/GoalStake.sol";
import {GoalStakeOracle} from "../src/GoalStakeOracle.sol";

contract DeployScript is Script {
    // Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying from:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy GoalStake with temporary oracle address (deployer)
        GoalStake goalStake = new GoalStake(USDC, deployer);
        console.log("GoalStake deployed to:", address(goalStake));

        // 2. Deploy Oracle
        GoalStakeOracle oracle = new GoalStakeOracle(address(goalStake));
        console.log("GoalStakeOracle deployed to:", address(oracle));

        // 3. Set oracle address on GoalStake
        goalStake.setOracle(address(oracle));
        console.log("Oracle set on GoalStake");

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("GoalStake:", address(goalStake));
        console.log("Oracle:", address(oracle));
        console.log("USDC:", USDC);
    }
}
