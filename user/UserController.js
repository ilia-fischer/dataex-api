var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

var VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW USER
router.post('/', VerifyToken('Administrator'), function (req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send("There was a problem verifying the user.");
        if (user) return res.status(500).send("Email already exists.");

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
            });
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken('Administrator'), function (req, res) {
    if (req.query.email) {
        User.findOne({ email: req.query.email }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(500).send("User not found.");
            res.status(200).send(user);
        });
    }
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken('Administrator'), function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken('Administrator'), function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
});

module.exports = router;