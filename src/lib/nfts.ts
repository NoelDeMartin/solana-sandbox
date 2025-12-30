import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCore,
  getAssetV1GpaBuilder,
  updateAuthority,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";
import { LOCALNET_RPC_URL } from "./constants";

export interface NFT {
  address: string;
  name: string;
  uri: string;
  owner: string;
}

export async function fetchCollectionNFTs(): Promise<NFT[]> {
  const collectionAddress = String(import.meta.env.VITE_COLLECTION_ADDRESS);

  if (!collectionAddress) {
    throw new Error(
      "Collection address is missing, add VITE_COLLECTION_ADDRESS to your .env file"
    );
  }

  const umi = createUmi(LOCALNET_RPC_URL).use(mplCore());
  const collectionPk = publicKey(collectionAddress);
  const assets = await getAssetV1GpaBuilder(umi)
    .whereField(
      "updateAuthority",
      updateAuthority("Collection", [collectionPk])
    )
    .getDeserialized();

  return assets.map((asset) => ({
    address: asset.publicKey.toString(),
    name: asset.name,
    uri: asset.uri,
    owner: asset.owner.toString(),
  }));
}
