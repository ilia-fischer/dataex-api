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
			
				const json_request = {"owner": user.email};

				await bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)
					
					.then((result) => {
						User.findOneAndUpdate({ email: req.query.email }, {balance: result.balance==null ? '0' : result.balance}, {new: true}, function(err, _users){
							res.status(200).send(_users);
						});
					})
					.catch((err) => {
						User.findOneAndUpdate({ email: req.query.email }, {balance: 'error'}, {new: true}, function(err, _users){
							res.status(200).send(_users);
						});
					});			 			
        });
    }
	else
	{
		const returned_users = [];
		
		User.find({}, async (err, users) => {
			if (err) return res.status(500).send("There was a problem finding the users.");

			for (var i=0; i<users.length; ++i)
			{
				const json_request = {"owner": users[i].email};
				
				await bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)
					
					.then((result) => {
						
						User.findOneAndUpdate({ email: users[i].email }, {balance: result.balance==null ? '0' : result.balance}, {multi: true}, function(err, _users) {
							returned_users.push(_users);
						});
					})
					.catch((err) => {

						User.findOneAndUpdate({ email: users[i].email }, {balance: 'error'}, {new: true}, function(err, _users){
							returned_users.push(_users);
						});			 			
					});
			}
			
			res.status(200).send(returned_users);
		});
	}
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken('Administrator'), function (req, res) {
	
    User.findById(req.params.id, function (err, user) {

        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
		
			const json_request = {"owner": user.email};
			
			bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/account', json_request)
			
					.then((result) => {

						User.findOneAndUpdate({ email: user.email }, {balance: result.balance==null ? '0' : result.balance}, {new: true}, function(err, _users){
							res.status(200).send(_users);
						});
					})
					.catch((err) => {
						User.findOneAndUpdate({ email: user.email }, {balance: 'error'}, {new: true}, function(err, _users){
							res.status(200).send(_users[0]);
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

module.exports = router;