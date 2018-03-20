var express = require('express');
var router = express.Router();

var Dataset = require('../dataset/Dataset');
var Download = require('./Download');

var VerifyToken = require('../auth/VerifyToken');

// For file downloads...
var {URL} = require('url');
var http = require('http');
var https = require('https');

//
// This module implements the download API either as a redirect (default) or as a reverse proxy. In both
// cases the download request event is recorded in MongoDB.
//

// GETS A SINGLE DATASET FROM THE DATABASE AND DOWNLOADS THE ASSOCIATED FILE USING REVERSE PROXY.
//
router.get('/proxy/:id', VerifyToken('Everyone'), function (req, res) {
	
    Dataset.findById(req.params.id, { provider: 0, consumers: 0 }, function (err, dataset) {
		
		if (err) return res.status(500).send("There was a problem finding the dataset.");
        if (!dataset) return res.status(404).send("No dataset found.");
		
		Download.create({
						timestamp: new Date().toISOString(),
						userId: req.userId,
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
    });
});

// GETS A SINGLE DATASET FROM THE DATABASE AND DOWNLOADS THE ASSOCIATED FILE VIA A REDIRECT.
//
router.get('/:id', VerifyToken('Everyone'), function (req, res) {
	
    Dataset.findById(req.params.id, { provider: 0, consumers: 0 }, function (err, dataset) {
		
		if (err) return res.status(500).send("There was a problem finding the dataset.");
        if (!dataset) return res.status(404).send("No dataset found.");
		
		Download.create({
						timestamp: new Date().toISOString(),
						userId: req.userId,
						datasetId: req.params.id,
						url: dataset.url
					},
					function (err, dataset) {
						if (err) return res.status(500).send("There was a problem logging the download request to the database.");
						
						// determine if reverse proxy or redirect...
						res.redirect(dataset.url);
					})		
    });
});


module.exports = router;