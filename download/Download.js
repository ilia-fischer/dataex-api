var mongoose = require('mongoose');
var DownloadSchema = new mongoose.Schema({
    timestamp: String,
	userId: String,
	datasetId: String,
    url: String
});
mongoose.model('Download', DownloadSchema);

module.exports = mongoose.model('Download');