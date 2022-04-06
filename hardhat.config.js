/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("./tasks/deploy.js");
require("./tasks/mint.js");
require("./tasks/sell.js");
require("@nomiclabs/hardhat-etherscan");

const { RINKEBY_RPC_URL, MAINNET_RPC_URL, MUMBAI_RPC_URL, POLYGON_RPC_URL, ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
    solidity: "0.8.1",
    defaultNetwork: "rinkeby",
    networks: {
        hardhat: {},
        rinkeby: {
            chainId: 4,
            url: `${RINKEBY_RPC_URL}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        ethereum: {
            chainId: 1,
            url: `${MAINNET_RPC_URL}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        mumbai: {
            chainId: 80001,
            url: `${MUMBAI_RPC_URL}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        polygon: {
            chainId: 137,
            url: `${POLYGON_RPC_URL}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
