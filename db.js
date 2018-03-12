var mongoose = require('mongoose');
var connectionStr = process.env.MONGO_DB_CONNECTION_STR
if (!connectionStr) {
    connectionStr = 'mongodb://127.0.0.1:27017/dataex';
}

console.log('Connection string: ' + connectionStr);

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

var connectWithRetry = function() {
  return mongoose.connect(connectionStr, options).then(
    () => {
      console.log('Connected to: ' + connectionStr);
    },
    err => {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  );
};

connectWithRetry();
