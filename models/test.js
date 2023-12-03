var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
  Name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  }

});

testSchema.index({Name: 'text'});

var Test = mongoose.model('Test', testSchema);
module.exports = Test;