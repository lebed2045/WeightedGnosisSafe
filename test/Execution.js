"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
const setup_1 = require("./utils/setup");
const execution_1 = require("./utils/execution");
describe("GnosisSafe", async () => {
    const [user1, user2] = hardhat_1.waffle.provider.getWallets();
    const setupTests = hardhat_1.deployments.createFixture(async ({ deployments }) => {
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
            }`;
        const storageSetter = await (0, setup_1.deployContract)(user1, setterSource);
        const reverterSource = `
            contract Reverter {
                function revert() public {
                    require(false, "Shit happens");
                }
            }`;
        const reverter = await (0, setup_1.deployContract)(user1, reverterSource);
        return {
            safe: await (0, setup_1.getSafeWithOwners)([user1.address]),
            reverter,
            storageSetter
        };
    });
    describe("execTransaction", async () => {
        it('should revert if too little gas is provided', async () => {
            const { safe } = await setupTests();
            const tx = (0, execution_1.buildSafeTransaction)({ to: safe.address, safeTxGas: 1000000, nonce: await safe.nonce() });
            const signatureBytes = (0, execution_1.buildSignatureBytes)([await (0, execution_1.safeApproveHash)(user1, safe, tx, true)]);
            await (0, chai_1.expect)(safe.execTransaction(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, signatureBytes, { gasLimit: 10000000 })).to.be.revertedWith("GS010");
        });
    });
});
//# sourceMappingURL=Execution.js.map