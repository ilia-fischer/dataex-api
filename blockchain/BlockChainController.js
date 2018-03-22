'use strict'
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


var fabric = require('./BlockChainClient')

router.get('/', fabric.overview);
router.post('/dataset', fabric.addDataSet);
router.post('/accessdataset', fabric.accessDataSet);
router.post('/account', fabric.queryAccount);
router.post('/querydataset', fabric.queryDataSet);

module.exports = router;