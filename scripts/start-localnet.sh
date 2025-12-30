#! /bin/bash

RESET_FLAG=""
METAPLEX_PROGRAM_ID="CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"

if [[ "$*" == *"--reset"* ]]; then
    RESET_FLAG="--reset"
fi

if [ ! -f ./programs/metaplex_core.so ]; then
    echo "Downloading metaplex_core.so program..."

    mkdir -p ./programs
    solana program dump -u d $METAPLEX_PROGRAM_ID ./programs/metaplex_core.so

    if [ $? -eq 0 ]; then
        echo "Successfully downloaded metaplex program"
    else
        echo "Error: Failed to download metaplex program"
        exit 1
    fi
fi

echo "Starting localnet..."
solana-test-validator --bpf-program $METAPLEX_PROGRAM_ID ./programs/metaplex_core.so $RESET_FLAG
