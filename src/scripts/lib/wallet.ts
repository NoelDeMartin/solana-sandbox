import { existsSync, writeFileSync, readFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { Umi } from "@metaplex-foundation/umi";
import { WALLET_PATH } from "../../lib/constants";

export function walletExists() {
  return existsSync(WALLET_PATH);
}

export async function createWallet(umi: Umi) {
  const walletDir = dirname(WALLET_PATH);
  const keypair = umi.eddsa.createKeypairFromSeed(new Uint8Array(32));

  if (!existsSync(walletDir)) {
    mkdirSync(walletDir, { recursive: true });
  }

  writeFileSync(
    WALLET_PATH,
    JSON.stringify({
      publicKey: keypair.publicKey.toString(),
      secretKey: Array.from(keypair.secretKey),
    })
  );

  console.log("New wallet created and saved to", WALLET_PATH);

  return keypair;
}

export function readWallet() {
  const data = JSON.parse(readFileSync(WALLET_PATH, "utf-8"));

  return {
    publicKey: data.publicKey,
    secretKey: new Uint8Array(data.secretKey),
  };
}
