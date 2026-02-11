// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {GoalStakeV3} from "../src/GoalStakeV3.sol";

contract DeployV3Script is Script {
    // Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying GoalStakeV3 (with GoalType support)");
        console.log("Deployer:", deployer);
        console.log("USDC:", USDC);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy GoalStakeV3 with deployer as initial oracle (will update later)
        GoalStakeV3 goalStake = new GoalStakeV3(USDC, deployer);
        console.log("GoalStakeV3 deployed to:", address(goalStake));

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("GoalStakeV3:", address(goalStake));
        console.log("\nNext steps:");
        console.log("1. Deploy GoalStakeAutomationV3 with this GoalStakeV3 address");
        console.log("2. Call setOracle() on GoalStakeV3 to set automation as oracle");
    }
}
