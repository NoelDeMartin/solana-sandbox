import { existsSync, writeFileSync, readFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { Umi } from "@metaplex-foundation/umi";
import { generateSigner } from "@metaplex-foundation/umi";
import { createCollectionV1 } from "@metaplex-foundation/mpl-core";
import { COLLECTION_PATH } from "../../lib/constants";

export function collectionExists() {
  return existsSync(COLLECTION_PATH);
}

export async function createCollection(umi: Umi) {
  const collectionDir = dirname(COLLECTION_PATH);
  const collection = generateSigner(umi);

  if (!existsSync(collectionDir)) {
    mkdirSync(collectionDir, { recursive: true });
  }

  console.log("Creating collection...");
  await createCollectionV1(umi, {
    collection,
    name: "Collection",
    uri: "https://acme.example/meta.json",
  }).sendAndConfirm(umi);

  writeFileSync(
    COLLECTION_PATH,
    JSON.stringify({
      publicKey: collection.publicKey.toString(),
      secretKey: Array.from(collection.secretKey),
    })
  );

  console.log("New collection created and saved to", COLLECTION_PATH);

  return collection;
}

export function readCollection() {
  const data = JSON.parse(readFileSync(COLLECTION_PATH, "utf-8"));

  return {
    publicKey: data.publicKey,
    secretKey: new Uint8Array(data.secretKey),
  };
}
