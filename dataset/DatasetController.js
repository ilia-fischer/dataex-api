var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Dataset = require('./Dataset');

var Config = require('../config');
var VerifyToken = require('../auth/VerifyToken');
var User = require('../user/User');
var Classifier = require('../classifier/classifier.js');
var bc = require('../blockchain/BlockChainHttpClient.js');

// For file upload (file is stored in memory only)...
var storage = multer.memoryStorage();
var upload = multer({storage : storage}).single('');

// CREATES A NEW DATASET FROM UPLOADED FILE (using NLP to generate categories on description and notes dataset fields)
/*
curl -X POST \
  http://127.0.0.1:3000/datasets/upload \
  -H 'Cache-Control: no-cache' \
  -H 'Postman-Token: f488e466-4389-af8b-d6a3-3c51f550f0d6' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTdmMDViZWMwZTU2NDA2NGVmMmMzNSIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMTEyMzYxMywiZXhwIjoxNTIxMjEwMDEzfQ.9zf9EHKc-TmjY7xWDIvpwDJifmrw0KheVcOGs4ny1fw' \
  -F '=@C:\finetech\dataex-api\files\water_balance_request.json'
*/
router.post('/upload', VerifyToken('Provider'), function (req, res) {
	
    User.findById(req.userId, function (err, user) {
		
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No user found.");
	
		upload(req, res, function(err) {
			
		    if (err) return res.status(500).send("There was a problem uploading the file.");

			var json = JSON.parse(req.file.buffer);
			var text = Config.enable_classifier==true ? json.description + ' ' + json.notes : '';
			
			Classifier.classify(text)
			 .then((categories) => {
				 
				const json_request = {  name: json.name,
										description: json.description,
										price: json.price,
										categories: categories,
										format: json.format,
										url: json.url,
										notes: json.notes,
										provider: { providerId: user.email },
										consumers: json.consumers};
										
				Dataset.create(json_request, function (err, dataset) {
						
						if (err) return res.status(500).send("There was a problem adding the information to the database.");
						
						json_request['uuid'] = dataset._id.toString();
						
						bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/dataset', json_request)
						
						.then((result) => {

							//console.dir(result);
							//console.dir(json_request);
							res.status(200).send(json_request);
							
						})
						.catch((err) => {
							return res.status(500).send("There was a problem adding the information to the blockchain.");
						});			 
					});			 
			  })    
			 .catch((err) => {
					res.status(500).send("There was a problem classifying the text.");
			  });
	    });
    });
});

// CREATES A NEW DATASET FROM JSON BODY (using NLP to generate categories on description and notes dataset fields)
/*
curl -X POST \
  http://127.0.0.1:3000/datasets \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: f42fbbff-a480-85f4-290f-dcdfedd42557' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTdmMDViZWMwZTU2NDA2NGVmMmMzNSIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMTAzNzcyNywiZXhwIjoxNTIxMTI0MTI3fQ.shGwh2kPkDQstCGfo-KvkB2JwhuXq5cGfNuWGG6yTzs' \
  -d '{
  "name": "Water-balance subregions (WBSs), soil types, and virtual crops for the five land-use time-frames used in the Central Valley Hydrologic Model (CVHM)",
  "description": "All about Water-balance subregions",
  "price": 100500,
  "format": "csv",
  "url": "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
  "notes": "This digital dataset defines the model grid, water-balance subregions (WBSs), soil types, and virtual crops for the five land-use time-frames in the transient..."
}'
*/
router.post('/', VerifyToken('Provider'), function (req, res) {
	
    User.findById(req.userId, function (err, user) {
		
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
		
		var text = Config.enable_classifier==true ? req.body.description + ' ' + req.body.notes : '';
		
        Classifier.classify(text)
         .then((categories) => {
			 
			const json_request = {
									name: req.body.name,
									description: req.body.description,
									price: req.body.price,
									categories: categories,
									format: req.body.format,
									url: req.body.url,
									notes: req.body.notes,
									provider: { providerId: user.email },
									consumers: req.body.consumers
								};

				Dataset.create(json_request, function (err, dataset) {
						
						if (err) return res.status(500).send("There was a problem adding the information to the database.");
						
						json_request['uuid'] = dataset._id.toString();
						
						bc.blockchainApiRequest(Config.blockchain_api_host, Config.blockchain_api_port, '/api/blockchain/dataset', json_request)
						.then((result) => {
							res.status(200).send(json_request);
						})
						.catch((err) => {
							return res.status(500).send("There was a problem adding the information to the blockchain.");
						});			 
				});			 
		    })
         .catch((err) => {
		        return res.status(500).send("There was a problem classifying the text.");
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
        if (req.query.provider === 'ALL') {
            Dataset.find({}, function (err, datasets) {
                if (err) return res.status(500).send("There was a problem finding the datasets.");
                res.status(200).send(datasets);
            });
        } else {
            Dataset.find({
                'provider': { "providerId": req.query.provider }
            }, function (err, datasets) {
                if (err) return res.status(500).send("There was a problem finding the datasets.");
                res.status(200).send(datasets);
            });
        }
    } else {
        Dataset.find({}, { provider: 0, consumers: 0 }, function (err, datasets) {
            if (err) return res.status(500).send("There was a problem finding the datasets.");
            res.status(200).send(datasets);
        });
    }
});

// GETS A SINGLE DATASET FROM THE DATABASE
router.get('/:id', VerifyToken('Everyone'), function (req, res) {
    Dataset.findById(req.params.id, { provider: 0, consumers: 0 }, function (err, dataset) {
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