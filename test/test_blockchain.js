//
// Testing NLP and Classifier functions 
//
// See https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
//

var utility = require("./test_utility.js");
var bc = require('../blockchain/BlockChainHttpClient.js');
var Config = require('../config');

//
// Blockchain client API tests
//
describe("Tests BlockChainClient.js...", function () {

    it("Test blockchainApiRequest() to add a dataset - expected to succeed", async () => {

        const json_request = { "owner": "desh", "url": "file:///myfolder/myfile.csv" };

        console.dir(JSON.stringify(json_request));

        await bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/dataset', json_request)

            .then((result) => {

                console.dir(result);
                utility.assert(result !== undefined);

            })
            .catch((err) => {
                return Promise.reject('Expected method to succeed [error: ' + err + ']');
            });

    }).timeout(5000);

});



