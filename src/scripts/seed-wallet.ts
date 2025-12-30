import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  sol,
  createSignerFromKeypair,
  type Umi,
  type PublicKey,
} from "@metaplex-foundation/umi";
import { LOCALNET_RPC_URL } from "../lib/constants";
import { walletExists, createWallet, readWallet } from "./lib/wallet";

async function getBalance(umi: Umi, publicKey: PublicKey) {
  const balance = await umi.rpc.getBalance(publicKey);

  return Number(balance.basisPoints) / 1e9;
}

async function main() {
  const solAmount = process.argv[2]
    ? Math.abs(parseFloat(process.argv[2]))
    : 10;
  const umi = createUmi(LOCALNET_RPC_URL);
  const wallet = walletExists() ? readWallet() : await createWallet(umi);

  if (solAmount === 0) {
    return;
  }

  const payer = createSignerFromKeypair(
    umi,
    umi.eddsa.createKeypairFromSecretKey(wallet.secretKey)
  );
  const initialBalance = await getBalance(umi, payer.publicKey);

  console.log("Using wallet:", payer.publicKey.toString());
  console.log(`Requesting ${solAmount} SOL airdrop...`);
  await umi.rpc.airdrop(payer.publicKey, sol(solAmount), {
    commitment: "confirmed",
  });

  for (let i = 0; i < 60; i++) {
    const balance = await getBalance(umi, payer.publicKey);

    if (balance !== initialBalance) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const balance = await umi.rpc.getBalance(payer.publicKey);
  console.log(`Final Balance: ${Number(balance.basisPoints) / 1e9} SOL`);
}

await main();
