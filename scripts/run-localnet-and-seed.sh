#!/bin/bash

pnpm dev:solana 2>&1 > /dev/null &

echo "⏳ Waiting for Solana Localnet to start..."
until curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
  http://127.0.0.1:8899 | grep -q 'ok'; do
  sleep 1
done
echo "✅ Localnet is healthy!"

pnpm seed
echo "🚀 Seeding complete!"

pkill -f solana-test-validator

if [[ "$*" == *"--ci"* ]]; then
  PUBLIC_KEY=$(node -e "console.log(require('./keys/collection.json').publicKey)")

  echo "VITE_COLLECTION_ADDRESS=$PUBLIC_KEY" > .env
  echo "✅ Collection key written to .env"
fi
