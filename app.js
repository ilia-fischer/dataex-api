var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var DatasetController = require('./dataset/DatasetController');
app.use('/datasets', DatasetController);

var TransactionController = require('./transaction/TransactionController');
app.use('/transactions', TransactionController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;