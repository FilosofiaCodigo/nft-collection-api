const { task } = require("hardhat/config");
const { getEnvVariable, getProvider } = require("./helpers");

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
      
      const seaport = new OpenSeaPort(
        providerEngine,
          {
            networkName: getEnvVariable(NETWORK),
            // apiKey: API_KEY,
          },
          (arg) => console.log(arg)
        );
        
        // const token = (await seaport.api.getPaymentTokens({ symbol: 'ETH'})).tokens[0];
        // console.log(token)
        const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
        
        // Example: English auction.
        console.log("English auctioning an item in DAI...");
        const wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
          // NETWORK === "mainnet" || NETWORK === "live"
            // ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            // : "0xc778417e063141139fce010982780140aa0cd5ab";
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