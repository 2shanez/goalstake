// Chainlink Functions: Verify if user has staked in any GoalStakeV3 goal
// Args: [userAddress, goalStakeV3Address]

const userAddress = args[0];
const contractAddress = args[1];

// Base Sepolia RPC
const rpcUrl = "https://sepolia.base.org";

// GoalStakeV3 ABI for reading stakes
// stakes(uint256 goalId, address user) returns (uint256)
const stakesSelector = "0x8f5e5faa"; // keccak256("stakes(uint256,address)")[:4]

// We'll check goals 0-50 (adjust as needed)
const maxGoalsToCheck = 50;

async function checkStakes() {
  for (let goalId = 0; goalId < maxGoalsToCheck; goalId++) {
    // Encode the call: stakes(goalId, userAddress)
    const goalIdHex = goalId.toString(16).padStart(64, "0");
    const userHex = userAddress.slice(2).toLowerCase().padStart(64, "0");
    const callData = stakesSelector + goalIdHex + userHex;

    const response = await Functions.makeHttpRequest({
      url: rpcUrl,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        jsonrpc: "2.0",
        method: "eth_call",
        params: [
          {
            to: contractAddress,
            data: callData,
          },
          "latest",
        ],
        id: goalId,
      },
    });

    if (response.error) {
      continue; // Skip errors, goal might not exist
    }

    const result = response.data?.result;
    if (result && result !== "0x" && result !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      // User has a stake > 0 in this goal
      const stakeAmount = parseInt(result, 16);
      if (stakeAmount > 0) {
        return Functions.encodeString("1"); // WIN - user joined a goal
      }
    }
  }

  return Functions.encodeString("0"); // LOSE - no stakes found
}

return await checkStakes();
