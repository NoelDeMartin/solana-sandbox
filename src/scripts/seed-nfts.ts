import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
} from "@metaplex-foundation/umi";
import { createV1, mplCore } from "@metaplex-foundation/mpl-core";
import { LOCALNET_RPC_URL } from "../lib/constants";
import { readWallet, walletExists } from "./lib/wallet";
import {
  collectionExists,
  createCollection,
  readCollection,
} from "./lib/collection";

async function main() {
  if (!walletExists()) {
    console.error("Wallet not found. Please seed account before minting NFTs.");
    process.exit(1);
  }

  const umi = createUmi(LOCALNET_RPC_URL).use(mplCore());
  const wallet = readWallet();
  const payer = createSignerFromKeypair(
    umi,
    umi.eddsa.createKeypairFromSecretKey(wallet.secretKey)
  );

  umi.use(signerIdentity(payer));

  const collection = collectionExists()
    ? readCollection()
    : await createCollection(umi);

  console.log("Using collection:", collection.publicKey.toString());

  const asset = generateSigner(umi);

  console.log("Creating NFT...");
  await createV1(umi, {
    asset,
    collection: collection.publicKey,
    name: "My NFT",
    uri: "https://acme.example/nft.json",
  }).sendAndConfirm(umi);

  console.log("NFT created successfully:", asset.publicKey.toString());
}

await main();
