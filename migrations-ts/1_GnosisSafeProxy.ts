import {assertZeroNonce, fundDeployer, prepareVanityAddress, withdrawEther} from "./utils";

const SafeProxy = artifacts.require("GnosisSafeProxy");
const GnosisSafe = artifacts.require("GnosisSafe");
const GnosisSafeL2 = artifacts.require("GnosisSafeL2");

import {getDeployedAddresses, MAINNET} from "./deployed_addresses";

const DEPLOYER_MIN_BALANCE = web3.utils.toBN(1e18);


module.exports = function (deployer, network, accounts) {
    const [deployer_acc, deploy_e] = accounts;
    const DEPLOYED = getDeployedAddresses(network);
    // @ts-ignore
    deployer.then(async () => {
        let safeProxyInstance;
        if (DEPLOYED.DAO_MULTISIG) {
            safeProxyInstance = await GnosisSafe.at(DEPLOYED.DAO_MULTISIG);
            // apply interface of proxy target
            if (network === MAINNET.NAME) {
                safeProxyInstance = await GnosisSafe.at(safeProxyInstance.address);
            } else {
                safeProxyInstance = await GnosisSafeL2.at(safeProxyInstance.address);
            }
            // check that multisig is already set up
            const threashold = await safeProxyInstance.getThreshold();
            if (threashold.toNumber() === 0) {
                console.log("await safeProxyInstance.setup for existing wallet(...)");
                await safeProxyInstance.setup(
                    DEPLOYED.DEVELOPERS,
                    1,
                    "0x0000000000000000000000000000000000000000",
                    web3.utils.asciiToHex(""),
                    DEPLOYED.GNOSIS_SAFE_FALLBACK,
                    "0x0000000000000000000000000000000000000000",
                    0,
                    "0x0000000000000000000000000000000000000000");
            }
        } else {
            const deployer_vanity = deploy_e;
            await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
            await fundDeployer(web3, deployer_acc, deployer_vanity);
            {
                await deployer.deploy(SafeProxy, DEPLOYED.GNOSIS_SAFE_MASTERCOPY, {from: deployer_vanity});
                safeProxyInstance = await SafeProxy.deployed();
            }
            await withdrawEther(web3, deployer_vanity, deployer_acc);

            // apply interface of proxy target
            if (network === MAINNET.NAME) {
                safeProxyInstance = await GnosisSafe.at(safeProxyInstance.address);
            } else {
                safeProxyInstance = await GnosisSafeL2.at(safeProxyInstance.address);
            }

            console.log("await safeProxyInstance.setup(...)");
            // setup according to https://docs.gnosis.io/safe/docs/contracts_deployment/
            //     /// @dev Setup function sets initial storage of contract.
            //     /// @param _owners List of Safe owners.
            //     /// @param _threshold Number of required confirmations for a Safe transaction.
            //     /// @param to Contract address for optional delegate call.
            //     /// @param data Data payload for optional delegate call.
            //     /// @param fallbackHandler Handler for fallback calls to this contract
            //     /// @param paymentToken Token that should be used for the payment (0 is ETH)
            //     /// @param payment Value that should be paid
            //     /// @param paymentReceiver Address that should receive the payment (or 0 if tx.origin)
            //     function setup(
            //         address[] calldata _owners,
            //         uint256 _threshold,
            //         address to,
            //         bytes calldata data,
            //         address fallbackHandler,
            //         address paymentToken,
            //         uint256 payment,
            //         address payable paymentReceiver
            // )
            await safeProxyInstance.setup(
                DEPLOYED.DEVELOPERS,
                1,
                "0x0000000000000000000000000000000000000000",
                web3.utils.asciiToHex(""),
                DEPLOYED.GNOSIS_SAFE_FALLBACK,
                "0x0000000000000000000000000000000000000000",
                0,
                "0x0000000000000000000000000000000000000000"
            );
        }
    });
} as Truffle.Migration;
export {}
