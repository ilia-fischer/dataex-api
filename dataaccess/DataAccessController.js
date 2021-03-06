var express = require('express');
var router = express.Router();

var Dataset = require('../dataset/Dataset');
var DataAccess = require('./DataAccess');

var Transaction = require('../transaction/Transaction');

var Config = require('../config');
var bc = require('../blockchain/BlockChainHttpClient.js');

var User = require('../user/User');

var VerifyToken = require('../auth/VerifyToken');

// For file downloads...
var { URL } = require('url');
var http = require('http');
var https = require('https');

// Checks consumer is valid for this dataset
function checkIsValidConsumer(consumers, userId, user_role) {
    // Permissioning only applies where user is a Consumer
    if (user_role === 'Consumer') {
        for (var i = 0; i < consumers.length; ++i) {
            if (consumers[i].consumerId === userId) return true;
        }

        return false;
    }

    return true;
}

// Checks provider is valid for this dataset
function checkIsValidProvider(providerId, userId, user_role) {
    // Permissioning only applies where user is a Provider
    if (user_role === 'Provider') {
        return providerId === userId;
    }

    return true;
}

//
// This module implements the download API either as a redirect (default) or as a reverse proxy. In both
// cases the download request event is recorded in MongoDB.
//

// GETS A SINGLE DATASET FROM THE DATABASE AND DOWNLOADS THE ASSOCIATED FILE USING REVERSE PROXY.
//
router.get('/proxy/:id', VerifyToken('Everyone'), function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Dataset.findById(req.params.id, { url: 1, consumers: 1, provider: 1 }, function (err, dataset) {

            if (err) return res.status(500).send("There was a problem finding the dataset.");
            if (!dataset) return res.status(404).send("No dataset found.");
            if (!checkIsValidConsumer(dataset.consumers, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
            if (!checkIsValidProvider(dataset.provider.providerId, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");

            const json_request = { "consumer": user.email, "uuid": dataset._id.toString() };

            bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/accessdataset', json_request)

                .then((result) => {

                    //console.dir(result);

                    Transaction.create({
                        consumer: {
                            consumerId: user.email
                        },
                        datasetId: dataset._id
                    },
                        function (err, transaction) {
                            if (err) return res.status(500).send("There was a problem logging the transaction to the database.");

                            const downloadUrl = new URL(dataset.url);

                            if (downloadUrl.protocol === 'https:') {
                                https.get(downloadUrl, response => {
                                    response.pipe(res);
                                });
                            }
                            else
                                if (downloadUrl.protocol === 'http:') {
                                    http.get(downloadUrl, response => {
                                        response.pipe(res);
                                    });
                                }
                                else {
                                    res.status(404).send("Unsupported protocol.");
                                }
                        });
                })
                .catch((err) => {
                    return res.status(500).send("There was a problem adding the information to the blockchain.");
                });
        });
    });
});

// GETS A SINGLE DATASET FROM THE DATABASE AND DOWNLOADS THE ASSOCIATED FILE VIA A REDIRECT.
//
router.get('/redirect/:id', VerifyToken('Everyone'), function (req, res) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Dataset.findById(req.params.id, { url: 1, consumers: 1, provider: 1 }, function (err, dataset) {

            if (err) return res.status(500).send("There was a problem finding the dataset.");
            if (!dataset) return res.status(404).send("No dataset found.");
            if (!checkIsValidConsumer(dataset.consumers, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
            if (!checkIsValidProvider(dataset.provider.providerId, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");

            const json_request = { "consumer": user.email, "uuid": dataset._id.toString() };

            bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/accessdataset', json_request)

                .then((result) => {

                    Transaction.create({
                        consumer: {
                            consumerId: user.email
                        },
                        datasetId: dataset._id
                    },
                        function (err, transaction) {
                            if (err) return res.status(500).send("There was a problem logging the transaction to the database.");
                            res.redirect(dataset.url);
                        });
                })
                .catch((err) => {
                    return res.status(500).send("There was a problem adding the information to the blockchain.");
                });
        });
    });
});

// CREATES A NEW TRANSACTION
router.get('/:id', VerifyToken('Consumer'), function (req, res) {

    User.findById(req.userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Dataset.findById(req.params.id, function (err, dataset) {
            if (err) return res.status(500).send("There was a problem finding the dataset.");
            if (!dataset) return res.status(404).send("No dataset found.");

            const json_request = { "consumer": user.email, "uuid": dataset._id.toString() };

            bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/accessdataset', json_request)

                .then((result) => {

                    //console.dir(result);

                    Transaction.create({
                        consumer: {
                            consumerId: user.email
                        },
                        datasetId: dataset.id
                    },
                        function (err, transaction) {
                            if (err) return res.status(500).send("There was a problem adding the information to the database.");
                            res.status(200).send(transaction);
                        });
                })
                .catch((err) => {
                    return res.status(500).send("There was a problem adding the information to the blockchain.");
                });
        });
    });
});

module.exports = router;