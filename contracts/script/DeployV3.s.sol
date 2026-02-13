// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {VaadaV3} from "../src/VaadaV3.sol";

contract DeployV3Script is Script {
    // Base Mainnet addresses
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant MORPHO_VAULT = 0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61; // Gauntlet USDC Prime

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying VaadaV3 (with Morpho yield)");
        console.log("Deployer:", deployer);
        console.log("USDC:", USDC);
        console.log("Morpho Vault:", MORPHO_VAULT);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy VaadaV3: usdc, vault, oracle, treasury
        VaadaV3 vaada = new VaadaV3(USDC, MORPHO_VAULT, deployer, deployer);
        console.log("VaadaV3 deployed to:", address(vaada));

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("VaadaV3:", address(vaada));
        console.log("\nNext steps:");
        console.log("1. Deploy GoalStakeAutomationV3 with this VaadaV3 address");
        console.log("2. Call setOracle() on VaadaV3 to set automation as oracle");
    }
}
