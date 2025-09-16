import { createPublicClient, createWalletClient, http, formatEther, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Base network configuration
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://base-rpc.publicnode.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY; // For server-side operations

// Create public client for reading from Base
export const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});

// Create wallet client for writing to Base (if private key is available)
let walletClient: any = null;
if (PRIVATE_KEY) {
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(BASE_RPC_URL),
  });
}

// Token contract ABI (simplified ERC-20)
const TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// PollPulse token contract address (placeholder - would be deployed contract)
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`;

// Utility functions
export async function getTokenBalance(address: `0x${string}`): Promise<bigint> {
  if (!TOKEN_CONTRACT_ADDRESS) {
    // Mock balance for development
    return parseEther('100');
  }

  try {
    const balance = await publicClient.readContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return balance as bigint;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0n;
  }
}

export async function transferTokens(
  to: `0x${string}`,
  amount: bigint
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!walletClient || !TOKEN_CONTRACT_ADDRESS) {
    // Mock successful transfer for development
    console.log(`Mock transfer: ${formatEther(amount)} tokens to ${to}`);
    return { success: true, txHash: `mock_tx_${Date.now()}` };
  }

  try {
    const hash = await walletClient.writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amount],
    });

    // Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({ hash });

    return { success: true, txHash: hash };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transfer failed'
    };
  }
}

export async function getWalletBalance(address: `0x${string}`): Promise<string> {
  try {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return '0';
  }
}

export async function validateAddress(address: string): Promise<boolean> {
  try {
    // Basic validation - check if it's a valid hex address
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } catch {
    return false;
  }
}

export async function getTransactionHistory(address: `0x${string}`): Promise<any[]> {
  try {
    // In a real implementation, you would query the blockchain for transaction history
    // For now, return mock data
    return [
      {
        hash: '0x123...',
        from: '0xabc...',
        to: address,
        value: '0.01',
        timestamp: new Date(),
        type: 'received'
      }
    ];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

// Reward distribution functions
export async function rewardUserForVote(userAddress: `0x${string}`, amount: number = 10): Promise<boolean> {
  const amountWei = parseEther(amount.toString());
  const result = await transferTokens(userAddress, amountWei);
  return result.success;
}

export async function rewardUserForPollCreation(userAddress: `0x${string}`, amount: number = 50): Promise<boolean> {
  const amountWei = parseEther(amount.toString());
  const result = await transferTokens(userAddress, amountWei);
  return result.success;
}

export async function rewardUserForReferral(userAddress: `0x${string}`, amount: number = 100): Promise<boolean> {
  const amountWei = parseEther(amount.toString());
  const result = await transferTokens(userAddress, amountWei);
  return result.success;
}

// Gas estimation
export async function estimateGas(to: `0x${string}`, amount: bigint): Promise<bigint> {
  try {
    const gasEstimate = await publicClient.estimateGas({
      to,
      value: amount,
    });
    return gasEstimate;
  } catch (error) {
    console.error('Error estimating gas:', error);
    return 21000n; // Default gas limit
  }
}

// Network status
export async function getNetworkStatus(): Promise<{
  chainId: number;
  blockNumber: bigint;
  gasPrice: bigint;
}> {
  try {
    const [chainId, blockNumber, gasPrice] = await Promise.all([
      publicClient.getChainId(),
      publicClient.getBlockNumber(),
      publicClient.getGasPrice(),
    ]);

    return {
      chainId,
      blockNumber,
      gasPrice,
    };
  } catch (error) {
    console.error('Error fetching network status:', error);
    return {
      chainId: base.id,
      blockNumber: 0n,
      gasPrice: 0n,
    };
  }
}

