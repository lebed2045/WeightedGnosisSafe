# Deployment

## Compile
```
npm install
npm audit fix
truffle compile
npm run generate-types
```

## Test
```
npm run test
npm run coverage
```

## Deploy contracts
```
npm run migrate -- --network rinkeby
```

## Verify
```
npm run verify
```
or
```
truffle run verify GnosisSafeProxy --network rinkeby
truffle run verify WeightModule@0x4bEa9242A6B36fcF57bC1aEF8Db922ed24265E22 --network rinkeby --debug
```
