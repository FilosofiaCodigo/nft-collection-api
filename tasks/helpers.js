const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");
const Web3ProviderEngine = require("web3-provider-engine");
const PrivateKeyWalletSubprovider = require("@0x/subproviders").PrivateKeyWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");

// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (!defaultValue) {
        throw `${key} is not defined and no default value was provided`;
    }
    return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
    /*return ethers.getDefaultProvider(getEnvVariable("NETWORK", "rinkeby"), {
        alchemy: getEnvVariable("ALCHEMY_KEY"),
    });*/
    return new ethers.providers.AlchemyProvider(getEnvVariable("SELECTED_NETWORK"), getEnvVariable("SELECTED_RPC_API_KEY"));
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
    return new ethers.Wallet(getEnvVariable("ACCOUNT_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(contractName, hre) {
    const account = getAccount();
    return getContractAt(hre, contractName, getEnvVariable("NFT_CONTRACT_ADDRESS"), account);
}

function getFactoryContract(contractName, hre) {
    const account = getAccount();
    return getContractAt(hre, contractName, getEnvVariable("FACTORY_CONTRACT_ADDRESS"), account);
}

function getSeaPort() {
    const opensea = require("opensea-js");

    const configs = require("../hardhat.config.js");

    const priv_key = getEnvVariable("ACCOUNT_PRIVATE_KEY");
    const rpc_url = getEnvVariable("SELECTED_RPC_URL");
    const chain_id = Number(getEnvVariable("CHAIN_ID", 4));

    console.log("rpc_url", rpc_url);

    const wallet_subprovider = new PrivateKeyWalletSubprovider(priv_key, chain_id);
    const rpc_subprovider = new RPCSubprovider({
      rpcUrl: rpc_url,
    });

    //console.log(wallet_subprovider, rpc_subprovider);

    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(wallet_subprovider);
    providerEngine.addProvider(rpc_subprovider);
    providerEngine.start();

    const options = {};

    options.networkName = ((net) => {
        switch(net) {
            case "mainnet":
            case "live": return opensea.Network.Main;
            case "rinkeby":
            default: return opensea.Network.Rinkeby;
        }
    })(getEnvVariable("SELECTED_NETWORK", "rinkeby"));

    options.apiKey = process.env["API_KEY"] ?? undefined;

    const seaport = new opensea.OpenSeaPort(
      providerEngine,
      options,
      (arg) => console.log(arg)
    );

    return seaport;
}

function getWETHAddress() {
    const network = getEnvVariable("SELECTED_NETWORK");
    switch (network) {
      case 'rinkeby':
        return "0xc778417e063141139fce010982780140aa0cd5ab";
      case 'mainnet':
        return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
      case 'maticmum':
        return "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
      case 'matic':
        return "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
      default:
        throw new Error(`No WETH address available for selected network ${network}`);
    }
}

module.exports = {
    getEnvVariable,
    getProvider,
    getAccount,
    getContract,
    getFactoryContract,
    getSeaPort,
    getWETHAddress
}
