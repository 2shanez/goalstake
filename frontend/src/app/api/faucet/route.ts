import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createWalletClient, http, parseEther, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

// Treasury wallet that sends funds
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY as `0x${string}`
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const

// Amounts to send
const ETH_AMOUNT = '0.005' // For gas (~50+ transactions)
const USDC_AMOUNT = '10' // For staking

// USDC ABI (just transfer)
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json()

    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    if (!TREASURY_PRIVATE_KEY) {
      console.error('TREASURY_PRIVATE_KEY not set')
      return NextResponse.json({ error: 'Faucet not configured' }, { status: 500 })
    }

    // Check if wallet already funded (using Supabase)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Check if already funded
      const { data: existing } = await supabase
        .from('faucet_claims')
        .select('id')
        .eq('wallet', wallet.toLowerCase())
        .single()

      if (existing) {
        return NextResponse.json({ 
          error: 'Wallet already funded',
          alreadyFunded: true 
        }, { status: 400 })
      }
    }

    // Create wallet client
    const account = privateKeyToAccount(TREASURY_PRIVATE_KEY)
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http('https://sepolia.base.org'),
    })

    // Send ETH for gas
    console.log(`Sending ${ETH_AMOUNT} ETH to ${wallet}...`)
    const ethTxHash = await client.sendTransaction({
      to: wallet as `0x${string}`,
      value: parseEther(ETH_AMOUNT),
    })
    console.log(`ETH sent: ${ethTxHash}`)

    // Send USDC for staking
    console.log(`Sending ${USDC_AMOUNT} USDC to ${wallet}...`)
    const usdcTxHash = await client.writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [wallet as `0x${string}`, parseUnits(USDC_AMOUNT, 6)],
    })
    console.log(`USDC sent: ${usdcTxHash}`)

    // Record the claim in Supabase
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      await supabase.from('faucet_claims').insert({
        wallet: wallet.toLowerCase(),
        eth_amount: ETH_AMOUNT,
        usdc_amount: USDC_AMOUNT,
        eth_tx: ethTxHash,
        usdc_tx: usdcTxHash,
      })
    }

    return NextResponse.json({
      success: true,
      eth: {
        amount: ETH_AMOUNT,
        txHash: ethTxHash,
      },
      usdc: {
        amount: USDC_AMOUNT,
        txHash: usdcTxHash,
      },
    })

  } catch (error) {
    console.error('Faucet error:', error)
    return NextResponse.json({ 
      error: 'Failed to send funds',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check if wallet was already funded
export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')

  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ funded: false })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data } = await supabase
    .from('faucet_claims')
    .select('created_at, eth_amount, usdc_amount')
    .eq('wallet', wallet.toLowerCase())
    .single()

  return NextResponse.json({
    funded: !!data,
    claim: data || null,
  })
}
