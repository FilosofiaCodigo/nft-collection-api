const { task } = require("hardhat/config");
const { getEnvVariable } = require("./helpers");

const opensea = require("opensea-js");
const { WyvernSchemaName } = require('opensea-js/lib/types');
const OpenSeaPort = opensea.OpenSeaPort;

const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

const PrivateKeyWalletSubprovider = require("@0x/subproviders")
  .PrivateKeyWalletSubprovider;


task("sell", "Create English action sale on OpenSea")
    .addParam("tokenId", "NFT Token Id")
    .addParam("startPrice", "Starting auction price")
    .setAction(async function (taskArguments, hre) {

      const infuraRpcSubprovider = new RPCSubprovider({
        rpcUrl: getEnvVariable("SELECTED_RPC_URL"),
      });

      const privateKeyWalletSubprovider = new PrivateKeyWalletSubprovider(getEnvVariable("ACCOUNT_PRIVATE_KEY"), 4);

      const providerEngine = new Web3ProviderEngine();
      providerEngine.addProvider(privateKeyWalletSubprovider);
      providerEngine.addProvider(infuraRpcSubprovider);
      providerEngine.start();
      
      let wyvernNetName = undefined; 
      switch (getEnvVariable("SELECTED_NETWORK")) {
        case 'rinkeby':
          wyvernNetName = "rinkeby";
          break;
        case 'mainnet':
          wyvernNetName = "mainnet";
          break;
        case 'maticmum':
          wyvernNetName = "mumbai";
          break;
        case 'matic':
          wyvernNetName = "polygon";
          break;
      }
      const seaport = new OpenSeaPort(
        providerEngine,
          {
            networkName: getEnvVariable("SELECTED_NETWORK"),
            // apiKey: API_KEY,
          },
          (arg) => console.log(arg)
        );
        
        // const token = (await seaport.api.getPaymentTokens({ symbol: 'ETH'})).tokens[0];
        // console.log(token)
        const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
        
        // Example: English auction.
        console.log("English auctioning an item in DAI...");
        let wethAddress = undefined;
        switch (getEnvVariable("SELECTED_NETWORK")) {
          case 'rinkeby':
            wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
            break;
          case 'mainnet':
            wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
            break;
          case 'maticmum':
            wethAddress = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
            break;
          case 'matic':
            wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
            break;
        }
        console.log(`Account ${getEnvVariable("OWNER_ADDRESS")} selling ${getEnvVariable("NFT_CONTRACT_ADDRESS")} token #${taskArguments.tokenId} on ${getEnvVariable("SELECTED_NETWORK")} for ${taskArguments.startPrice} ${wethAddress}.`);
        const englishAuctionSellOrder = await seaport.createSellOrder({
          asset: {
            tokenId: taskArguments.tokenId,
            tokenAddress: getEnvVariable("NFT_CONTRACT_ADDRESS"),
            schemaName: WyvernSchemaName.ERC721
          },
          startAmount: taskArguments.startPrice,
          expirationTime: expirationTime,
          waitForHighestBid: true,
          paymentTokenAddress: wethAddress,
          accountAddress: getEnvVariable("OWNER_ADDRESS"),
        });
          
        console.log(
          `Successfully created an English auction sell order! ${englishAuctionSellOrder.asset.openseaLink}\n`
        );
    });