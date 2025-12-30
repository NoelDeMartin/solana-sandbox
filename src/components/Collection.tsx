import { fetchCollectionNFTs, type NFT } from "@/lib/nfts";
import { useEffect, useState } from "react";

export default function Collection() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    fetchCollectionNFTs()
      .then((nfts) => {
        setNfts(nfts);
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        console.error(error);
      });
  }, []);

  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && (
        <div>Something went wrong, look at the console for more details.</div>
      )}
      {status === "success" && nfts.length > 0 && (
        <ul className="flex flex-col gap-2 mt-4 list-disc list-inside">
          {nfts.map((nft) => (
            <li key={nft.address}>{nft.name}</li>
          ))}
        </ul>
      )}
      {status === "success" && nfts.length === 0 && (
        <div>NFTs collection is empty</div>
      )}
    </div>
  );
}
