# BCVision

This project simulates small Ethereum and Solana environments used to anchor diploma hashes.

## Scripts

- `npm run dev` – start the Vite client and both local blockchains in parallel.
- `npm run deploy:eth --prefix servers` – deploy the Ethereum contract.
- `npm run deploy:solana --prefix servers` – deploy the Solana program.
- `npm run store_hash --prefix servers -- <blockchain> <hash> <key>` – store a diploma hash.
- `npm run get_hash --prefix servers -- <blockchain> <wallet>` – retrieve a hash.
- `npm run verify_diploma --prefix servers -- <hash> <wallet> <blockchain>` – verify ownership.

Diplomas and addresses are stored in `servers/diplomas.json` and `servers/addresses.json`.
