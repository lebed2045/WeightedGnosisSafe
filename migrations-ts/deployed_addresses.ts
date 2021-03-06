const GNOSIS = {
    GNOSIS_SAFE_FACTORY: "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
    GNOSIS_SAFE_MASTERCOPY: "0xd9db270c1b5e3bd161e8c8503c55ceabee709552",
    GNOSIS_SAFE_FALLBACK: "0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4",
}

const RINKEBY = {
    NAME: "rinkeby",

    DEVELOPERS: [
        "0xF2A961aF157426953e392F6468B0162F86B2aCBC",
        "0xabacaba1d39bee54c30c7d6dc85097302a106ef5",
        "0xb79EbAa162f92A3E5B8E0CE3446e8b4a4E5C0A4B",
        "0xace5686774d6b5dee84dc9f94fa803536415f172",
    ],
    POINTS: [
        50,
        40,
        30,
        20
    ],
    TESTERS: [
        "0x108E17e5d67102F5a7896056F5897f29674dEf6f",
        "0xffa3a3eFc1229116c9F1DEC71B788e6F89338C7c",
        "0xb0bfd8dd56e9122a84fa88ca56e199100de8266c",
        // additional
        "0x2a88a5c23A5e0c0638a56B3485AbFe038A5e8Ea4"
    ],

    GNOSIS_SAFE_FACTORY: GNOSIS.GNOSIS_SAFE_FACTORY,
    GNOSIS_SAFE_MASTERCOPY: GNOSIS.GNOSIS_SAFE_MASTERCOPY,
    GNOSIS_SAFE_FALLBACK: GNOSIS.GNOSIS_SAFE_FALLBACK,

    DAO_MULTISIG: "0x1604e6c50F48aBd827d1518E97790Ff70F8dcD63",

}

export {RINKEBY};

export function getDeployedAddresses(network: string): typeof RINKEBY {
    let NETWORK = {} as typeof RINKEBY;
    if (network == RINKEBY.NAME) NETWORK = RINKEBY; else
        throw `getDeployedAddresses error: unknown network ${network}`;
    return NETWORK;
}
