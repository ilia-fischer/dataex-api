var mongoose = require('mongoose');
var connectionStr = process.env.MONGO_DB_CONNECTION_STR 
if (!connectionStr) {
    connectionStr = 'mongodb://127.0.0.1:27017/dataex';
}

console.log('Connection string: ' + connectionStr);

mongoose.connect(connectionStr);
