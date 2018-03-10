var mongoose = require('mongoose');  
var DatesetSchema = new mongoose.Schema({  
  name: String,
  description: String,
  price: Number,
  category: [String],
  format: String,
  url: String,
  notes: String,
  provider: {
    providerId: String 
  },
  consumers: [{
      consumerId: String
  }]
});
mongoose.model('Dataset', DatesetSchema);

module.exports = mongoose.model('Dataset');