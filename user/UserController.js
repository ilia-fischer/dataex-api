var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var Config = require('../config');

var bc = require('../blockchain/BlockChainHttpClient.js');

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
            password: hashedPassword,
            balance: '0'
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

        User.findOne({ email: req.query.email }, async (err, user) => {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(500).send("User not found.");

            const json_request = { "owner": user.role === 'Administrator' ? 'TRDX' : user.email };

            await bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)

                .then((result) => {
                    let r = JSON.parse(result);
                    if (r.balance != null && r.balance != "" && r.balance != "0") {
                        User.findOneAndUpdate({ email: req.query.email }, { $set: { balance: r.balance } }, { new: true }, function (err, _users) {
                            res.status(200).send(_users);
                        });
                    } else {
                        User.findOne({ email: req.query.email }, function (err, _users) {
                            res.status(200).send(_users);
                        });
                    }
                })
                .catch((err) => {
                    User.findOne({ email: req.query.email }, function (err, _users) {
                        res.status(200).send(_users);
                    });
                });
        });
    }
    else {
        const returned_users = [];

        User.find({}, async (err, users) => {
            if (err) return res.status(500).send("There was a problem finding the users.");

            var count = users.length;

            for (var i = 0; i < users.length; ++i) {
                const json_request = { "owner": users[i].role === 'Administrator' ? 'TRDX' : users[i].email };

                await bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)

                    .then((result) => {
                        let r = JSON.parse(result);
                        if (r.balance != null && r.balance != "" && r.balance != "0") {
                            User.findOneAndUpdate({ email: users[i].email }, { $set: { balance: r.balance } }, { new: true }, function (err, _users) {
                                returned_users.push(_users);

                                if (--count === 0) {
                                    res.status(200).send(returned_users);
                                }
                            });
                        } else {
                            User.findOne({ email: users[i].email }, function (err, _users) {
                                returned_users.push(_users);

                                if (--count === 0) {
                                    res.status(200).send(returned_users);
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        User.findOne({ email: users[i].email }, function (err, _users) {
                            returned_users.push(_users);

                            if (--count === 0) {
                                res.status(200).send(returned_users);
                            }
                        });
                    });
            }
        });
    }
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken('Administrator'), function (req, res) {

    User.findById(req.params.id, function (err, user) {

        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        const json_request = { "owner": user.role === 'Administrator' ? 'TRDX' : user.email };

        bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)

            .then((result) => {
                let r = JSON.parse(result);
                if (r.balance != null && r.balance != "" && r.balance != "0") {
                    User.findOneAndUpdate({ email: user.email }, { $set: { balance: r.balance } }, { new: true }, function (err, _user) {
                        res.status(200).send(_user);
                    });
                } else {
                    User.findOne({ email: user.email }, function (err, _user) {
                        res.status(200).send(_user);
                    });
                }
            })
            .catch((err) => {
                User.findOne({ email: user.email }, function (err, _user) {
                    res.status(200).send(_user);
                });
            });
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken('Administrator'), function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
});

// UPDATES USER'S BALANCE IN THE DATABASE
router.put('/:id', VerifyToken('Administrator'), function (req, res) {
    User.updateOne({ _id: req.params.id }, {
        $set: { balance: req.body.balance }
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the information to the database.");
            res.status(200).send(user);
        });
});

module.exports = router;