import {assertZeroNonce, fundDeployer, prepareVanityAddress, withdrawEther} from "./utils";

const SafeProxy = artifacts.require("GnosisSafeProxy");
const GnosisSafe = artifacts.require("GnosisSafe");
const WeightModule = artifacts.require("WeightModule");

// @ts-ignore
import {getDeployedAddresses} from "./deployed_addresses";
import {GnosisSafeInstance, GnosisSafeProxyInstance} from "../types/truffle-contracts";

const DEPLOYER_MIN_BALANCE = web3.utils.toBN(1e18);


module.exports = function (deployer, network, accounts) {
    const [deployer_acc, alice, bob, carl] = accounts;
    const DEPLOYED = getDeployedAddresses(network);
    // @ts-ignore
    deployer.then(async () => {
        let safeProxyInstance: GnosisSafeProxyInstance;

        await deployer.deploy(SafeProxy, DEPLOYED.GNOSIS_SAFE_MASTERCOPY);
        safeProxyInstance = await SafeProxy.deployed();
        let safeInstance = await GnosisSafe.at(safeProxyInstance.address);

        console.log("await safeProxyInstance.setup(...)");

        await safeInstance.setup(
            DEPLOYED.DEVELOPERS,
            1,
            "0x0000000000000000000000000000000000000000",
            web3.utils.asciiToHex(""),
            DEPLOYED.GNOSIS_SAFE_FALLBACK,
            "0x0000000000000000000000000000000000000000",
            0,
            "0x0000000000000000000000000000000000000000"
        );

        console.log("await deploy WeightModule");
        await deployer.deploy(WeightModule, safeProxyInstance.address);
        const wModule = await WeightModule.deployed();

        console.log("await wModule.transferOwnership");
        await wModule.transferOwnership(safeInstance.address);

        console.log("await WeightModule.setupOwnersWithPoints");
        // for the multisig call of:

        // const contractModule = new web3.eth.Contract(wModule.abi, wModule.address);
        // const rawTx = contractModule.methods.setupOwnersWithPoints(
        //     DEPLOYED.DEVELOPERS,
        //     DEPLOYED.POINTS,
        //     40
        // ).encodeABI();
        // console.log("rawTx", rawTx);
        //
        // const ethAdapterOwner1 = new Web3Adapter({
        //     web3,
        //     signerAddress: deployer_acc
        // })
        //
        // const safeSdk: Safe = await Safe.create({ethAdapter: ethAdapterOwner1, safeAddress: safeInstance.address})
        //
        // const safeTransaction = await safeSdk.createTransaction(rawTx);
        //
        // const owner1Signature = await safeSdk.signTransaction(safeTransaction);
        //
        // const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
        // await executeTxResponse.transactionResponse?.wait()
    });
} as Truffle.Migration;
export {}
