import {assertZeroNonce, fundDeployer, prepareVanityAddress, withdrawEther} from "./utils";

const SafeProxy = artifacts.require("GnosisSafeProxy");
const GnosisSafe = artifacts.require("GnosisSafe");
const GnosisSafeL2 = artifacts.require("GnosisSafeL2");

import {getDeployedAddresses} from "./deployed_addresses";
import {GnosisSafeInstance, GnosisSafeProxyInstance} from "../types/truffle-contracts";

const DEPLOYER_MIN_BALANCE = web3.utils.toBN(1e18);


module.exports = function (deployer, network, accounts) {
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

    });
} as Truffle.Migration;
export {}
