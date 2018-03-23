var express = require('express');
var router = express.Router();

var Dataset = require('../dataset/Dataset');
var DataAccess = require('./DataAccess');

var Config = require('../config');
var bc = require('../blockchain/BlockChainHttpClient.js');

var User = require('../user/User');

var VerifyToken = require('../auth/VerifyToken');

// For file downloads...
var {URL} = require('url');
var http = require('http');
var https = require('https');

// Checks consumer is valid for this dataset
function checkIsValidConsumer(consumers, userId, user_role)
{
	// Permissioning only applies where user is a Consumer
	if (user_role==='Consumer')
	{
		for (var i=0; i<consumers.length; ++i) {
			if (consumers[0].consumerId === userId) return true;
		}	
		
		return false;	
	}
	
    return true;	
}

// Checks provider is valid for this dataset
function checkIsValidProvider(providerId, userId, user_role)
{
	// Permissioning only applies where user is a Provider
	if (user_role==='Provider')
	{
		return (providerId===userId)
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
		
		Dataset.findById(req.params.id, { url: 1, consumers : 1, provider: 1}, function (err, dataset) {
		
			if (err) return res.status(500).send("There was a problem finding the dataset.");
			if (!dataset) return res.status(404).send("No dataset found.");
			if (!checkIsValidConsumer(dataset.consumers, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
			if (!checkIsValidProvider(dataset.provider.providerId, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
			
			const json_request = {"consumer": user.email, "url": dataset.url};
			
			bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/accessdataset', json_request)
				
				.then((result) => {

					//console.dir(result);
					
					DataAccess.create({
							timestamp: new Date().toISOString(),
							userId: user.email,
							role: req.user_role,
							datasetId: req.params.id,
							url: dataset.url
						},
						function (err, dataset) {
							if (err) return res.status(500).send("There was a problem logging the download request to the database.");
							
							const downloadUrl = new URL(dataset.url);
							
							if (downloadUrl.protocol=='https:')
							{
									https.get(downloadUrl, response => {
									response.pipe(res);
								});	
							}
							else
							if (downloadUrl.protocol=='http:')
							{
									http.get(downloadUrl, response => {
									response.pipe(res);
								});	
							}
							else
							{
								res.status(404).send("Unsupported protocol.");
							}
						})		
				})
				.catch((err) => {
					return res.status(500).send("There was a problem adding the information to the blockchain.");
				});			 			
		});
    });	
});

// GETS A SINGLE DATASET FROM THE DATABASE AND DOWNLOADS THE ASSOCIATED FILE VIA A REDIRECT.
//
router.get('/:id', VerifyToken('Everyone'), function (req, res) {
	
	User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
	
		Dataset.findById(req.params.id, { url: 1, consumers : 1, provider: 1}, function (err, dataset) {

			if (err) return res.status(500).send("There was a problem finding the dataset.");
			if (!dataset) return res.status(404).send("No dataset found.");
			if (!checkIsValidConsumer(dataset.consumers, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
			if (!checkIsValidProvider(dataset.provider.providerId, user.email, req.user_role)) return res.status(403).send("User is not permissioned to use this dataset.");
			
			const json_request = {"consumer": user.email, "url": dataset.url};
			
			bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/accessdataset', json_request)
				
				.then((result) => {

					//console.dir(result);
					
					DataAccess.create({
						timestamp: new Date().toISOString(),
						userId: user.email,
						role: req.user_role,
						datasetId: req.params.id,
						url: dataset.url
					},
					function (err, dataset) {
						if (err) return res.status(500).send("There was a problem logging the download request to the database.");
						res.redirect(dataset.url);
					})		
				})
				.catch((err) => {
					return res.status(500).send("There was a problem adding the information to the blockchain.");
				});			 			
		});
    });
});

module.exports = router;