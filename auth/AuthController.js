// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var VerifyToken = require('./VerifyToken');

router.post('/register', function (req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send("There was a problem verifying the user.");
        if (user) return res.status(500).send("Email already exists.");

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword,
            balance: '0'
        },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem registering the user.");
                // create a token
                var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            });
    });
});

router.get('/me', VerifyToken('Everyone'), function (req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
});

router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(404).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});

module.exports = router;