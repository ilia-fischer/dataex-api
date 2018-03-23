###BlockChain API Example
#### adding a dataset, user accounts will be created if not exist and initialized to balance 0.00

`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/dataset' --data '{"uuid":"3c1ae55e-2e3e-11e8-97d8-53e27aae480d", "name":"dataset1", "provider": { "providerid": "ken"}, "url":"whatever44", "price": 100.01, "description":"my fake description", "classification":["a","b","c"]}'`

#### querying dataset
`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/querydataset' --data '{"selector":{"provider":{"providerid": "ken"}}}'`

`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/querydataset' --data '{"selector":{"name":"dataset1"}}'`

#### accessing dataset, all accounts will be initialized if not exist, consumer account will be debitted based on the dataset price, provider account will be deposted based on dataset price
`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/accessdataset' --data '{"consumer":"ilia", "url":"whatever44"}'`

#### querying account
`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/account' --data '{"owner": "ken"}'`

#### querying TRDX (Admin) account
`curl -X POST -H 'Content-Type: application/json' -i 'http://35.196.144.57:3000/api/blockchain/account' --data '{"owner": "TRDX"}'`
