/// <reference types="bn.js" />
import Web3 from "web3";
export declare function assertZeroNonce(web3: Web3, deployerAddress: string): Promise<void>;
export declare function prepareVanityAddress(web3: Web3, deployer_acc: string, deployer_vanity: string): Promise<void>;
export declare const predictAddress: (web3: Web3, deployerAddress: string, nonceAdded?: number) => Promise<string>;
export declare const fundDeployer: (web3: Web3, fromAccount: string, toAccount: string, minBalance?: import("bn.js")) => Promise<void>;
export declare const withdrawEther: (web3: Web3, fromAccount: string, toAccount: string) => Promise<void>;
