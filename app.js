var express = require('express');
var cors = require('cors');
var app = express();
var db = require('./db');

//Open up CORS
app.use(cors());

var UserController = require('./user/UserController');
app.use('/users', UserController);

var DatasetController = require('./dataset/DatasetController');
app.use('/datasets', DatasetController);

var DownloadController = require('./download/DownloadController');
app.use('/download', DownloadController);

var TransactionController = require('./transaction/TransactionController');
app.use('/transactions', TransactionController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

var BlockChainController = require('./blockchain/BlockChainController');
app.use('/api/blockchain', BlockChainController);

module.exports = app;