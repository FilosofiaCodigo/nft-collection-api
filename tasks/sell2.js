const { task } = require("hardhat/config");
const { getEnvVariable, getSeaPort, getWETHAddress } = require("./helpers");

/*const opensea = require("opensea-js");
const { WyvernSchemaName } = require('opensea-js/lib/types');
const OpenSeaPort = opensea.OpenSeaPort;

const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

const PrivateKeyWalletSubprovider = require("@0x/subproviders")
  .PrivateKeyWalletSubprovider;
*/

task("sell2", "Create English action sale on OpenSea")
    .addParam("tokenid", "NFT Token Id")
    .addParam("startprice", "Starting auction price")
    .setAction(async function (taskArguments, hre) {

        const owner_addr = getEnvVariable("OWNER_ADDRESS");
        const contract_addr = getEnvVariable("NFT_CONTRACT_ADDRESS");
        const network = getEnvVariable("SELECTED_NETWORK");
        const tokenId = taskArguments.tokenid;
        const startPrice = taskArguments.startprice;
        const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);

        const seaport = getSeaPort();

        const wethAddress = getWETHAddress();

        // Example: English auction.
        console.log("English auctioning an item in DAI...");

        console.log(`Account ${owner_addr} selling ${contract_addr} token #${tokenId} on ${network} for ${startPrice} payment ERC ${wethAddress}.`);

        try {
            console.log("A");
            
            const englishAuctionSellOrder = await seaport.createSellOrder({
              asset: {
                tokenId: tokenId,
                tokenAddress: contract_addr,
                // schemaName: WyvernSchemaName.ERC721
              },
              startAmount: startPrice,
              expirationTime: expirationTime,
              waitForHighestBid: true,
              paymentTokenAddress: wethAddress,
              accountAddress: owner_addr,
            });

            console.log(
              `Successfully created an English auction sell order! ${englishAuctionSellOrder.asset.openseaLink}\n`
            );

        } catch (error) {
            console.error(
                `Failed! ${error}\n`
            );
            console.log("yo");
        }
        console.log("end");
    });
