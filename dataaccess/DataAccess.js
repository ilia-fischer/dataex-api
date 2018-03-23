var mongoose = require('mongoose');
var DataAccessSchema = new mongoose.Schema({
    timestamp: String,
    userId: String,
    role: String,
    datasetId: String,
    url: String
});
mongoose.model('DataAccess', DataAccessSchema);

module.exports = mongoose.model('DataAccess');