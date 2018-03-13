var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Dataset = require('./Dataset');

var VerifyToken = require('../auth/VerifyToken');
var User = require('../user/User');

// CREATES A NEW DATASET
router.post('/', VerifyToken('Provider'), function (req, res) {

    User.findById(req.userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        Dataset.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            categories: req.body.categories,
            format: req.body.format,
            url: req.body.url,
            notes: req.body.notes,
            provider: { providerId: user.email },
            consumers: req.body.consumers
        },
            function (err, dataset) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(dataset);
            });
    });
});

var isProviderQuery = function (authProvider, authEveryone) {
    return function (req, res, next) {
        if (req.query.provider) return authProvider(req, res, next);
        return authEveryone(req, res, next);
    };
};

// RETURNS ALL THE DATASETS IN THE DATABASE
router.get('/', isProviderQuery(VerifyToken('Provider'), VerifyToken('Everyone')), function (req, res) {
    if (req.query.provider) {
        Dataset.find({
            'provider': { "providerId": req.query.provider }
        }, function (err, DATASETS) {
            if (err) return res.status(500).send("There was a problem finding the datasets.");
            res.status(200).send(DATASETS);
        });
    } else {
        Dataset.find({}, function (err, DATASETS) {
            if (err) return res.status(500).send("There was a problem finding the datasets.");
            res.status(200).send(DATASETS);
        });
    }
});

// GETS A SINGLE DATASET FROM THE DATABASE
router.get('/:id', VerifyToken('Everyone'), function (req, res) {
    Dataset.findById(req.params.id, function (err, dataset) {
        if (err) return res.status(500).send("There was a problem finding the dataset.");
        if (!dataset) return res.status(404).send("No dataset found.");
        res.status(200).send(dataset);
    });
});

// DELETES A DATASET FROM THE DATABASE
router.delete('/:id', VerifyToken('Provider'), function (req, res) {
    Dataset.findByIdAndRemove(req.params.id, function (err, dataset) {
        if (err) return res.status(500).send("There was a problem deleting the dataset.");
        res.status(200).send("Dataset: " + dataset.name + " was deleted.");
    });
});

// UPDATES A SINGLE DATASET IN THE DATABASE
router.put('/:id', VerifyToken('Provider'), function (req, res) {
    Dataset.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, dataset) {
        if (err) return res.status(500).send("There was a problem updating the dataset.");
        res.status(200).send(dataset);
    });
});


module.exports = router;