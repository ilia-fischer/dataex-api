var mongoose = require('mongoose');
var TransactionSchema = new mongoose.Schema({
    datasetId: String,
    consumer: {
        consumerId: String
    },
    date: { type: Date, default: Date.now }
});
mongoose.model('Transaction', TransactionSchema);

module.exports = mongoose.model('Transaction');