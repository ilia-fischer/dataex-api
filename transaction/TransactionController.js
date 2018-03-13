var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Transaction = require('./Transaction');
var User = require('../user/User');
var Dataset = require('../dataset/Dataset');

var VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW TRANSACTION
router.post('/', VerifyToken('Consumer'), function (req, res) {

    User.findById(req.userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Dataset.findById(req.body.dataset, function (err, dataset) {
            if (err) return res.status(500).send("There was a problem finding the dataset.");
            if (!dataset) return res.status(404).send("No dataset found.");

            Transaction.create({
                consumer: {
                    consumerId: user.email
                },
                dataset: dataset.id
            },
                function (err, transaction) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database.");
                    res.status(200).send(transaction);
                });
        });
    });
});

var isProviderOrConsumerQuery = function (authProvider, authConsumer, authAdministrator) {
    return function (req, res, next) {
        if (req.query.provider) return authProvider(req, res, next);
        if (req.query.consumer) return authConsumer(req, res, next);
        return authAdministrator(req, res, next);
    };
};

// RETURNS ALL THE TRANSACTIONS IN THE DATABASE
router.get('/', isProviderOrConsumerQuery(VerifyToken('Provider'), VerifyToken('Consumer'), VerifyToken('Administrator')), function (req, res) {
    if (req.query.provider) {
        Dataset.find({
            'provider': { "providerId": req.query.provider }
        }, function (err, datasets) {
            const datasetIds = [];
            datasets.forEach(function (element) {
                datasetIds.push(element.id);
            });
            if (err) return res.status(500).send("There was a problem finding the datasets.");

            Transaction.find({
                'dataset': { $in: datasetIds }
            }
                , function (err, transactions) {
                    if (err) return res.status(500).send("There was a problem finding the transactions.");
                    res.status(200).send(transactions);
                });
        });
    } else if (req.query.consumer) {
        Transaction.find({
            'consumer': { "consumerId": req.query.consumer }
        }
            , function (err, transactions) {
                if (err) return res.status(500).send("There was a problem finding the transactions.");
                res.status(200).send(transactions);
            });
    } else {
        Transaction.find({}, function (err, transactions) {
            if (err) return res.status(500).send("There was a problem finding the transactions.");
            res.status(200).send(transactions);
        });
    }
});

// GETS A SINGLE TRANSACTION FROM THE DATABASE
router.get('/:id', VerifyToken('Administrator'), function (req, res) {
    Transaction.findById(req.params.id, function (err, transaction) {
        if (err) return res.status(500).send("There was a problem finding the transaction.");
        if (!transaction) return res.status(404).send("No transaction found.");
        res.status(200).send(transaction);
    });
});

// DELETES A TRANSACTION FROM THE DATABASE
router.delete('/:id', VerifyToken('Administrator'), function (req, res) {
    Transaction.findByIdAndRemove(req.params.id, function (err, transaction) {
        if (err) return res.status(500).send("There was a problem deleting the transaction.");
        res.status(200).send("Transaction: " + transaction.id + " was deleted.");
    });
});

module.exports = router;