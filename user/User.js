var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  role: String,
  password: String,
  balance: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');