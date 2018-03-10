var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Dataset = require('./Dataset');

var VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW DATASET
router.post('/', VerifyToken('Everyone'), function (req, res) {
    Dataset.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            format: req.body.format,
            url: req.body.url,
            notes: req.body.notes,
            provider: req.body.provider,
            consumers: req.body.consumers
        }, 
        function (err, dataset) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(dataset);
        });
});

// RETURNS ALL THE DATASETS IN THE DATABASE
router.get('/', VerifyToken('Everyone'), function (req, res) {
    Dataset.find({}, function (err, DATASETS) {
        if (err) return res.status(500).send("There was a problem finding the datasets.");
        res.status(200).send(DATASETS);
    });
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
router.delete('/:id', VerifyToken('Everyone'), function (req, res) {
    Dataset.findByIdAndRemove(req.params.id, function (err, dataset) {
        if (err) return res.status(500).send("There was a problem deleting the dataset.");
        res.status(200).send("Dataset: "+ dataset.name +" was deleted.");
    });
});

// UPDATES A SINGLE DATASET IN THE DATABASE
router.put('/:id', VerifyToken('Everyone'), function (req, res) {
    Dataset.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, dataset) {
        if (err) return res.status(500).send("There was a problem updating the dataset.");
        res.status(200).send(dataset);
    });
});


module.exports = router;