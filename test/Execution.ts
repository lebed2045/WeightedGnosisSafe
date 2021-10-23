import { expect } from "chai";
import hre, { deployments, waffle } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { deployContract, getSafeWithOwners } from "./utils/setup";
import { safeApproveHash, buildSignatureBytes, executeContractCallWithSigners, buildSafeTransaction, executeTx, calculateSafeTransactionHash, buildContractCall } from "./utils/execution";
import { parseEther } from "@ethersproject/units";

describe("GnosisSafe", async () => {

    const [user1, user2] = waffle.provider.getWallets();

    const setupTests = deployments.createFixture(async ({ deployments }) => {
        await deployments.fixture();
        const setterSource = `
            contract StorageSetter {
                function setStorage(bytes3 data) public {
                    bytes32 slot = 0x4242424242424242424242424242424242424242424242424242424242424242;
                    // solhint-disable-next-line no-inline-assembly
                    assembly {
                        sstore(slot, data)
                    }
                }
            }`
        const storageSetter = await deployContract(user1, setterSource);
        const reverterSource = `
            contract Reverter {
                function revert() public {
                    require(false, "Shit happens");
                }
            }`
        const reverter = await deployContract(user1, reverterSource);
        return {
            safe: await getSafeWithOwners([user1.address]),
            reverter,
            storageSetter
        }
    })

    describe("execTransaction", async () => {

        it('should revert if too little gas is provided', async () => {
            const { safe } = await setupTests()
            const tx = buildSafeTransaction({ to: safe.address, safeTxGas: 1000000, nonce: await safe.nonce() })
            const signatureBytes = buildSignatureBytes([await safeApproveHash(user1, safe, tx, true)])
            await expect(
                safe.execTransaction(
                    tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, signatureBytes,
                    { gasLimit: 10000000 }
                )
            ).to.be.revertedWith("GS010")
        })
    })
})