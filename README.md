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
| Google Cloud Storage | ✔ |
| IPFS | ✔ |

## Dependencies ⚒

```
npm install
```

## Run 🚀

```
npm start
```

## Auxiliary Scripts 👩‍⚕️

* `npm run shuffle`: randomizes the metadata to make the minting process exciting
* `npm run upload_images_update`: uploads images to IPFS
* `npm run upload_images_gcs`: uploads to Google Cloud Storage. Just make sure you have your `gcs.json` keyfile on the project directory
* `npm run remove_none_traits`: removes all traits marked as "none" to make the metadata rarity.tools friendly


## Checklist 📝

Make sure you follow all these steps when launching this API:

1. Upload this project to a linux virtual machine on the cloud (digital ocean, amazon web services etc..)
2. Replace your contract ABI `./Contract.json`
3. Replace your un revealed image on `./unrevealed/image.png`
4. Set the variables on the top of `scripts/start.js`, keep the `IS_REVEALED` variable set to `false` to start the server with _unrevealed mode_
5. Start the server with `npm start`
6. Put all your images and metadata on `./images/` and `./metadata/` respectively
7. run `npm shuffle`
8. run `npm remove_none_traits` if needed
9. Upload your images, choose between CGS or IPFS
  * Google Cloud Services
    * Put your `gcs.json` keyfile on this project directory
    * Run `npm upload_files_gcs`
    * Install the google cloud console and run this to open the files in the browser instead of downloading them by downloading the Google Cloud SDK and running this: `gsutil -m setmeta -h "Content-Type: image/png" -h "Content-Disposition: inline;" gs://YOURBUCKETNAME/*`. Remember to set `YOURBUCKETNAME`.
  * IPFS (guide coming soon)
10. Once you want to reveal the Images and Metadata set the `IS_REVEALED` to `true` on `scripts/start.js`, stop and restart the server
