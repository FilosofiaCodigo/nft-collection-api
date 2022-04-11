# NFT Collection API 🖼️

JSON API that servers ERC-721 compatible metadata for an NFT collection on the blockchain.

## Features 👀

| Feature | Supported |
|----------|------------ |
| MIT License | ✔ |
| Hide non minted NFTs | ✔ |
| Shuffle | ✔ |
| Reveal | ✔ |
| Handle _none_ traits | ✔ |
| IPFS | ✔ |
| Google Cloud Storage | ✔ |

## Dependencies ⚒

```
nvm use 16
npm install
npm install --dev
```

## Run 🚀

## Background Smart-Contract work

Keep an eye on https://status.opensea.io/
Get the right chain data from https://chainlist.org/


### Setup basic Env vars
- RPC urls are define by the Alchemy account. Code changes must be made to use Infura.
```
RINKEBY_RPC_URL=""
MAINNET_RPC_URL=""
MUMBAI_RPC_URL=""
POLYGON_RPC_URL="
```
- The `SELECTED_RPC_URL` must be one of the above
- The `SELECTED_RPC_API_KEY` must be the API from Alchemy.
- The `SELECTED_NETWORK` is the name of the network you want to deploy. See `hardhat.config.js` file for options.
- The `OWNER_ADDRESS` and `ACCOUNT_PRIVATE_KEY` are the address and account private key you are using to deploy the smart-contract.
- The `NFT_CONTRACT_ADDRESS` is determined by the `npx hardhat deploy` script 
- The `BASE_METADATA_URL` is stored in the smart-contract to determine where the metadata for the NFTs can be found. 
- The `MINT_PRICE` must match the same var on `NFT.sol`.

### Send images and metadata to IPFS

#### Via script
- Run `scripts/upload_images_ipfs.js`

#### Manually
- Execute first steps
```
npx ipfs-car --pack images --output images.car
# MANUALLY SET ALL METADATA IMAGE URL TO IPFS ADDRESS

npx ipfs-car --pack metadata --output metadata.car
```
- Manually host it online on NFT.storage or Pinata.
- Manually set `BASE_METADATA_URL` on `.env` file

#### Send images to google cloud storage and host the metadata on a private website
- Set up a Google Cloud Storage account
- Enable API access
- Download a key file and add to this repo root
- Run `scripts/upload_images_gcs.js`

### Deploy smart-contracts and mint a couple of tokens
```
source .env

npx hardhat compile --verbose
npx hardhat check-balance
npx hardhat deploy
# MANUALLY SET NFT_CONTRACT_ADDRESS ON ENV FILE
```
The `NFT_CONTRACT_ADDRESS` env var is determined by the `npx hardhat deploy` script 

**OPTIONAL** The `ETHERSCAN_API_KEY` env var can be set up here by creating an account on Etherscan that allow you to attach a smart-contract source to a deployed contract.
```
source .env
npx hardhat verify $NFT_CONTRACT_ADDRESS
```
Now set the URL for the NFTs metadata on the smart-contract. 
```
source .env
npx hardhat set-base-token-uri --base-url $BASE_METADATA_URL
```
Mint your first token!
```
npx hardhat mint --address $OWNER_ADDRESS
```

### Get listed on Open Sea
- Access https://opensea.io/get-listed and enter your smart-contract address
- Check if the NFT is shown correctly

### Sell it on opensea
```
npx hardhat sell --token-id 1 --start-price 0.001
```

## Development mode

```
npm start
```

## Production mode commands

```
npm i -g pm2
pm2 start scripts/start.js
pm2 kill
pm2 list
pm2 restart
pm2 stop [ID]
```

## Auxiliary Scripts 👩‍⚕️

* `npm run shuffle`: randomizes the metadata to make the minting process exciting
* `npm run upload_images_update`: uploads images to IPFS
* `npm run upload_images_ipfs`: uploads images to IPFS
* `npm run upload_images_gcs`: uploads images to Google Cloud Storage. Just make sure you have your `gcs.json` keyfile on the project directory
* `npm run remove_none_traits`: removes all traits marked as "none" to make the metadata rarity.tools friendly

## Checklist 📝

Make sure you follow all these steps when launching this API:

1. Upload this project to a linux virtual machine on the cloud (digital ocean, amazon web services etc..)
2. Replace your contract ABI `./Contract.json`
3. Replace your un revealed image on `./unrevealed/image.png`
4. Set the variables on the top of `scripts/start.js`, keep the `IS_REVEALED` variable set to `false` to start the server with _unrevealed mode_
5. Start the server with `npm start`
6. Put all your images and metadata on `./images/` and `./metadata/` respectively
  * Consider using FTP or scp, for example: `scp -r user@ssh.example.com:/path/to/remote/source /path/to/local/destination`
8. run `npm run shuffle`
9. run `npm run remove_none_traits` if needed
10. Upload your images, choose between CGS or IPFS
  * IPFS
    * Run `npm run upload_images_ipfs`
  * Google Cloud Services
    * Put your `gcs.json` keyfile on this project directory
    * Run `npm run upload_images_gcs`
    * Install the google cloud console and run this to open the files in the browser instead of downloading them by downloading the Google Cloud SDK and running this: `gsutil -m setmeta -h "Content-Type: image/png" -h "Content-Disposition: inline;" gs://YOURBUCKETNAME/*`. Remember to set `YOURBUCKETNAME`.
11. Once you want to reveal the Images and Metadata set the `IS_REVEALED` to `true` on `scripts/start.js`, stop and restart the server
