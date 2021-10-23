"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawEther = exports.fundDeployer = exports.predictAddress = exports.prepareVanityAddress = exports.assertZeroNonce = void 0;
const web3_1 = __importDefault(require("web3"));
const RLP = require('rlp');
const DEPLOYER_MIN_BALANCE = web3_1.default.utils.toBN(1e18 * 1);
const ACCOUNT_DUST_THRESHOLD = web3_1.default.utils.toBN(1e18 * 0.00001);
async function assertZeroNonce(web3, deployerAddress) {
    const nonce = await web3.eth.getTransactionCount(deployerAddress);
    if (nonce !== 0)
        throw "deployer has nonce > 0";
}
exports.assertZeroNonce = assertZeroNonce;
async function prepareVanityAddress(web3, deployer_acc, deployer_vanity) {
    // return;
    if ((await web3.eth.getTransactionCount(deployer_vanity)) != 0) {
        await (0, exports.withdrawEther)(web3, deployer_vanity, deployer_acc);
        throw "vanity address already used";
    }
}
exports.prepareVanityAddress = prepareVanityAddress;
const predictAddress = async (web3, deployerAddress, nonceAdded = 0) => {
    let ownerNonce = (await web3.eth.getTransactionCount(deployerAddress)) + nonceAdded;
    // @ts-ignore
    let governorAddress = "0x" + web3.utils.sha3(RLP.encode([deployerAddress, ownerNonce])).slice(12).substring(14);
    return governorAddress;
};
exports.predictAddress = predictAddress;
const fundDeployer = async (web3, fromAccount, toAccount, minBalance = DEPLOYER_MIN_BALANCE) => {
    if (fromAccount === toAccount)
        return;
    const toAccountBalance = Number(await web3.eth.getBalance(toAccount));
    if (toAccountBalance > Number(minBalance.toString())) {
        console.log(`account ${toAccount} is already funded with ${toAccountBalance}`);
    }
    else {
        await web3.eth.sendTransaction({
            from: fromAccount,
            to: toAccount,
            value: DEPLOYER_MIN_BALANCE
        });
        console.log(`fundDeployer: account funded with ${Number(minBalance.toString()) / 1e18} ETH`);
    }
};
exports.fundDeployer = fundDeployer;
const withdrawEther = async (web3, fromAccount, toAccount) => {
    if (fromAccount === toAccount)
        return;
    // sometimes fromBalance doesn't count for the last tx, so we have to wait a bit
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const fromBalance = web3.utils.toBN(await web3.eth.getBalance(fromAccount));
    const gasPrice = web3.utils.toBN(await web3.eth.getGasPrice());
    const fromMaxToSend = fromBalance.sub(gasPrice.muln(21000));
    if (fromMaxToSend.gt(ACCOUNT_DUST_THRESHOLD)) {
        console.log(`withdrawEther: fromBalance ${fromBalance} gasPrice=${gasPrice} maxSend = ${fromMaxToSend}`);
        console.log(`withdrawEther: sending ${Number(fromMaxToSend.toString()) / 1e18} ETH from ${toAccount}`);
        // const fromBalance2 = web3.utils.toBN(await web3.eth.getBalance(fromAccount));
        // console.assert(fromBalance === fromBalance2);
        try {
            await web3.eth.sendTransaction({
                from: fromAccount,
                to: toAccount,
                value: fromMaxToSend,
                gasPrice
            });
            const fromBalanceLeft = await web3.eth.getBalance(fromAccount);
            console.log(`withdrawEther: ${fromAccount} balance left ${Number(fromBalanceLeft.toString()) / 1e18} ETH`);
        }
        catch (e) {
            console.log("withdrawEther error:", e.toString());
        }
    }
};
exports.withdrawEther = withdrawEther;
