import "@nomiclabs/hardhat-truffle5";
import "solidity-coverage";
import "@nomiclabs/hardhat-waffle";
import "./tasks/accounts.ts";
import "./tasks/ogDistribution.ts";
import "./tasks/transfer-owner.ts";
import "./tasks/grant-role.ts";
import "./tasks/renounce-role.ts";
declare const _default: {
    solidity: string;
    networks: {
        hardhat: {};
        mainnet: {
            url: string;
            accounts: string[] | {
                mnemonic: string | undefined;
            };
        };
        rinkeby: {
            url: string;
            accounts: string[] | {
                mnemonic: string | undefined;
            };
        };
        polygon: {
            url: string;
            accounts: string[] | {
                mnemonic: string | undefined;
            };
        };
        mumbai: {
            url: string;
            accounts: string[] | {
                mnemonic: string | undefined;
            };
        };
    };
};
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default _default;
