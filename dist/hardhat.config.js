"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-web3");
require("solidity-coverage");
require("@nomiclabs/hardhat-waffle");
require("./tasks/accounts.ts");
require("./tasks/ogDistribution.ts");
require("./tasks/transfer-owner.ts");
require("./tasks/grant-role.ts");
require("./tasks/renounce-role.ts");
const { INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PRIVATE_KEY, PRIVATE_KEY_TESTNET } = process.env;
const accountsTestnet = PRIVATE_KEY_TESTNET
    ? [PRIVATE_KEY_TESTNET]
    : { mnemonic: MNEMONIC };
const accountsMainnet = PRIVATE_KEY
    ? [PRIVATE_KEY]
    : { mnemonic: MNEMONIC };
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
exports.default = {
    solidity: "0.8.9",
    networks: {
        hardhat: {},
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsMainnet,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsTestnet,
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsMainnet,
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsTestnet,
        }
    }
};
